<template>
  <div>
    

    <!-- Main Content -->
    <div class="container-fluid mt-3">
      <div class="bg-theme-1-subtle rounded px-3 py-3">
        <div class="row gx-3 align-items-center">
          <div class="col-12 col-md mb-2 mb-sm-0">
            <p class="h5">Consultation des Patients</p>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
                </li>
                <li class="breadcrumb-item bi active" aria-current="page">
                  Patient a consultés
                </li>
              </ol>
            </nav>
          </div>
          <div class="col-md text-end">
            <!-- <button
              class="btn btn-theme"
              data-bs-toggle="modal"
              data-bs-target="#createPatientModal"
              @click="openCreateModal"
            >
              <i class="bi bi-plus-lg me-1"></i> Consulter
            </button> -->
          </div>
        </div>
      </div>
    </div>

    <br />

    <div class="container-fluid">

  <div class="card shadow-sm border-0 mb-4">
    <div class="card-body">

      <div class="row align-items-center">

        <div class="col-md-auto text-center">
          <div class="patient-avatar">
            <i class="bi bi-person-fill"></i>
          </div>
        </div>

        <div class="col">

          <h3 class="fw-bold mb-2">
            {{ patient.first_name }}
            {{ patient.last_name }}
          </h3>

          <div class="row">

            <div class="col-md-4">
              <p><strong>Code :</strong> {{ patient.slug }}</p>
            </div>

            <div class="col-md-4">
              <p><strong>Age :</strong> {{ patient.age }} ans</p>
            </div>

            <div class="col-md-4">
              <p><strong>Sexe :</strong> {{ patient.gender }}</p>
            </div>

            <div class="col-md-4">
              <p><strong>Téléphone :</strong> {{ patient.phone }}</p>
            </div>

            <div class="col-md-4">
              <p><strong>Profession :</strong> {{ patient.profession }}</p>
            </div>

            <div class="col-md-4">
              <p><strong>Quartier :</strong> {{ patient.quater }}</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  </div>

  <div class="row mb-4">

    <div class="col-md-3">
      <div class="card vitale-card text-white temp">
        <div class="card-body text-center">
          <h2>🌡</h2>
          <h4>{{ parametre.temperature }} °C</h4>
          <small>Température</small>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card vitale-card  text-white param">
        <div class="card-body text-center">
          <h2>🩸</h2>
          <h4>{{ parametre.tension }}</h4>
          <small>Tension</small>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card vitale-card text-white fc">
        <div class="card-body text-center">
          <h2>❤️</h2>
          <h4>{{ parametre.fc }}</h4>
          <small>FC</small>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card vitale-card text-dark pds">
        <div class="card-body text-center">
          <h2>⚖</h2>
          <h4>{{ parametre.poids }} Kg</h4>
          <small>Poids</small>
        </div>
      </div>
    </div>

  </div>

  <div class="card shadow-sm border-0">

    <div class="card-header border-0 bg-light">
      <h5 class="mb-0">
        Paramètres reçus
      </h5>
    </div>

    <div class="card-body">

      <div class="row">

        <div class="col-md-6 mb-3">
          <strong>Température :</strong>
          {{ parametre.temperature }} °C
        </div>

        <div class="col-md-6 mb-3">
          <strong>Tension :</strong>
          {{ parametre.tension }}
        </div>

        <div class="col-md-6 mb-3">
          <strong>Fréquence cardiaque :</strong>
          {{ parametre.fc }} bpm
        </div>

        <div class="col-md-6 mb-3">
          <strong>Fréquence respiratoire :</strong>
          {{ parametre.fr }}
        </div>

        <div class="col-12">
          <strong>Observation :</strong>
          {{ parametre.autre || 'Aucune observation' }}
        </div>

      </div>
  <div class="text-center py-4">
    <h5 class="mb-3">
      Le patient est prêt pour la consultation médicale
    </h5>

    <button
  class="btn btn-success btn-lg px-5"
  @click="commencerConsultation"
  :disabled="!patient.id"
>
  <i class="bi bi-clipboard2-pulse-fill me-2"></i>
  Commencer la consultation
</button>
  </div>
    </div>

  </div>

</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ConsultationPatient",

  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",

      loading: false,

      patient: {},

      parametre: {
        temperature: "",
        tension: "",
        fc: "",
        fr: "",
        poids: "",
        autre: "",
      },
    };
  },

  async mounted() {
    await this.getConsultation();
  },

  methods: {
   async getConsultation() {
  this.loading = true;

  try {
    const token = localStorage.getItem("current_token");
    const patientId = this.$route.params.patientId;

    const response = await axios.get(
      `${this.baseUrl}api/pat/${patientId}/params`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    this.patient = response.data.data.patient;

    this.parametre =
      response.data.data.patient.parametre.length > 0
        ? response.data.data.patient.parametre[0]
        : {
            temperature: "",
            tension: "",
            fc: "",
            fr: "",
            poids: "",
            autre: "",
          };

  } catch (error) {
    console.error(error);
  } finally {
    this.loading = false;
  }
},

   commencerConsultation() {
  this.$router.push({
    name: "ConsultForm",
    params: {
      patientId: this.patient.id,
    },
  });
},

    formatDate(date) {
      if (!date) return "-";

      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.patient-avatar {
  width: 120px;
  height: 120px;
  background: #d5d6d6;
  color: white;
  border-radius: 50%;
  font-size: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vitale-card {
  border: none;
  border-radius: 15px;
  transition: 0.3s;
}

.vitale-card:hover {
  transform: translateY(-5px);
}

.card {
  border-radius: 15px;
}

.temp {
  background-color: #b80202;
}

.param{
  background-color: rgb(176, 159, 247);
}

.fc {
  background-color: rgb(4, 155, 14);
}

.pds {
  background-color: rgb(249, 253, 14);
}
</style>
