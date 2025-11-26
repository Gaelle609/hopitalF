<template>

  <div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Profile Utilisateurs</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">Profile</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <br>

  <section class="section profile">
    <div class="row g-4">

      <!-- Carte Profil -->
      <div class="col-12 col-md-4">
        <div class="card shadow-sm">
          <div class="card-body profile-card pt-4 d-flex flex-column align-items-center text-center">
            <img :src="preview || profileUrl || defaultAvatar"
                 class="rounded-circle mb-3"
                 style="height: 100px; width: 100px; object-fit: cover;">
            <h2 class="h5 text-theme-1">{{ first_name }} {{ last_name }}</h2>
            <p class="text-muted small">{{ matricule }}</p>
          </div>
        </div>
      </div>

      <!-- Informations -->
      <div class="col-12 col-md-8">
        <div class="card shadow-sm">
          <div class="card-body pt-3">

            <!-- Onglets -->
            <ul class="nav nav-tabs nav-tabs-bordered flex-wrap">
              <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Aperçu</button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit-info">Éditer le profil</button>
              </li>

              <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit-password">Modifier mot de passe</button>
              </li>
            </ul>

            <div class="tab-content pt-3">

              <!-- APERÇU -->
              <div class="tab-pane fade show active" id="profile-overview">
                <h5 class="card-title text-theme-1">Détails du Profil</h5>

                <div class="row mb-3">
                  <div class="col-sm-4 text-muted fw-semibold">Nom complet</div>
                  <div class="col-sm-8">{{ first_name }} {{ last_name }}</div>
                </div>

                <div class="row mb-3">
                  <div class="col-sm-4 text-muted fw-semibold">Fonction</div>
                  <div class="col-sm-8">{{ roleName }}</div>
                </div>

                <div class="row mb-3">
                  <div class="col-sm-4 text-muted fw-semibold">Matricule</div>
                  <div class="col-sm-8">{{ matricule }}</div>
                </div>

                <div class="row mb-3">
                  <div class="col-sm-4 text-muted fw-semibold">Téléphone</div>
                  <div class="col-sm-8">{{ phone_number }}</div>
                </div>

                <div class="row mb-3">
                  <div class="col-sm-4 text-muted fw-semibold">Adresse</div>
                  <div class="col-sm-8">{{ adress }}</div>
                </div>

                <div class="row mb-3">
                  <div class="col-sm-4 text-muted fw-semibold">Genre</div>
                  <div class="col-sm-8">{{ gender }}</div>
                </div>

                <div class="row mb-3">
                  <div class="col-sm-4 text-muted fw-semibold">Âge</div>
                  <div class="col-sm-8">{{ age }}</div>
                </div>

              </div>

              <!-- EDIT INFO -->
              <div class="tab-pane fade profile-edit pt-3" id="profile-edit-info">
                <form @submit.prevent="updateUser" class="row g-3" novalidate>

                  <div class="col-12">
                    <label class="form-label text-muted">Image</label>
                    <label class="btn btn-sm text-muted">
                      <i class="bi bi-camera-fill"></i> Choisir une image
                      <input type="file" class="d-none" accept="image/*" @change="onFileChange" />
                    </label>

                    <img v-if="preview" :src="preview" width="80" class="rounded mt-2">
                    <div v-if="errors.picture" class="text-danger small mt-1">{{ errors.picture }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-muted">Nom <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      :class="{'is-invalid': errors.first_name}"
                      v-model="first_name"
                      @input="clearError('first_name')"
                    />
                    <div v-if="errors.first_name" class="invalid-feedback">{{ errors.first_name }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-muted">Prénom <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control"
                      :class="{'is-invalid': errors.last_name}"
                      v-model="last_name"
                      @input="clearError('last_name')"
                    />
                    <div v-if="errors.last_name" class="invalid-feedback">{{ errors.last_name }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-muted">Téléphone <span class="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      class="form-control"
                      :class="{'is-invalid': errors.phone_number}"
                      v-model="phone_number"
                      @input="clearError('phone_number')"
                    />
                    <div v-if="errors.phone_number" class="invalid-feedback">{{ errors.phone_number }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-muted">Adresse</label>
                    <input 
                      type="text" 
                      class="form-control"
                      :class="{'is-invalid': errors.adress}"
                      v-model="adress"
                      @input="clearError('adress')"
                    />
                    <div v-if="errors.adress" class="invalid-feedback">{{ errors.adress }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label d-block text-muted">Sexe <span class="text-danger">*</span></label>
                    <div class="form-check form-check-inline">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        value="Masculin" 
                        v-model="gender"
                        @change="clearError('gender')"
                      >
                      <label class="form-check-label text-muted">Masculin</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        value="Féminin" 
                        v-model="gender"
                        @change="clearError('gender')"
                      >
                      <label class="form-check-label text-muted">Féminin</label>
                    </div>
                    <div v-if="errors.gender" class="text-danger small">{{ errors.gender }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-muted">Âge <span class="text-danger">*</span></label>
                    <input 
                      type="number" 
                      class="form-control"
                      :class="{'is-invalid': errors.age}"
                      v-model="age"
                      min="18"
                      max="100"
                      @input="clearError('age')"
                    />
                    <div v-if="errors.age" class="invalid-feedback">{{ errors.age }}</div>
                  </div>

                  <div class="col-12 text-center">
                    <button type="submit" class="btn btn-theme px-4" :disabled="isSubmitting">
                      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      Sauvegarder
                    </button>
                  </div>

                </form>
              </div>

              <!-- EDIT PASSWORD -->
              <div class="tab-pane fade pt-3" id="profile-edit-password">

                <form @submit.prevent="updatePassword" class="row g-3" novalidate>

                  <div class="col-md-12">
                    <label class="form-label text-muted">Ancien mot de passe <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <input 
                        :type="showCurrentPassword ? 'text' : 'password'" 
                        class="form-control"
                        :class="{'is-invalid': passwordErrors.current_password}"
                        v-model="updatePasswordForm.current_password"
                        @input="clearPasswordError('current_password')"
                      />
                      <button 
                        class="btn btn-outline-secondary" 
                        type="button"
                        @click="showCurrentPassword = !showCurrentPassword"
                      >
                        <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div v-if="passwordErrors.current_password" class="text-danger small mt-1">
                      {{ passwordErrors.current_password }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-muted">Nouveau mot de passe <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <input 
                        :type="showNewPassword ? 'text' : 'password'" 
                        class="form-control"
                        :class="{'is-invalid': passwordErrors.new_password}"
                        v-model="updatePasswordForm.new_password"
                        @input="clearPasswordError('new_password')"
                      />
                      <button 
                        class="btn btn-outline-secondary" 
                        type="button"
                        @click="showNewPassword = !showNewPassword"
                      >
                        <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div v-if="passwordErrors.new_password" class="text-danger small mt-1">
                      {{ passwordErrors.new_password }}
                    </div>
                    <small class="text-muted">Minimum 8 caractères</small>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label text-muted">Confirmer mot de passe <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <input 
                        :type="showConfirmPassword ? 'text' : 'password'" 
                        class="form-control"
                        :class="{'is-invalid': passwordErrors.confirm_password}"
                        v-model="updatePasswordForm.confirm_password"
                        @input="clearPasswordError('confirm_password')"
                      />
                      <button 
                        class="btn btn-outline-secondary" 
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div v-if="passwordErrors.confirm_password" class="text-danger small mt-1">
                      {{ passwordErrors.confirm_password }}
                    </div>
                  </div>

                  <div class="col-12 text-center">
                    <button type="submit" class="btn btn-theme px-4" :disabled="isSubmittingPassword">
                      <span v-if="isSubmittingPassword" class="spinner-border spinner-border-sm me-2"></span>
                      Sauvegarder
                    </button>
                  </div>

                </form>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  </section>

</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      matricule: "",
      phone_number: "",
      adress: "",
      gender: "",
      age: "",
      roleName: "",
      profileUrl: "",
      defaultAvatar: "../../assets/img/avatar.jpg",
      file: null,
      preview: null,

      updatePasswordForm: {
        current_password: "",
        new_password: "",
        confirm_password: "",
      },

      userId: null,
      errors: {},
      passwordErrors: {},
      isSubmitting: false,
      isSubmittingPassword: false,
      
      // Variables pour afficher/masquer les mots de passe
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },

  async mounted() {
    try {
      const user = JSON.parse(localStorage.getItem("current_user"));
      const roles = JSON.parse(localStorage.getItem("current_role"));
      const token = localStorage.getItem("current_token");

      if (!user || !token) return;

      this.userId = user.id;
     
      const response = await axios.get(
        `http://127.0.0.1:8000/api/users/${this.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = response.data.data.user;

      this.first_name = userData.first_name || "";
      this.last_name = userData.last_name || "";
      this.matricule = userData.matricule || "";
      this.phone_number = userData.phone_number || "";
      this.adress = userData.adress || "";
      this.gender = userData.gender || "";
      this.age = userData.age || "";

      this.roleName = roles?.[0]?.name || "Aucun rôle";

      const baseUrl = "http://127.0.0.1:8000/";
      this.profileUrl = userData.picture
        ? baseUrl + userData.picture
        : this.defaultAvatar;

    } catch (error) {
      console.error(error);
      this.$swal.fire("Erreur", "Impossible de charger le profil", "error");
    }
  },

  methods: {
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    },

    clearPasswordError(field) {
      if (this.passwordErrors[field]) {
        delete this.passwordErrors[field];
      }
    },

    validateUserForm() {
      this.errors = {};

      if (!this.first_name || this.first_name.trim() === "") {
        this.errors.first_name = "Le nom est requis";
      }

      if (!this.last_name || this.last_name.trim() === "") {
        this.errors.last_name = "Le prénom est requis";
      }

      if (!this.phone_number || this.phone_number.trim() === "") {
        this.errors.phone_number = "Le téléphone est requis";
      } else if (!/^[0-9+\s-()]+$/.test(this.phone_number)) {
        this.errors.phone_number = "Format de téléphone invalide";
      }

      if (!this.gender) {
        this.errors.gender = "Le sexe est requis";
      }

      if (!this.age || this.age < 18 || this.age > 100) {
        this.errors.age = "L'âge doit être entre 18 et 100 ans";
      }

      if (this.file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(this.file.type)) {
          this.errors.picture = "Format d'image non valide (JPG, PNG, GIF uniquement)";
        } else if (this.file.size > maxSize) {
          this.errors.picture = "L'image ne doit pas dépasser 5MB";
        }
      }

      return Object.keys(this.errors).length === 0;
    },

    validatePasswordForm() {
      this.passwordErrors = {};

      if (!this.updatePasswordForm.current_password) {
        this.passwordErrors.current_password = "L'ancien mot de passe est requis";
      }

      if (!this.updatePasswordForm.new_password) {
        this.passwordErrors.new_password = "Le nouveau mot de passe est requis";
      } else if (this.updatePasswordForm.new_password.length < 8) {
        this.passwordErrors.new_password = "Le mot de passe doit contenir au moins 8 caractères";
      }

      if (!this.updatePasswordForm.confirm_password) {
        this.passwordErrors.confirm_password = "La confirmation est requise";
      } else if (this.updatePasswordForm.new_password !== this.updatePasswordForm.confirm_password) {
        this.passwordErrors.confirm_password = "Les mots de passe ne correspondent pas";
      }

      return Object.keys(this.passwordErrors).length === 0;
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        this.preview = URL.createObjectURL(file);
        this.clearError('picture');
      }
    },

    async updateUser() {
      if (!this.validateUserForm()) {
        this.$swal.fire({
          icon: "error",
          title: "Erreur de validation",
          text: "Veuillez corriger les erreurs dans le formulaire",
        });
        return;
      }

      this.isSubmitting = true;

      try {
        const formData = new FormData();

        formData.append("first_name", this.first_name);
        formData.append("last_name", this.last_name);
        formData.append("phone_number", this.phone_number);
        formData.append("adress", this.adress);
        formData.append("gender", this.gender);
        formData.append("age", this.age);

        if (this.file) {
          formData.append("picture", this.file);
        }

        const token = localStorage.getItem("current_token");

        const response = await axios.post(
          `http://127.0.0.1:8000/api/users/${this.userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedUser = response.data.data.user;
        localStorage.setItem("current_user", JSON.stringify(updatedUser));

        this.$swal.fire({
          icon: "success",
          title: "Profil mis à jour",
          text: "Vos informations ont été mises à jour avec succès",
          timer: 2000,
          showConfirmButton: false,
        });

      } catch (error) {
        console.error(error);
        
        // Gestion des erreurs de validation du backend
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors;
        }

        this.$swal.fire(
          "Erreur", 
          error.response?.data?.message || "Échec de la mise à jour", 
          "error"
        );
      } finally {
        this.isSubmitting = false;
      }
    },

    async updatePassword() {
      if (!this.validatePasswordForm()) {
        
        return;
      }
      
     

      try {
        const token = localStorage.getItem("current_token");
        const user = JSON.parse(localStorage.getItem("current_user"));
      this.userId= user.id;
       this.isSubmittingPassword = true;
        const response = await axios.post(
          `http://127.0.0.1:8000/api/users/${this.userId}/update_password`,
          {
            current_password: this.updatePasswordForm.current_password,
            new_password: this.updatePasswordForm.new_password,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        this.$swal.fire({
          icon: "success",
          title: "Mot de passe modifié",
          text: "Votre mot de passe a été changé avec succès",
          timer: 2000,
          showConfirmButton: false,
        });

        this.updatePasswordForm.current_password = "";
        this.updatePasswordForm.new_password = "";
        this.updatePasswordForm.confirm_password = "";

      } catch (error) {
        console.error(error);
        
        // Gestion des erreurs de validation du backend
        if (error.response?.data?.errors) {
          this.passwordErrors = error.response.data.errors;
        }

        this.$swal.fire(
          "Erreur",
          error.response?.data?.message || "Impossible de modifier le mot de passe",
          "error"
        );
      } finally {
        this.isSubmittingPassword = false;
      }
    },
  },
};
</script>




<style>
.profile .profile-card img {
  max-width: 120px;
}

.profile .profile-card h2 {
  font-size: 24px;
  font-weight: 700;
  color: #2c384e;
  margin: 10px 0 0 0;
}

.profile .profile-card h3 {
  font-size: 18px;
}

.profile .profile-card .social-links a {
  font-size: 20px;
  display: inline-block;
  color: rgba(1, 41, 112, 0.5);
  line-height: 0;
  margin-right: 10px;
  transition: 0.3s;
}

.profile .profile-card .social-links a:hover {
  color: #012970;
}

.profile .profile-overview .row {
  margin-bottom: 20px;
  font-size: 15px;
}

.profile .profile-overview .card-title {
  color: #012970;
}

.profile .profile-overview .label {
  font-weight: 600;
  color: rgba(1, 41, 112, 0.6);
}

.profile .profile-edit label {
  font-weight: 600;
  color: rgba(1, 41, 112, 0.6);
}

.profile .profile-edit img {
  max-width: 120px;
}

.profile .profile-edit .btn-file {
  overflow: hidden;
  position: relative;
}

.profile .profile-edit .btn-file input[type="file"] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;    
  min-height: 100%;
  font-size: 100px;
  text-align: right;
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  background: white;
  cursor: inherit;
  display: block;
}

/* Style pour les champs invalides */
.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.text-danger {
  color: #dc3545 !important;
}

/* Style pour les boutons de visibilité du mot de passe */
.input-group .btn-outline-secondary {
  border-color: #ced4da;
}

.input-group .btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #ced4da;
  color: #495057;
}

.input-group .form-control.is-invalid ~ .btn-outline-secondary {
  border-color: #dc3545;
}

.input-group .btn-outline-secondary i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .profile-card img {
    width: 80px;
    height: 80px;
  }
  .profile .card-body {
    padding: 1rem;
  }
  .nav-tabs .nav-link {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
}
</style>