<template>
  <div class="container-fluid mt-3">

    <!-- HEADER -->
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">

        <div class="col-12 col-md">

          <p class="h5">Paramètres du patient</p>

          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">

              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">
                  Accueil
                </router-link>
              </li>

              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'Parameter' }">
                  Paramètres
                </router-link>
              </li>

              <li class="breadcrumb-item active bi">
                Paramètres du patient
              </li>

            </ol>
          </nav>

        </div>
      </div>
    </div>

    <br>

    <!-- LOADER -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- CONTENT -->
    <div v-else class="row">

      <!-- PATIENT -->
      <div class="col-lg-4 mb-4">

        <div class="card shadow-sm border-0 h-100">

          <div class="card-body text-center">

            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              class="patient-avatar mb-3"
            />

            <h5>
              {{ patient.first_name }} {{ patient.last_name }}
            </h5>

            <span class="badge bg-primary mb-3">
              {{ patient.gender || 'Patient' }}
            </span>

            <hr>

            <div class="text-start">

              <p>
                <strong>Âge :</strong>
                {{ patient.age || 'N/A' }} ans
              </p>

              <p>
                <strong>Téléphone :</strong>
                {{ patient.phone || 'N/A' }}
              </p>

              <p>
                <strong>Adresse :</strong>
                {{ patient.quater || 'N/A' }}
              </p>

            </div>

          </div>
        </div>
      </div>

      <!-- PARAMETRES -->
      <div class="col-lg-8">

        <div class="card shadow-sm border-0">

          <div class="card-header bg-white d-flex justify-content-between align-items-center">

            <h5 class="mb-0">
              Historique des paramètres
            </h5>

            <span class="badge bg-info">
              {{ parametres.length }} prise(s)
            </span>

          </div>

          <div class="card-body">

            <div
              v-if="parametres.length === 0"
              class="alert alert-info"
            >
              Aucun paramètre enregistré.
            </div>

            <!-- PARAMETRES -->
            <div
              v-for="parametre in parametres"
              :key="parametre.id"
              class="parametre-card mb-4"
            >

              <div class="d-flex justify-content-between align-items-center mb-3">

                <div>
                  <h6 class="mb-1">
                    Paramètre {{ parametre.id }}
                  </h6>

                  <small class="text-muted">
                    {{ parametre.date_prise }}
                  </small>
                </div>

                <span class="badge bg-success">
                  {{ parametre.statut }}
                </span>

              </div>

              <div class="row g-3">

                <div class="col-md-4">
                  <div class="vital-box">
                    <small>Température</small>
                    <h5>{{ parametre.temperature || '--' }} °C</h5>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="vital-box">
                    <small>Tension</small>
                    <h5>{{ parametre.tension || '--' }}</h5>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="vital-box">
                    <small>Poids</small>
                    <h5>{{ parametre.poids || '--' }} Kg</h5>
                  </div>
                </div>

              </div>

              <div
                v-if="parametre.autre"
                class="alert alert-light border mt-3"
              >
                <strong>Observation :</strong>
                <br>
                {{ parametre.autre }}
              </div>
<div class="d-flex justify-content-end">

              <button
                class="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#transferModal"
              >
                <i class="bi bi-send me-2"></i>
                Transférer
              </button>

            </div>
            </div>

            <!-- BUTTON -->
            

          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div
      class="modal fade"
      id="transferModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered border-0">

        <div class="modal-content border-0 shadow">

          <div class="modal-header border-0">

            <h5 class="modal-title">
              Transférer le patient
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>

          </div>

          <div class="modal-body">

            <input
              type="hidden"
              v-model="transferForm.patient_id"
            >

            <div class="mb-3">

              <label class="form-label">
                Choisir un rôle
              </label>

              <select
                class="form-select"
                v-model="transferForm.role_id"
              >

                <option value="">
                  Choisir un rôle
                </option>

                <option
                  v-for="role in roles"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.name }}
                </option>

              </select>

            </div>

          </div>

          <div class="modal-footer border-0">

            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Fermer
            </button>

            <button
              class="btn btn-success"
              @click="transfererAuMedecin"
              :disabled="transferLoading"
            >

              <span v-if="transferLoading">

                <span class="spinner-border spinner-border-sm me-2"></span>
                Transfert...

              </span>

              <span v-else>

                Confirmer

              </span>

            </button>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {

  data() {

    return {

      baseUrl: 'http://127.0.0.1:8000/',

      patient: {},
      parametres: [],
      roles: [],

      loading: false,
      transferLoading: false,

      transferForm: {
        patient_id: '',
        role_id: '',
      }

    }
  },

  mounted() {

    this.loadData()
    this.loadRole()

  },

  methods: {

    async loadData() {

      const token = localStorage.getItem('current_token')

      const patientId = this.$route.params.patientId

      this.transferForm.patient_id = patientId

      const patientResponse = await axios.get(
        `${this.baseUrl}api/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      this.patient = patientResponse.data.data.patient

      const paramResponse = await axios.get(
        `${this.baseUrl}api/patients/${patientId}/parametres`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      this.parametres = paramResponse.data.data.parametres || []
    },

    async loadRole() {

      try {

        const token = localStorage.getItem('current_token')

        const response = await axios.get(
          `${this.baseUrl}api/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        this.roles = response.data.data.roles || []

      } catch (error) {

        console.error(error)

      }
    },

    async transfererAuMedecin() {

  try {

    if (!this.transferForm.role_id) {

      this.$swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez choisir un rôle',
      })

      return
    }

    this.transferLoading = true

    const token = localStorage.getItem('current_token')

    await axios.post(
      `${this.baseUrl}api/transfers/send`,
      {
        patient_id: this.transferForm.patient_id,
        id_per_receiver: this.transferForm.role_id, // ✅ renommé ici
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    this.$swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Transfert effectué avec succès',
    })

  } catch (error) {

    console.error(error)

    this.$swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.response?.data?.message || 'Erreur transfert',
    })

  } finally {

    this.transferLoading = false
  }
}

  }
}
</script>

<style scoped>

.patient-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.parametre-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
}

.vital-box {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.card {
  border-radius: 15px;
}

</style>