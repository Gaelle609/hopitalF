<template>
  <div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Paiement de médicaments</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">Paiement</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4 gap-4 flex-wrap">
      <form class="card shadow border-0 p-4 w-100 w-md-75" @submit.prevent="submitPayment">
        <div class="text-center">
          <img id="img" src="../../assets/img/wecare.png" alt="Logo" />
          <h5 class="mt-3 text-theme-1 fw-bold">Formulaire de paiement</h5>
        </div>

        <div class="d-flex justify-content-end mb-3">
          <span
            class="badge bg-theme-1-subtle text-theme-1 fs-6 pointer d-flex align-items-center"
            title="Ajouter un champ"
            @click="addField"
          >
            <i class="bi bi-plus-lg me-1"></i> Ajouter un médicament
          </span>
        </div>
        <div class="col-md-6">
          <label class="form-label fw-semibold">Patient</label>
          <input type="text" class="form-control" v-model="patientQuery" @input="searchPatient" placeholder="Commencez à taper le nom du patient" autocomplete="off"/>
          <ul v-if="patientSuggestions.length" class="list-group position-absolute w-100 z-3">
            <li v-for="patient in patientSuggestions" :key="patient.id" class="list-group-item list-group-item-action pointer" @click="selectPatient(patient)">
              {{ patient.first_name }} {{ patient.last_name }}
            </li>
          </ul>
        </div>
        <br>
        <div id="inputField">
          <div v-for="(field, index) in fields" :key="index" class="border-0 rounded p-3 mb-3 bg-light-subtle position-relative">

            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-1">
              <h6 class="mb-0 text-theme-1 fw-bold">Médicament {{ index + 1 }}</h6>
              <button v-if="fields.length > 1" type="button" class="btn btn-sm btn-outline-danger" @click="removeField(index)"> 
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="row g-3">
             
              <div class="col-md-4 position-relative">
                <label class="form-label fw-semibold">Médicament</label>
                <input type="text" class="form-control" v-model="field.query" @input="searchMedicament(index)" placeholder="Tapez le nom du médicament" autocomplete="off" required/>
                <ul v-if="field.suggestions?.length" class="list-group position-absolute w-100 z-3">
                  <li v-for="med in field.suggestions" :key="med.id" class="list-group-item list-group-item-action pointer" @click="selectMedicament(index, med)">
                    {{ med.name }}
                  </li>
                </ul>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Quantité</label>
                <input type="number" class="form-control" v-model.number="field.quantity" min="1" @input="updateTotal(index)" placeholder="Saisir la quantité" required/>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Prix Unitaire (FCFA)</label>
                <input type="number" class="form-control" v-model.number="field.pu" readonly placeholder="0"/>
              </div>

            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-md-4">
            <label class="form-label fw-semibold">Montant total (FCFA)</label>
            <input type="number" class="form-control" :value="totalGlobal" readonly/>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold">Montant versé (FCFA)</label>
            <input type="number" class="form-control" v-model.number="montantVerse" @input="calculateResteGlobal" min="0" :max="totalGlobal" required/>
          </div>
          <div class="col-md-4" v-if="resteGlobal > 0">
            <label class="form-label fw-semibold text-danger">Reste à payer (FCFA)</label>
            <input type="number" class="form-control border-danger text-danger fw-bold" :value="resteGlobal" readonly/>
          </div>
        </div>

        <div class="mt-4 text-end">
          <button id="btn" type="submit" class="btn btn-theme w-100 py-2 fw-semibold">
            <i class="bi bi-check-circle me-2"></i> Valider le paiement
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import html2pdf from "html2pdf.js";

