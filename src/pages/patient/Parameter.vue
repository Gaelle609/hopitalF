<template>
  <div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Paramètre du patient</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">Paramètre</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>

 
  <br>


  <!-- Table des patients -->
  <div class="row">
    <div class="col-12 col-lg-12 col-xxl-9 w-50">
      <div class="card adminuiux-card mb-4">
        <div class="card-header">
          <p class="h6">Prendre les paramètre</p>
        </div>
        <div class="card-body px-2">
          <!-- Affichage pendant le chargement -->
          <div v-if="loadingPatients" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-2">Chargement des patients...</p>
          </div>

          <!-- Table des patients -->
          <div v-else>
            <table v-if="patientList.length > 0"  class="table" id="dataTable">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prenom</th>
                  <th>Age</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="patient in patientList" :key="patient.id">
                  <td>{{ patient.first_name || '' }} </td>
                  <td>
                    <div class="row align-items-center">
                      <div class="col ps-0">
                        <p class="mb-0">{{ patient.last_name || '' }}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="small">{{ patient.age || 'N/A' }}</p>
                  </td>
                  <td>
                    <button
                      class="btn btn-theme badge badge-sm cp"
                      @click="selectPatient(patient)"
                    >
                      Paramètre
                    </button>
                  </td>
                  <!-- <td>
                    <div class="dropdown d-inline-block">
                      <a class="btn btn-link no-caret" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots"></i>
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item cp">Edité</a></li>
                        <li><a class="dropdown-item cp">Détailé</a></li>
                        <li><a class="dropdown-item theme-red cp">Suprimé</a></li>
                      </ul>
                    </div>
                  </td> -->
                </tr>
              </tbody>
            </table>

            <!-- Message si aucun patient -->
            <div v-else class="text-center py-5">
              <i class="bi bi-person-x display-1 text-muted"></i>
              <h5 class="mt-3 text-muted">Aucun patient enregistré</h5>
              <p class="text-muted">Commencez par ajouter des patients.</p>
              <button class="btn btn-primary" @click="getPatients()">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-12 col-xxl-3 w-50">
    <form  @submit.prevent="submitForm">
      <div class="card  shadow text-center px-4">
        <div class="d-flex justify-content-center mt-3 mb-2">
          <img id="img" src="../../assets/img/wecare.png" alt="Logo">
        </div>

        <div class="card-body text-start">
          <!-- Patient -->
          <!-- <div class="mb-3">
            <label class="form-label">Patient</label>
            <input type="text" class="form-control" :value="patientName" disabled />
          </div> -->

          <!-- Versé -->
          <div class="mb-3">
            <label class="form-label">Tension</label>
            <input type="number" v-model="consform.tension" class="form-control"/>
          </div>

          <div class="mb-3">
            <label class="form-label">Temperature</label>
            <input type="number" v-model="consform.temperature" class="form-control"/>
          </div>

          <!-- Total -->
          <div class="mb-3">
            <label class="form-label">Poids</label>
            <input type="number" v-model="consform.poids" class="form-control"/>
          </div>

          

          <div class="mb-3">
            <label class="form-label">Patient ID</label>
            <input type="text" class="form-control" v-model="consform.patient_id" disabled />
          </div>

          <button id="btn" type="submit" class="btn btn-theme w-100">Valider</button>
        </div>
      </div>
    </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
     
      patients: {}, 
      loading: false,
      loadingPatients: true,
      selectedPatient: null,
       consform: {
        temperature: "",
        tension: "",
        poids: 0,
        patient_id:null,
        id_per: null,
        
      }
    };
  },

  computed: {
    // Liste des patients extraite de l'objet patients
    patientList() {
      if (this.patients && this.patients.patients && Array.isArray(this.patients.patients)) {
        return this.patients.patients;
      }
      return [];
    },

    // // Nombre total de patients
    // totalPatients() {
    //   return this.patientList.length;
    // }
  },

  mounted() {
    this.getPatients();
  },

  methods: {
    selectPatient(patient) {
      this.selectedPatient = patient;
      this.consform.patient_id = patient.id; // ✅ met à jour le formulaire
      console.log("Patient sélectionné:", this.selectedPatient);
    },

    async deletePatient(patientId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
        try {
          const token = localStorage.getItem("current_token");
          await axios.delete(`http://127.0.0.1:8000/api/patients/${patientId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          this.$swal.fire({
            icon: 'success',
            title: 'Patient supprimé avec succès !',
            showConfirmButton: false,
            timer: 2000
          });
          
          this.getPatients();
        } catch (error) {
          console.error(error);
          this.$swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression du patient.'
          });
        }
      }
    },

    async submitForm() {
      this.loading = true;
      try {
        const token = localStorage.getItem("current_token");

        const response = await axios.post(`http://127.0.0.1:8000/api/consultations`, 
          this.consform, 
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          this.$swal.fire({
            icon: 'success',
            title: 'paramètre de patient enregistré avec succès !',
            showConfirmButton: false,
            timer: 2000
          });
          
          // Réinitialiser le formulaire
          this.consform = {
            temperature: "",
        tension: "",
        poids: 0,
        patient_id:null,
        id_per: null,
          };
          
          // // Fermer le modal
          // const modal = document.getElementById("createPatientModal");
          // const modalInstance = bootstrap.Modal.getInstance(modal);
          // modalInstance.hide();
        }
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Erreur lors de l'enregistrement du patient."
        });
      } finally {
        this.loading = false;
      }
    },

    async getPatients() {
      this.loadingPatients = true;
      try {
        const token = localStorage.getItem("current_token");

        if (!token) {
          throw new Error("Token d'authentification manquant");
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/caisse/done`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Réponse API complète:", response.data);
        
        // Stocker toute la réponse
        this.patients = response.data.data || {};
        
        console.log("Patients chargés:", this.patientList.length, "patients");
        
      } catch (error) {
        console.error("Erreur lors du chargement des patients:", error);
        this.patients = {};
        
        if (error.response?.status === 401) {
          alert("Session expirée. Veuillez vous reconnecter.");
        } else {
          alert("Erreur lors du chargement des patients.");
        }
      } finally {
        this.loadingPatients = false;
      }
    }
  }
};
</script>

<style scoped>
#modal-logo {
  height: 80px;
  width: 80px;
  border-radius: 70rem;
}

#modal-title {
  color: rgb(59, 105, 255);
}

.cp {
  cursor: pointer;
}

.form-control:focus {
  border-color: rgb(59, 105, 255);
  box-shadow: 0 0 5px rgba(59, 105, 255, 0.4);
}

.btn-primary:hover {
  box-shadow: 3px 3px 3px rgba(59, 105, 255, 0.3);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.table td {
  vertical-align: middle;
}

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
  font-family: 'Courier New', monospace;
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
  #receipt, #receipt * {
    visibility: visible;
  }
  #receipt {
    position: absolute;
    left: 100;
    top: 100;
    width: 100%;
  }}
.receipt-content strong {
  font-weight: bold;
}
</style>