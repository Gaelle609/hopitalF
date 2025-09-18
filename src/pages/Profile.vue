<template>

            <div class="container mt-4" id="main-content">

              <div class="row align-items-center">
                  <div class="pagetitle">
                  
                  <nav>
                    <ol class="breadcrumb">
                      <li class="breadcrumb-item"><a href="/">Accueil</a></li>
                      <li class="breadcrumb-item">Utilisateurs</li>
                      <li class="breadcrumb-item active">Profil</li>
                    </ol>
                  </nav>
                </div>

              <section class="section profile">
                <div class="row g-4">
                  <!-- Carte profil -->
                  <div class="col-12 col-md-4">
                    <div class="card shadow-sm">
                      <div class="card-body profile-card pt-4 d-flex flex-column align-items-center text-center">
                        <img :src="preview || profileUrl || defaultAvatar" class="rounded-circle mb-3" style="height: 100px; width: 100px; object-fit: cover;">
                        <h2 class="h5 text-theme-1">{{ name }} {{ surname }}</h2>
                        <p class="text-muted small">{{ email }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Contenu -->
                  <div class="col-12 col-md-8">
                    <div class="card shadow-sm">
                      <div class="card-body pt-3">
                        <!-- Onglets -->
                        <ul class="nav nav-tabs nav-tabs-bordered flex-wrap">
                          <li class="nav-item">
                            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Aperçu</button>
                          </li>
                          <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Éditer le profil</button>
                          </li>
                        </ul>

                        <div class="tab-content pt-3">
                          <!-- Aperçu -->
                          <div class="tab-pane fade show active profile-overview" id="profile-overview">
                            <h5 class="card-title text-theme-1">Détails du profil</h5>
                            <div class="row mb-3">
                              <div class="col-sm-4 fw-semibold text-muted">Nom complet</div>
                              <div class="col-sm-8">{{ name }} {{ surname }}</div>
                            </div>

                            <div class="row mb-3">
                              <div class="col-sm-4 fw-semibold text-muted">Fonction</div>
                              <div class="col-sm-8">{{ roleName }}</div>
                            </div>

                            <div class="row mb-3">
                              <div class="col-sm-4 fw-semibold text-muted">Email</div>
                              <div class="col-sm-8">{{ email }}</div>
                            </div>

                             <div class="row mb-3">
                              <div class="col-sm-4 fw-semibold text-muted">Numéro de Téléphone</div>
                              <div class="col-sm-8">{{ phone_number }}</div>
                            </div>

                            <div class="row mb-3">
                              <div class="col-sm-4 fw-semibold text-muted">Adress</div>
                              <div class="col-sm-8">{{ adress }}</div>
                            </div>

                            <div class="row mb-3">
                              <div class="col-sm-4 fw-semibold text-muted">Genre</div>
                              <div class="col-sm-8">{{ gender }}</div>
                            </div>

                            <div class="row mb-3">
                              <div class="col-sm-4 fw-semibold text-muted">Age</div>
                              <div class="col-sm-8">{{ age }}</div>
                            </div>
                          </div>

                          <!-- Édition -->
                          <div class="tab-pane fade profile-edit pt-3" id="profile-edit">
                            <form @submit.prevent="updateUser" class="row g-3">
                              <div class="col-12">
                                <label class="form-label text-muted">Image</label>
                                <div class="d-flex flex-column align-items-start">
                                  <label class="btn  btn-sm mb-2 text-muted">
                                    <i class="bi bi-camera-fill"></i> Choisir une image
                                    <input type="file" style="display:none" @change="onFileChange" />
                                  </label>
                                  <img v-if="preview" :src="preview" width="80" class="rounded">
                                </div>
                              </div>

                              <div class="col-12 col-md-6">
                                <label class="form-label text-muted">Nom</label>
                                <input type="text" class="form-control" v-model="name" />
                              </div>

                              <div class="col-12 col-md-6">
                                <label class="form-label text-muted">Prénom</label>
                                <input type="text" class="form-control" v-model="surname" />
                              </div>

                              <div class="col-12 col-md-6">
                                <label class="form-label text-muted">Téléphone</label>
                                <input type="text" class="form-control" v-model="phone_number" />
                              </div>

                              <div class="col-12 col-md-6">
                                <label class="form-label text-muted">Email</label>
                                <input type="email" class="form-control" v-model="email" />
                              </div>

                              <div class="col-12 col-md-6">
                                <label class="form-label text-muted">Adress</label>
                                <input type="text" class="form-control" v-model="adress" />
                              </div>

                              <div class="col-12 col-md-6">
                                <label class="form-label text-muted">Genre</label>
                                <input type="text" class="form-control" v-model="gender" />
                              </div>

                              <div class="col-12 col-md-6">
                                <label class="form-label text-muted">Age</label>
                                <input type="number" class="form-control" v-model="age" />
                              </div>
                              <div class="col-12 text-center">
                                <button type="submit" class="btn btn-theme  px-4">Sauvegarder</button>
                              </div>
                            </form>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </section>
              </div>
            </div>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      phone_number: "",
      adress: "",
      gender: "",
      age: "",
      roleName: "",
      profileUrl: "",
      defaultAvatar: "../../assets/img/avatar.jpg",
      file: null,
      preview: null,
      userId: null,
    };
  },

 async mounted() {
  try {     
     const user = JSON.parse(localStorage.getItem("current_user"));
    const token = localStorage.getItem("current_token"); 
    const roles = JSON.parse(localStorage.getItem("current_role"));

    if (user && token) {
      this.userId = user.id;

      console.log(user);
      console.log(roles); // vérifier que le token est correct


      const response = await axios.get(
        `http://127.0.0.1:8000/api/users/${this.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.data.user;

      this.name = userData.first_name || "";
      this.surname = userData.last_name || "";
      this.email = userData.email || "";
      this.phone_number = userData.phone_number || "";
      this.adress = userData.adress || "";
      this.gender = userData.gender || "";
      this.age = userData.age || "";

      if (roles && roles.length > 0) {
      this.roleName = roles[0].name; // Affiche le premier rôle
      console.log("Rôle de l'utilisateur :", this.roleName);

      // Afficher toutes les permissions si besoin
      // const user = JSON.parse(localStorage.getItem("current_user"));
      // if (user && user.permissions) {
      //   console.log("Permissions :", user.permissions);
      // }
    } else {
      console.log("Aucun rôle trouvé !");
    }
    const updatedUser = response.data.data.user || response.data.user;
      localStorage.setItem("current_user", JSON.stringify(updatedUser));

      const baseUrl = "http://127.0.0.1:8000/";
      this.profileUrl = updatedUser.picture 
          ? baseUrl + updatedUser.picture 
          : this.defaultAvatar;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    alert("Impossible de récupérer les informations du profil.");
  }
},


  methods: {
   onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    this.file = file;
    this.preview = URL.createObjectURL(file);
  }
}
,
    async updateUser() {
  try {
    const formData = new FormData();
    formData.append("first_name", this.name);
    formData.append("last_name", this.surname);
    formData.append("email", this.email);
    formData.append("phone_number", this.phone_number);
    formData.append("adress", this.adress);
    formData.append("gender", this.gender);
    formData.append("age", this.age);

    if (this.file) {
      formData.append("picture", this.file);
    }

    const token = localStorage.getItem("current_token");

    const response = await axios.post(
      `http://127.0.0.1:8000/api/users/${this.userId}`, // URL dynamique selon userId
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Mettre à jour le localStorage et l'affichage
    const updatedUser = response.data.data.user || response.data.user;
    localStorage.setItem("current_user", JSON.stringify(updatedUser));
    this.profileUrl = updatedUser.picture || this.profileUrl;

    alert("Profil mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    alert("Erreur lors de la mise à jour du profil.");
  }
}

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