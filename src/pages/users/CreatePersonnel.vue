<template>
<div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Personnel</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">
                Personnel
              </li>
            </ol>
          </nav>
        </div>
        <div class="col-auto py-1">
        <div class="btn-group" role="group" aria-label="Basic example">
            <!-- <div class="btn btn-link active d-flex align-items-center position-relative"
                @click="$refs.hiddenDate.click()">
            <i data-feather="calendar" class="me-1"></i>
            <span>{{ selectedDate || 'Choisir une date' }}</span>

            <input 
                type="date" 
                ref="hiddenDate" 
                class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                v-model="selectedDate" 
                @change="fetchPayments(selectedDate)"
            /> -->
            <!-- </div> -->
                <a href="clinic-schedule-cards.html" class="btn btn-link"><i data-feather="layers"
                    class="me-0 me-md-1"></i> <span class="d-none d-xl-inline-block">Cards</span>
            </a><a href="clinic-schedule-staff.html" class="btn btn-link"><i
                    data-feather="user-check" class="me-0 me-md-1"></i> <span
                    class="d-none d-xl-inline-block">Staff</span></a></div>
    </div>
    <div class="col-auto py-1"><a href="clinic-add-appointment.html" class="btn btn-theme"><i
                data-feather="plus" class="me-0 me-md-1"></i> <span
                class="d-none d-md-inline-block">Creer Personnel</span></a></div>
    <div class="col-auto py-1 ms-auto ms-sm-0"><button class="btn btn-link btn-square btn-icon"
            data-bs-toggle="collapse" data-bs-target="#filterschedule" aria-expanded="false"
            aria-controls="filterschedule"><i data-feather="filter"></i></button></div>
      </div>
    </div>

    <br />
<div class="row">
                    <div class="col-12 col-lg-12 col-xxl-9">
                        <div class="row">
                            
                          
                            
                            <div class="col-12">
                                <div class="card adminuiux-card mb-4">
                                    <div class="card-header">
                                        <p class="h6">users Appointments</p>
                                    </div>
                                    <div class="card-body px-2">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th data-breakpoints="xs">Code</th>
                                                    <th data-breakpoints="xs">Date</th>
                                                    <th data-breakpoints="xs">users</th>
                                                    <th data-breakpoints="xs">Contact</th>
                                                    <th data-breakpoints="xs">Payer</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                              <tr v-for="users in personnel.personnel" :key="users.id">
                                                <td>{{ personnel.slug }}</td>
                                                <td>
                                                  <p class="mb-0 fw-medium">{{ new Date(personnel.created_at).toLocaleTimeString() }}</p>
                                                  <p class="text-secondary small">{{ new Date(personnel.created_at).toLocaleDateString() }}</p>
                                                </td>
                                                <td>
                                                  <div class="row align-items-center">
                                                    <div class="col ps-0">
                                                      <p class="mb-0">{{ personnel.first_name }} {{ personnel.last_name }}</p>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td>
                                                  <p class="small">{{ personnel.phone }}</p>
                                                </td>
                                                <td> 
                                                  <button
                                                    class="btn btn-theme badge badge-sm cp"
                                                    @click="$router.push({ name: 'PayService', params: { personnelId: personnel.id } })">
                                                    Payer
                                                  </button>

                                                </td>
                                                
                                                <td>
                                                  <div class="dropdown d-inline-block">
                                                    <a class="btn btn-link no-caret" data-bs-toggle="dropdown">
                                                      <i class="bi bi-three-dots"></i>
                                                    </a>
                                                    <ul class="dropdown-menu dropdown-menu-end">
                                                      <li><a class="dropdown-item" href="javascript:void(0) cp">Edité</a></li>
                                                      <li><a class="dropdown-item" href="javascript:void(0) cp">Détailé</a></li>
                                                      <li><a class="dropdown-item theme-red" href="javascript:void(0) cp">Suprimé</a></li>
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
      personnel: [], 
      usersForm: {
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
  computed: {
    usersList() {
      if (this.personnel && this.personnel.personnel && Array.isArray(this.personnel.personnel)) {
        return this.personnel.personnel;
      }
      return [];
    },

    totalpersonnel() {
      return this.usersList.length;
    }
  },
  mounted() {
    this.setUserInfo();
    this.getPersonnels(); 
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

    async submitusersForm() {
      this.loading = true;
      try {
        
    const token = localStorage.getItem("current_token");

    const response = await axios.post(`http://127.0.0.1:8000/api/personnel`, 
      this.usersForm, 
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
        title: 'users créé avec succès !',
        showConfirmButton: false,
        timer: 2000
      });
          this.getpersonnel(); 
          this.usersForm = {
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
          const modal = document.getElementById("createusersModal");
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
         setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.$swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Erreur lors de la création du users.'
    });
      } finally {
        this.loading = false;
      }
      //  window.location.reload();
    },

    // récupérer les personnel
    async getPersonnels() {
      try {
    
    const token = localStorage.getItem("current_token");

    const response = await axios.get(`http://127.0.0.1:8000/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
        this.users = response.data.data || [];
        console.log(this.users);
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement du personnel.");
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
  /* background-color: blanchedalmond; */
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
</style>  