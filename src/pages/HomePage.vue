<template>
   <div class="modal fade" id="createPatientModal" tabindex="-1" aria-labelledby="createPatientModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content border-0 shadow">

      <!-- Header -->
      <div class="border-0 text-center pt-4 adminuiux-content">
        <div class="d-flex justify-content-center mb-3">
          <img data-bs-img="light" id="modal-logo" src="../../assets/img/wecare.png" alt="Logo">
          <img data-bs-img="dark" id="modal-logo" src="../../assets/img/wecare.png" alt="Logo">
        </div>
        <h4 id="modal-title"><b>Créer un patient</b></h4>
      </div>

      <!-- Corps -->
      <div class="card-body px-5">
        <form @submit.prevent="submitPatientForm">

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Prénom</label>
              <input type="text" class="form-control" v-model="patientForm.first_name" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Nom</label>
              <input type="text" class="form-control" v-model="patientForm.last_name" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Téléphone</label>
              <input type="text" class="form-control" v-model="patientForm.phone" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Adresse</label>
              <input type="text" class="form-control" v-model="patientForm.address" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Situation matrimoniale</label>
              <select class="form-control" v-model="patientForm.matrimonial_situation" required>
                <option value="" disabled>Choisir la situation</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié(e)">Marié(e)</option>
                <option value="Divorcé(e)">Divorcé(e)</option>
                <option value="Veuf(ve)">Veuf(ve)</option>
              </select>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label d-block">Sexe</label>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="Male" v-model="patientForm.gender" required>
                <label class="form-check-label">Masculin</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" value="Female" v-model="patientForm.gender">
                <label class="form-check-label">Féminin</label>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Contact d'urgence</label>
              <input type="text" class="form-control" v-model="patientForm.emergency_contact" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Lieu de naissance</label>
              <input type="text" class="form-control" v-model="patientForm.place_of_birth" required>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Âge</label>
              <input type="number" class="form-control" v-model="patientForm.age" required>
            </div>
          </div>
        </form>
      </div>

      <!-- Pied -->
      <div class="border-0 pb-4 px-5 adminuiux-content">
        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Fermer</button>
          <button type="button" class="btn btn-theme" @click="submitPatientForm" :disabled="loading">
            {{ loading ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </div>

    </div>
  </div>
</div>

           
    <!-- Main Content -->
          <main class="adminuiux-content has-sidebar" onclick="contentClick()">
            <div class="container mt-4" id="main-content">
                <div class="row align-items-center">
                    <div class="col-12 col-lg-8 mb-4 mb-lg-5">
                        <div class="row align-items-center">
                            <div class="col-12 col-sm-auto mb-3 mb-sm-0">
                                <figure class="avatar avatar-120 coverimg rounded-circle"><img
                                        :src="userAvatar" alt=""></figure>
                            </div>
                            <div class="col-12 col-sm">
                                <h5 class="mb-0">{{ greeting }}</h5>
                                <h1 class="text-theme-1">{{ userName }}</h1>
                                <p class="text-secondary mb-0">
                                    Bienvenue sur votre tableau de bord ! Passez une excellente {{ timeOfDay }}.
                                </p>
                            </div>

                        </div>
                    </div>
                    <div class="col-100 col-lg-4 mb-4 text-end">
                        <button class="btn btn-theme" data-bs-toggle="modal" data-bs-target="#createPatientModal">
                            <i data-feather="plus" class="me-1"></i> Créer Patient
                        </button>
                        </div>
                </div>
                <div class="row">
                    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
                        <div class="card adminuiux-card">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <div
                                            class="avatar avatar-50 text-center rounded bg-success-subtle text-success-emphasis">
                                            <i class="bi bi-people fs-4"></i></div>
                                    </div>
                                    <div class="col px-0">
                                        <p class="h4 mb-0">1320</p>
                                        <p class="text-secondary small">Patients Récu</p>
                                    </div>
                                    <div class="col-auto">
                                        <div class="summarychart height-50 width-60"><canvas
                                                id="areachartgreen1"></canvas></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
                        <div class="card adminuiux-card">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center">
                                    <div class="col-auto">
                                        <div
                                            class="avatar avatar-50 text-center rounded bg-info-subtle text-info-emphasis">
                                            <i class="bi bi-person-badge fs-4"></i></div>
                                    </div>
                                    <div class="col">
                                        <p class="h4 mb-0">3</p>
                                        <p class="text-secondary small"> Personnel Active</p>
                                    </div>
                                    <div class="col-auto">
                                        <div class="summarychart height-50 width-60"><canvas
                                                id="areachartblue1"></canvas></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
                        <div class="card adminuiux-card">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center">
                                    <div class="col-auto">
                                        <div
                                            class="avatar avatar-50 text-center rounded bg-warning-subtle text-warning-emphasis">
                                            <i class="bi bi-hospital fs-4"></i></div>
                                    </div>
                                    <div class="col">
                                        <p class="h4 mb-0">5</p>
                                        <p class="text-secondary small">Chambre</p>
                                    </div>
                                    <div class="col-auto">
                                        <div class="summarychart height-50 width-60"><canvas
                                                id="areachartyellow1"></canvas></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
                        <div class="card adminuiux-card">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center">
                                    <div class="col-auto">
                                        <div
                                            class="avatar avatar-50 text-center rounded bg-danger-subtle text-danger-emphasis">
                                            <i class="bi bi-calendar-week fs-4"></i></div>
                                    </div>
                                    <div class="col">
                                        <p class="h4 mb-0">2</p>
                                        <p class="text-secondary small">Chambre Occupé</p>
                                    </div>
                                    <div class="col-auto">
                                        <div class="summarychart height-50 width-60"><canvas
                                                id="areachartred1"></canvas></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-lg-12 col-xxl-9">
                        <div class="row">
                            
                          
                            
                            <div class="col-12">
                                <div class="card adminuiux-card mb-4">
                                    <div class="card-header">
                                        <p class="h6">Patient Appointments</p>
                                    </div>
                                    <div class="card-body px-2">
                                        <table class="table" id="dataTable">
                                            <thead>
                                                <tr>
                                                    <th data-breakpoints="xs">Code</th>
                                                    <th data-breakpoints="xs">Date</th>
                                                    <th data-breakpoints="xs">Patient</th>
                                                    <th data-breakpoints="xs">Contact</th>
                                                    <th data-breakpoints="xs">Payer</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                              <tr v-for="patient in patients.patients" :key="patient.id">
                                                <td>{{ patient.slug }}</td>
                                                <td>
                                                  <p class="mb-0 fw-medium">{{ new Date(patient.created_at).toLocaleTimeString() }}</p>
                                                  <p class="text-secondary small">{{ new Date(patient.created_at).toLocaleDateString() }}</p>
                                                </td>
                                                <td>
                                                  <div class="row align-items-center">
                                                    <div class="col ps-0">
                                                      <p class="mb-0">{{ patient.first_name }} {{ patient.last_name }}</p>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td>
                                                  <p class="small">{{ patient.phone }}</p>
                                                </td>
                                                <td>
                                                  <span class="badge badge-sm light bg-yellow">payer</span>
                                                </td>
                                                <td>
                                                  <div class="dropdown d-inline-block">
                                                    <a class="btn btn-link no-caret" data-bs-toggle="dropdown">
                                                      <i class="bi bi-three-dots"></i>
                                                    </a>
                                                    <ul class="dropdown-menu dropdown-menu-end">
                                                      <li><a class="dropdown-item" href="javascript:void(0)">Edité</a></li>
                                                      <li><a class="dropdown-item" href="javascript:void(0)">Détailé</a></li>
                                                      <li><a class="dropdown-item theme-red" href="javascript:void(0)">Suprimé</a></li>
                                                    </ul>
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userName: "",
      greeting: "",
      timeOfDay: "",
      userAvatar: "../../assets/img/avatar.jpg",
      patients: [], // liste des patients
      patientForm: {
        first_name: "",
        last_name: "",
        phone: "",
        gender: "",
        address: "",
        emergency_contact: "",
        matrimonial_situation: "",
        place_of_birth: "",
        age: null
      },
      loading: false
    };
  },
  mounted() {
    this.setUserInfo();
    this.getPatients(); 
  },
  methods: {
    
    setUserInfo() {
      const user = JSON.parse(localStorage.getItem("current_user"));
      if (user) {
        this.userName = user.first_name + (user.last_name ? " " + user.last_name : "");
        if (user.picture) {
          const baseUrl = "http://127.0.0.1:8000/";
          this.userAvatar = baseUrl + user.picture; // met l'image du backend
        }
      }

      const hour = new Date().getHours();
      if (hour < 12) {
        this.greeting = "Bonjour !";
        this.timeOfDay = "matinée";
      } else if (hour < 18) {
        this.greeting = "Bon après-midi !";
        this.timeOfDay = "après-midi";
      } else {
        this.greeting = "Bonsoir !";
        this.timeOfDay = "soirée";
      }
    },

    async submitPatientForm() {
      this.loading = true;
      try {
        
    const token = localStorage.getItem("current_token");

    const response = await axios.post(`http://127.0.0.1:8000/api/patients`, 
      this.patientForm, 
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      }
    );

        if (response.data.success) {
          alert("Patient créé avec succès !");
          this.getPatients(); 
          this.patientForm = {
            first_name: "",
            last_name: "",
            phone: "",
            gender: "",
            address: "",
            emergency_contact: "",
            matrimonial_situation: "",
            place_of_birth: "",
            age: null
          };
          // fermer le modal
          const modal = document.getElementById("createPatientModal");
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
        }
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la création du patient.");
      } finally {
        this.loading = false;
      }
    },

    // récupérer les patients
    async getPatients() {
      try {
    
    const token = localStorage.getItem("current_token");

    const response = await axios.get(`http://127.0.0.1:8000/api/patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
        this.patients = response.data.data || [];
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement des patients.");
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
  background-color: blanchedalmond;
}

#modal-title {
  color: rgb(59, 105, 255);
}

.form-control:focus {
  border-color: rgb(59, 105, 255);
  box-shadow: 0 0 5px rgba(59, 105, 255, 0.4);
}

.btn-primary:hover {
  box-shadow: 3px 3px 3px rgba(59, 105, 255, 0.3);
}
</style>                    