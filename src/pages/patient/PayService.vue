<template>
  <div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Paiement de service</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">
                Paiement
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center mt-4 gap-4">
    <!-- Formulaire de paiement -->
    <form class="w-50" @submit.prevent="submitPayment">
      <div class="card border-0 shadow text-center px-4">
        <div class="d-flex justify-content-center mt-3 mb-2">
          <img id="img" src="../../assets/img/wecare.png" alt="Logo" />
        </div>

        <div class="card-body text-start">
          <!-- Patient -->
          <!-- <div class="mb-3">
            <label class="form-label">Patient</label>
            <input type="text" class="form-control" :value="patientName" disabled />
          </div> -->

          <!-- Service -->
          <div class="mb-3">
            <label class="form-label">Motif Paiement</label>
            <select
              class="form-control"
              v-model="payment.motif"
              @change="updatePrice"
            >
              <option value="" disabled>Choisir un service</option>
              <option
                v-for="service in services"
                :key="service.id"
                :value="service.name"
              >
                {{ service.name }}
              </option>
            </select>
          </div>

          <!-- Versé -->
          <div class="mb-3">
            <label class="form-label">Versé</label>
            <input
              type="number"
              class="form-control"
              v-model="payment.verser"
              @input="calculateReste"
            />
          </div>

          <!-- Total -->
          <div class="mb-3" hidden>
            <label class="form-label">Total</label>
            <input
              type="number"
              class="form-control"
              v-model="payment.total"
              readonly
            />
          </div>

          <!-- Reste -->
          <div class="mb-4">
            <label class="form-label">Reste</label>
            <input
              type="number"
              class="form-control"
              v-model="payment.reste"
              readonly
            />
          </div>

          <button id="btn" type="submit" class="btn btn-theme w-100">
            Valider
          </button>
        </div>
      </div>
    </form>

    <!-- Espace reçu -->
    <div class="w-100">
      <div class="card border-0 p-4" id="receipt">
        <!-- En-tête -->
        <div class="d-flex justify-content-between">
          <!-- Logo + infos -->
          <div class="d-flex align-items-start receipt-content">
            <img
              id="logo"
              src="../../assets/img/logo2-removebg-preview.png"
              alt="Logo"
            />
            <div>
              <small>
                <p class="mb-4"></p>
                <p class="mb-0 fw-bold small text-muted">Centre de santé</p>
                <p class="mb-0 fw-bold small text-muted">La Patience</p>
                <p class="mb-0 fw-bold small text-muted">
                  Situé près de la mosquée au carrefour caisse
                </p>
                <p class="mb-0 fw-bold small text-muted">
                  Contact: +237699637173
                </p>
              </small>
            </div>
          </div>

          <!-- Numéro / Date -->
          <div class="text-end">
            <p class="mb-4"></p>
            <p class="mb-0 small text-muted">
              <b>Reçu N° :</b> {{ payment.code }}
            </p>
            <p class="mb-0 small text-muted">
              <b>Date :</b> {{ formattedDate }}
            </p>
          </div>
        </div>
        <!-- Titre reçu -->
        <div class="flex-grow-1 text-center bg-light py-2 my-3">
          <h3 class="mb-0 fw-bold text-decoration-underline text-muted">
            REÇU
          </h3>
        </div>
        <!-- Corps du reçu -->
        <div v-if="paymentDone" class="receipt-body mb-5">
          <div class="row text-muted">
            <div class="col-6">
              <p><b>Dépôt de :</b> {{ patientName }}</p>
              <p><b>A :</b> CENTRE DE SANTÉ LA PATIENCE</p>
              <p><b>Motif :</b> {{ payment.motif }}</p>
              <p><b>Montant :</b> {{ payment.total }} FCFA</p>
            </div>
            <div class="col-6 text-end">
              <p><b>Montant en lettres :</b></p>
              <p class="fst-italic">{{ payment.lettre }}</p>
              <p><b>Reste :</b></p>
              <p class="fst-italic">{{ payment.reste }} FCFA</p>
            </div>
          </div>

          <hr />

          <div class="text-end mt-1">
            <p class="mb-1 text-muted">Signature personnel</p>
            <p class="fw-bold">{{ personnelName }}</p>
          </div>
        </div>

        <div v-else class="text-center text-secondary mt-5">
          <p>Aucun paiement enregistré</p>
        </div>
      </div>

      <!-- Bouton imprimer -->
      <div class="d-flex justify-content-end mt-2">
        <button @click="printReceipt" class="btn btn-outline-theme">
          <i class="bi bi-printer"></i> Imprimer
        </button>
      </div>
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
      services: [],
      personnel: {},
      paymentDone: false,
      currentDate: new Date().toLocaleString("fr-FR"),
      payment: {
        motif: "",
        total: 0,
        verser: 0,
        reste: 0,
        patient_id: this.$route.params.patientId,
        id_per: null,
        lettre: "",
        etatCaisse: "attente",
      },
    };
  },
  mounted() {
    this.loadPersonnel();
    this.loadPatient();
    this.loadServices();
  },
  methods: {
    async loadPatient() {
      const token = localStorage.getItem("current_token");
      const id = this.$route.params.patientId;
      // console.log("Patient ID:", id);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/patients/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      this.patient = response.data.data.patient;
      // console.log("Patient Data:", this.patient);
      this.patientName = this.patient.first_name + " " + this.patient.last_name;
      console.log(this.patientName);
    },

    async loadServices() {
      const token = localStorage.getItem("current_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.services = response.data.data.services;
    },

    async loadPersonnel() {
      // const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
      // this.payment.id_per = authUser.id || null;
      const user = JSON.parse(localStorage.getItem("current_user"));

      console.log("Auth User ID:", user.id);
      if (!user.id) return;

      const token = localStorage.getItem("current_token");
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        this.personnel = response.data.data.user;
        // console.log("Personnel ID:", this.personnel);
        this.personnelName =
          this.personnel.first_name + " " + this.personnel.last_name;

        console.log("Personnel chargé :", this.personnelName);
      } catch (error) {
        console.error("Erreur lors du chargement du personnel :", error);
      }
    },

    updatePrice() {
      const service = this.services.find((s) => s.name === this.payment.motif);
      if (service) {
        this.payment.total = parseFloat(service.price);
        this.payment.verser = parseFloat(service.price);
        this.calculateReste();
      }
    },

    calculateReste() {
      this.payment.reste = this.payment.total - this.payment.verser;
    },

    async submitPayment() {
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.post(
          "http://127.0.0.1:8000/api/caisses",
          this.payment,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.data.success) {
          const createdPayment = response.data.data.payment;

          localStorage.setItem("current_payment_id", createdPayment.id);
          this.paymentDone = true;
          await this.loadPayment();
          this.currentDate = new Date().toLocaleString("fr-FR");
          this.$swal.fire({
            icon: "success",
            title: "Paiement enregistré !",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible d'enregistrer le paiement.",
        });
      }
    },

    async loadPayment() {
      const token = localStorage.getItem("current_token");
      const paymentId = localStorage.getItem("current_payment_id");

      if (!paymentId) {
        console.error("Aucun paiement trouvé.");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/caisses/${paymentId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      this.payment = response.data.data.payment;
      if (this.payment.created_at) {
        const date = new Date(this.payment.created_at);
        // Exemple : 19/09/2025 09:53
        const options = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        this.formattedDate = date.toLocaleString("fr-FR", options);
      }

      console.log("Détails du paiement:", this.paymentDetails);
    },

    printReceipt() {
      const element = document.getElementById("receipt");

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `recu-${this.patientName || "patient"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: "mm", format: "a5", orientation: "landscape" },
      };

      html2pdf().set(opt).from(element).save();
    },
  },
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
i.bi-printer {
  font-size: 1.2rem;
}

#receipt {
  width: 210mm;
  min-height: 148mm;
  background: #fff;
  color: #000;
  /* padding: 20mm; */
  font-family: "Courier New", monospace;
  /* border: 1px solid #ccc; */
  /* box-shadow: none; */
}

#receipt h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.receipt-body p {
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

#logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-right: -20px;
}

.receipt-content {
  font-size: 0.9rem;
  margin-left: -30px;
}

/* .receipt-body p {
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
} */

@media print {
  body * {
    visibility: hidden;
  }
  #receipt,
  #receipt * {
    visibility: visible;
  }
  #receipt {
    position: absolute;
    left: 100;
    top: 100;
    width: 100%;
  }
}
.receipt-content strong {
  font-weight: bold;
}
</style>