export default {
  data() {
    return {
      patient: {},
      patientName: "",
      patientQuery: "",
      patientSuggestions: [],
      patientIdSelected: null,
      medicaments: [],
      personnel: {},
      personnelName: "",
      paymentDone: false,
      formattedDate: "",
      fields: [{ medicament_id: "", quantity: 1, pu: 0, total: 0, query: "", suggestions: [] }],
      payment: { code: "", patient_id: null, id_per: null },
      montantVerse: 0,
      resteGlobal: 0
    };
  },
  computed: {
    totalGlobal() {
      return this.fields.reduce((sum, f) => sum + (f.total || 0), 0);
    },
  },
  watch: {
    totalGlobal(newVal) {
      this.montantVerse = newVal;
      this.calculateResteGlobal();
    }
  },
  mounted() {
    this.loadPersonnel();
    this.loadPatient();
    this.loadMedicaments();
  },
  methods: {
    async searchMedicament(index) {
      const field = this.fields[index];
      if (!field.query || field.query.length < 2) {
        field.suggestions = [];
        return;
      }
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.get(`http://127.0.0.1:8000/api/searchmed?query=${field.query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        field.suggestions = response.data.data.medicaments || [];
      } catch (error) {
        console.error(error);
      }
    },

    selectMedicament(index, med) {
      const field = this.fields[index];
      field.query = med.name;
      field.medicament_id = med.id;
      field.pu = parseFloat(med.price);
      field.quantity = 1;
      field.total = field.pu * field.quantity;
      field.suggestions = [];
      this.updateTotalGlobal();
    },

    updateTotal(index) {
      const field = this.fields[index];
      field.total = field.pu * field.quantity;
      this.updateTotalGlobal();
    },

    updateTotalGlobal() {
      // Le computed totalGlobal se met à jour automatiquement
      this.calculateResteGlobal();
    },

    calculateResteGlobal() {
      this.resteGlobal = Math.max(0, this.totalGlobal - (this.montantVerse || 0));
    },

    addField() {
      this.fields.push({ medicament_id: "", quantity: 1, pu: 0, total: 0, query: "", suggestions: [] });
    },
    
    removeField(index) {
      this.fields.splice(index, 1);
      this.updateTotalGlobal();
    },

    async loadPatient() {
      const token = localStorage.getItem("current_token");
      const id = this.$route.params.patientId;
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${id}`, 
      { headers: { Authorization: `Bearer ${token}` } });
      this.patient = response.data.data.patient;
      this.patientName = `${this.patient.first_name} ${this.patient.last_name}`;
      this.payment.patient_id = this.patient.id;
    },

    async loadMedicaments() {
      const token = localStorage.getItem("current_token");
      const response = await axios.get("http://127.0.0.1:8000/api/medicaments", 
      { headers: { Authorization: `Bearer ${token}` } });
      this.medicaments = response.data.data.medicaments;
    },

    async loadPersonnel() {
      const user = JSON.parse(localStorage.getItem("current_user"));
      if (!user?.id) return;
      const token = localStorage.getItem("current_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/users/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      this.personnel = response.data.data.user;
      this.personnelName = `${this.personnel.first_name} ${this.personnel.last_name}`;
      this.payment.id_per = this.personnel.id;
    },

    async submitPayment() {
      try {
        const token = localStorage.getItem("current_token");
        const user = JSON.parse(localStorage.getItem("current_user"));
        const payload = {
          medoc: this.fields.map(f => ({
            medicament_id: f.medicament_id,
            quantity: f.quantity,
            pu: f.pu,
            total: f.total,
            reste: this.resteGlobal // Ajout du reste pour chaque médicament
          })),
          patient_id: this.payment.patient_id,
          id_per: user.id,
          verser: this.montantVerse,
          reste: this.resteGlobal // Ajout du reste global
        };

        const response = await axios.post(
          "http://127.0.0.1:8000/api/caissemeds",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const payments = response.data.data.payment;
          if (payments.length > 0) this.payment = payments[0];
          this.paymentDone = true;
          this.formattedDate = new Date().toLocaleString("fr-FR");

          this.$swal.fire({
            icon: "success",
            title: "Paiement enregistré !",
            text: this.resteGlobal > 0 
              ? `Paiement enregistré avec un reste de ${this.resteGlobal} FCFA.`
              : "Le paiement a été enregistré avec succès.",
            timer: 2000,
            showConfirmButton: false
          });

          setTimeout(() => {
            this.$router.push("/paiements/non-imprimes");
          }, 2000);
        } else {
          this.$swal.fire({
            icon: "error",
            title: "Erreur",
            text: response.data.message || "Impossible d'enregistrer le paiement."
          });
        }
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible d'enregistrer le paiement. La quantité est insuffisante."
        });
      }
    },

    async searchPatient() {
      if (this.patientQuery.length < 2) {
        this.patientSuggestions = [];
        return;
      }

      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/search?query=${this.patientQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.patientSuggestions = response.data.data.patients || [];
      } catch (error) {
        console.error(error);
      }
    },

    selectPatient(patient) {
      this.patientQuery = `${patient.first_name} ${patient.last_name}`;
      this.patientIdSelected = patient.id;
      this.patientSuggestions = [];
      this.payment.patient_id = patient.id; 
    },
  }
};
</script>

<style scoped>
#img {
  height: 80px;
  width: 80px;
  border-radius: 70rem;
}
#btn:hover {
  box-shadow: 3px 3px 3px rgb(59, 105, 255);
}
#receipt {
  width: 210mm;
  min-height: 148mm;
  background: #fff;
  color: #000;
  font-family: "Courier New", monospace;
}
#logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-right: -20px;
}
.receipt-content {
  font-size: 0.9rem;
}
.pointer {
  cursor: pointer;
}
</style>