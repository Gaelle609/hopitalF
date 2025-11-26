<template>
  <div>
    <!-- Modal Créer Personnel -->
    <div class="modal fade" id="createPersonnelModal" tabindex="-1" aria-labelledby="createPersonnelModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content border-0 shadow">
          <!-- Header -->
          <div class="border-0 text-center pt-4 adminuiux-content">
            <div class="d-flex justify-content-center mb-3">
              <img data-bs-img="light" id="modal-logo" src="../../assets/img/wecare.png" alt="Logo">
              <img data-bs-img="dark" id="modal-logo" src="../../assets/img/wecare.png" alt="Logo">
            </div>
            <h4 id="modal-title"><b class="text-theme-1">Créer un Personnel</b></h4>
          </div>

          <!-- Corps -->
          <div class="card-body px-5">
            <form @submit.prevent="submitPersonnelForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Prénom</label>
                  <input type="text" class="form-control" v-model="personnelForm.first_name" required>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Nom</label>
                  <input type="text" class="form-control" v-model="personnelForm.last_name" required>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Téléphone</label>
                  <input type="text" class="form-control" v-model="personnelForm.phone_number" required>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label d-block">Sexe</label>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="Masculin" v-model="personnelForm.gender" required>
                    <label class="form-check-label">Masculin</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" value="Féminin" v-model="personnelForm.gender">
                    <label class="form-check-label">Féminin</label>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Adresse</label>
                  <input type="text" class="form-control" v-model="personnelForm.adress" required>
                </div>

                <div class="mb-3 col-md-6">
                  <label class="form-label">Fonction</label>
                  <select class="form-control" v-model="personnelForm.role_id" required>
                    <option value="" disabled>Choisir une fonction</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">
                      {{ role.name }}
                    </option>
                  </select>

                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Age</label>
                  <input type="interger" class="form-control" v-model="personnelForm.age" :required="!isEditing">
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Photo de profil</label>
                  <input type="file" class="form-control" @change="handleFileUpload" accept="image/*">
                </div>
              </div>
            </form>
          </div>

          <!-- Pied -->
          <div class="border-0 pb-4 px-5 adminuiux-content">
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal" @click="resetForm">Fermer</button>
              <button type="button" class="btn btn-theme" @click="submitPersonnelForm" :disabled="loading">
                {{ loading ? "Enregistrement..." : "Enregistrer" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Personnel -->
     <div v-if="generatedPassword" class="alert alert-info mt-3">
  <strong>Mot de passe :</strong> {{ generatedPassword }}
</div>

    <div class="modal fade" id="viewPersonnelModal" tabindex="-1" aria-labelledby="viewPersonnelModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow">
          <!-- Header -->
          <div class="border-0 text-center pt-4 adminuiux-content">
            <h4 id="modal-title"><b class="text-theme-1">Détails du Personnel</b></h4>
          </div>

          <!-- Corps -->
          <div class="card-body px-5" v-if="selectedPersonnel">
            <div class="text-center mb-4">
              <img :src="selectedPersonnel.picture ? baseUrl + selectedPersonnel.picture : '../../assets/img/avatar.jpg'" 
                   alt="Avatar" class="rounded-circle" style="width: 120px; height: 120px; object-fit: cover;">
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <p class="text-secondary mb-1">Prénom</p>
                <p class="fw-bold">{{ selectedPersonnel.first_name }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <p class="text-secondary mb-1">Nom</p>
                <p class="fw-bold">{{ selectedPersonnel.last_name }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <p class="text-secondary mb-1">Email</p>
                <p class="fw-bold">{{ selectedPersonnel.email }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <p class="text-secondary mb-1">Téléphone</p>
                <p class="fw-bold">{{ selectedPersonnel.phone_number }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <p class="text-secondary mb-1">Sexe</p>
                <p class="fw-bold">{{ selectedPersonnel.gender === 'Male' ? 'Masculin' : 'Féminin' }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <p class="text-secondary mb-1">Adresse</p>
                <p class="fw-bold">{{ selectedPersonnel.adress }}</p>
              </div>
            </div>
          </div>

          <!-- Pied -->
          <div class="border-0 pb-4 px-5 adminuiux-content">
            <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="row align-items-center">
      <div class="col-12 col-lg-8 mb-4 mb-lg-5">
        <div class="row align-items-center">
          <div class="col-12 col-sm-auto mb-3 mb-sm-0">
            <figure class="avatar avatar-120 coverimg rounded-circle">
              <img :src="userAvatar" alt="">
            </figure>
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
        <button class="btn btn-theme" data-bs-toggle="modal" data-bs-target="#createPersonnelModal" @click="openCreateModal">
          <i data-feather="plus" class="me-1"></i> Créer Personnel
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row">
      <div class="col-12 col-lg-6 col-xxl-3 mb-4">
        <div class="card adminuiux-card">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="avatar avatar-50 text-center rounded bg-success-subtle text-success-emphasis">
                  <i class="bi bi-person-badge fs-4"></i>
                </div>
              </div>
              <div class="col px-0">
                <p class="h4 mb-0">{{ totalPersonnel }}</p>
                <p class="text-secondary small">Personnel Total</p>
              </div>
              <div class="col-auto">
                <div class="summarychart height-50 width-60">
                  <canvas id="areachartgreen1"></canvas>
                </div>
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
                <div class="avatar avatar-50 text-center rounded bg-info-subtle text-info-emphasis">
                  <i class="bi bi-people fs-4"></i>
                </div>
              </div>
              <div class="col">
                <p class="h4 mb-0">{{ totalPersonnel }}</p>
                <p class="text-secondary small">Personnel Actif</p>
              </div>
              <div class="col-auto">
                <div class="summarychart height-50 width-60">
                  <canvas id="areachartblue1"></canvas>
                </div>
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
                <div class="avatar avatar-50 text-center rounded bg-warning-subtle text-warning-emphasis">
                  <i class="bi bi-hospital fs-4"></i>
                </div>
              </div>
              <div class="col">
                <p class="h4 mb-0">5</p>
                <p class="text-secondary small">Chambre</p>
              </div>
              <div class="col-auto">
                <div class="summarychart height-50 width-60">
                  <canvas id="areachartyellow1"></canvas>
                </div>
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
                <div class="avatar avatar-50 text-center rounded bg-danger-subtle text-danger-emphasis">
                  <i class="bi bi-calendar-week fs-4"></i>
                </div>
              </div>
              <div class="col">
                <p class="h4 mb-0">2</p>
                <p class="text-secondary small">Chambre Occupé</p>
              </div>
              <div class="col-auto">
                <div class="summarychart height-50 width-60">
                  <canvas id="areachartred1"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DataTable -->
    <div class="row">
      <div class="col-12">
        <div class="card adminuiux-card mb-4">
          <div class="card-header">
            <p class="h6">Liste du Personnel</p>
          </div>
          <div class="card-body px-2">
            <table class="table" id="dataTable">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Nom Complet</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Sexe</th>
                  <th>Adresse</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="personnel in personnelList" :key="personnel.id">
                  <td>
                    <img :src="personnel.picture ? baseUrl + personnel.picture : '../../assets/img/avatar.jpg'" 
                         alt="Avatar" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                  </td>
                  <td>
                    <p class="mb-0 fw-medium">{{ personnel.first_name }} {{ personnel.last_name }}</p>
                  </td>
                  <td>
                    <p class="small mb-0">{{ personnel.matricule }}</p>
                  </td>
                  <td>
                    <p class="small mb-0">{{ personnel.phone_number }}</p>
                  </td>
                  <td>
                    <span class="badge" :class="personnel.gender === 'Masculin' ? 'bg-primary' : 'bg-pink'">
                      {{ personnel.gender === 'Masculin' ? 'Masculin' : 'Féminin' }}
                    </span>
                  </td>
                  <td>
                    <p class="small mb-0">{{ personnel.adress }}</p>
                  </td>
                  <td>
                    <div class="dropdown d-inline-block">
                      <a class="btn btn-link no-caret cp" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots"></i>
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                          <a class="dropdown-item cp" @click="viewPersonnel(personnel)">
                            <i class="bi bi-eye me-2"></i>Voir Détails
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item cp" @click="editPersonnel(personnel)">
                            <i class="bi bi-pencil me-2"></i>Modifier
                          </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <a class="dropdown-item theme-red cp" @click="deletePersonnel(personnel.id)">
                            <i class="bi bi-trash me-2"></i>Supprimer
                          </a>
                        </li>
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
 

</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userName: "",
      greeting: "",
      timeOfDay: "",
      generatedPassword:"",
      userAvatar: "../../assets/img/avatar.jpg",
      baseUrl: "http://127.0.0.1:8000/",
      personnelList: [],
      roles: [],
      personnelForm: {
        first_name: "",
        last_name: "",
        role_id: "",
        phone_number: "",
        gender: "",
        age: "",
        adress: "",
        password: "",
        picture: null
      },
      selectedPersonnel: null,
      loading: false,
      isEditing: false,
      editingId: null
    };
  },
  computed: {
    totalPersonnel() {
      return this.personnelList.length;
    }
  },
  mounted() {
    this.setUserInfo();
    this.getPersonnel();
    //  this.loadRole();
  },
  methods: {
    setUserInfo() {
      const user = JSON.parse(localStorage.getItem("current_user"));
      if (user) {
        this.userName = user.first_name + (user.last_name ? " " + user.last_name : "");
        if (user.picture) {
          this.userAvatar = this.baseUrl + user.picture;
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

    handleFileUpload(event) {
      this.personnelForm.picture = event.target.files[0];
    },

    async openCreateModal() {
    this.isEditing = false;
    this.editingId = null;
    await this.loadRole();
    this.resetForm();
  },


   async submitPersonnelForm() {
  this.loading = true;
  try {
    const token = localStorage.getItem("current_token");
    const formData = new FormData();

    Object.keys(this.personnelForm).forEach(key => {
      if (this.personnelForm[key] !== null && this.personnelForm[key] !== "") {
        formData.append(key, this.personnelForm[key]);
      }
    });

    let response;
    if (this.isEditing) {
      response = await axios.post(
        `${this.baseUrl}api/users/${this.editingId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
    } else {
      response = await axios.post(
        `${this.baseUrl}api/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      this.generatedPassword = response.data.data.password;
    }

    this.$swal.fire({
      icon: 'success',
      title: this.isEditing ? 'Personnel modifié avec succès !' : 'Personnel créé avec succès !',
      showConfirmButton: false,
      timer: 2000
    });

    this.getPersonnel();
    this.resetForm();
    

  } catch (error) {
    console.error(error);
    this.$swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.response?.data?.message || 'Erreur lors de l\'opération.'
    });
  } finally {
    this.loading = false;
  }
},


    async getPersonnel() {
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.get(`${this.baseUrl}api/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data.data.users);
        this.personnelList = response.data.data.users || [];
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors du chargement du personnel.'
        });
      }
    },

    viewPersonnel(personnel) {
      this.selectedPersonnel = personnel;
      const modal = new bootstrap.Modal(document.getElementById('viewPersonnelModal'));
      modal.show();
    },

    editPersonnel(personnel) {
      this.isEditing = true;
      this.editingId = personnel.id;
      this.personnelForm = {
        first_name: personnel.first_name,
        last_name: personnel.last_name,
        phone_number: personnel.phone_number,
        gender: personnel.gender,
        age: personnel.age,
        adress: personnel.adress,
        password: "",
        picture: null
      };
      
      const modal = new bootstrap.Modal(document.getElementById('createPersonnelModal'));
      document.getElementById('modal-title').querySelector('b').textContent = 'Modifier le Personnel';
      modal.show();
    },
 async loadRole() {
      const token = localStorage.getItem("current_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.roles = response.data.data.roles;
    },
    async deletePersonnel(id) {
      const result = await this.$swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Cette action est irréversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("current_token");
          await axios.delete(`${this.baseUrl}api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          this.$swal.fire({
            icon: 'success',
            title: 'Supprimé!',
            text: 'Le personnel a été supprimé avec succès.',
            showConfirmButton: false,
            timer: 2000
          });

          this.getPersonnel();
          window.location.reload();
        } catch (error) {
          console.error(error);
          this.$swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression du personnel.'
          });
        }
      }
    },

    resetForm() {
      this.personnelForm = {
        first_name: "",
        last_name: "",
        role_id: "",
        phone_number: "",
        gender: "",
        age: "",
        adress: "",
        password: "",
        picture: null
      };
      this.isEditing = false;
      this.editingId = null;
      document.getElementById('modal-title').querySelector('b').textContent = 'Créer un Personnel';
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

.btn-theme:hover {
  box-shadow: 3px 3px 3px rgba(59, 105, 255, 0.3);
}

.theme-red {
  color: #dc3545;
}

.theme-red:hover {
  background-color: #dc3545;
  color: white;
}

.bg-pink {
  background-color: #e83e8c !important;
}

.no-caret::after {
  display: none;
}
</style>