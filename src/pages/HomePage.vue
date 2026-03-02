<template>
  <!-- Main Content -->
  <div class="row align-items-center">
    <div class="col-12 col-lg-8 mb-4 mb-lg-5">
      <div class="row align-items-center">
        <div class="col-12 col-sm-auto mb-3 mb-sm-0">
          <figure class="avatar avatar-120 coverimg rounded-circle">
            <img :src="userAvatar" alt="" />
          </figure>
        </div>
        <div class="col-12 col-sm">
          <h5 class="mb-0">{{ greeting }}</h5>
          <h1 class="text-theme-1">{{ userName }}</h1>
          <p class="text-secondary mb-0">
            Bienvenue sur votre tableau de bord ! Passez une excellente
            {{ timeOfDay }}.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
      <div class="card adminuiux-card">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-auto">
              <div
                class="avatar avatar-50 text-center rounded bg-success-subtle text-success-emphasis"
              >
                <i class="bi bi-people fs-4"></i>
              </div>
            </div>
            <div class="col px-0">
              <p class="h4 mb-0">{{ totalPatients }}</p>
              <p class="text-secondary small">Patients Récu</p>
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
              <div
                class="avatar avatar-50 text-center rounded bg-info-subtle text-info-emphasis"
              >
                <i class="bi bi-person-badge fs-4"></i>
              </div>
            </div>
            <div class="col">
              <p class="h4 mb-0">3</p>
              <p class="text-secondary small">Personnel Active</p>
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
              <div
                class="avatar avatar-50 text-center rounded bg-warning-subtle text-warning-emphasis"
              >
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
              <div
                class="avatar avatar-50 text-center rounded bg-danger-subtle text-danger-emphasis"
              >
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
      patients: [],
      baseUrl: "http://127.0.0.1:8000/",
      
      loading: false,
      isEditing: false,
      editingId: null,
    };
  },
  computed: {
    patientList() {
      if (
        this.patients &&
        this.patients.patients &&
        Array.isArray(this.patients.patients)
      ) {
        return this.patients.patients;
      }
      return [];
    },

    totalPatients() {
      return this.patientList.length;
    },
  },
  mounted() {
    this.setUserInfo();
    this.getPatients();
    console.log("Test permission:", this.$can("view_user"));
    console.log("Test role:", this.$hasRole("Admin"));
  },
  methods: {
    setUserInfo() {
      const user = JSON.parse(localStorage.getItem("current_user"));
      if (user) {
        this.userName =
          user.first_name + (user.last_name ? " " + user.last_name : "");
        if (user.picture) {
          const baseUrl = "http://127.0.0.1:8000/";
          this.userAvatar = baseUrl + user.picture;
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
    async getPatients() {
      const token = localStorage.getItem("current_token");
      try {
        const response = await axios.get(`${this.baseUrl}api/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          this.patients = response.data.data;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des patients:", error);
      }
    },


  },
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
