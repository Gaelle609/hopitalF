<template>
  <div class="container-fluid mt-3">

    <!-- HEADER -->
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Paramètres du patient</p>

          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'HomePage' }">
                  Accueil
                </router-link>
              </li>

              <li class="breadcrumb-item active bi">
                Paramètres
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <br />

    <div class="row">

      <!-- TABLE PATIENT -->
      <div class="col-12 col-lg-6">

        <div class="card adminuiux-card mb-4">

          <div class="card-header">
            <p class="h6 mb-0">
              Sélection du patient
            </p>
          </div>

          <div class="card-body px-2">

            <!-- LOADER -->
            <div v-if="tableLoading" class="text-center py-5">
              <div class="spinner-border text-theme" role="status">
                <span class="visually-hidden">
                  Chargement...
                </span>
              </div>
            </div>

            <!-- DATATABLE -->
            <div v-show="!tableLoading">

              <table
                ref="dataTableRef"
                class="table table-hover w-100"
              >
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Âge</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody></tbody>
              </table>

            </div>
          </div>
        </div>
      </div>

      <!-- FORMULAIRE -->
      <div class="col-12 col-lg-6">

        <form @submit.prevent="submitForm">

          <div class="card shadow border-0">

            <!-- HEADER CARD -->
            <div class="card-header bg-white border-0 text-center pt-4">

              <img
                id="img"
                src="../../assets/img/wecare.png"
                alt="Logo"
              />

              <h5 class="mt-3">
                Prise des paramètres
              </h5>

            </div>

            <!-- BODY -->
            <div class="card-body text-start px-4">

              <!-- PATIENT -->
              <div class="mb-4">

                <label class="form-label fw-bold">
                  Patient sélectionné
                </label>

                <input
                  type="text"
                  class="form-control bg-light"
                  :value="selectedPatientName"
                  disabled
                  placeholder="Aucun patient sélectionné"
                />

              </div>

              <!-- CONSTANTES -->
              <div class="border rounded p-3 mb-4">

                <h6 class="text-theme mb-3">
                  Constantes vitales
                </h6>

                <div class="row">

                  <!-- TEMPERATURE -->
                  <div class="col-md-6 mb-3">

                    <label class="form-label">
                      Température (°C)
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      v-model="consform.temperature"
                      class="form-control"
                      placeholder="37.5"
                    />

                  </div>

                  <!-- TENSION -->
                  <div class="col-md-6 mb-3">

                    <label class="form-label">
                      Tension artérielle
                    </label>

                    <input
                      type="text"
                      v-model="consform.tension"
                      class="form-control"
                      placeholder="12/8"
                    />

                  </div>

                  <!-- POIDS -->
                  <div class="col-md-6 mb-3">

                    <label class="form-label">
                      Poids (Kg)
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      v-model="consform.poids"
                      class="form-control"
                      placeholder="70"
                    />

                  </div>

                  <!-- FC -->
                  <div class="col-md-6 mb-3">

                    <label class="form-label">
                      Fréquence cardiaque (FC)
                    </label>

                    <input
                      type="number"
                      v-model="consform.fc"
                      class="form-control"
                      placeholder="80 bpm"
                    />

                  </div>

                  <!-- FR -->
                  <div class="col-md-6 mb-3">

                    <label class="form-label">
                      Fréquence respiratoire (FR)
                    </label>

                    <input
                      type="number"
                      v-model="consform.fr"
                      class="form-control"
                      placeholder="18"
                    />

                  </div>

                </div>
              </div>

              <!-- OBSERVATION -->
              <div class="mb-4">

                <label class="form-label fw-bold">
                  Observation
                </label>

                <textarea
                  v-model="consform.autre"
                  class="form-control"
                  rows="4"
                  placeholder="Observation infirmière..."
                ></textarea>

              </div>

              <!-- BOUTON -->
              <button
                id="btn"
                type="submit"
                class="btn btn-theme w-100 py-2"
                :disabled="loading || !consform.patient_id"
              >

                <span v-if="loading">

                  <span
                    class="spinner-border spinner-border-sm me-2"
                  ></span>

                  Enregistrement...

                </span>

                <span v-else>
                  Enregistrer les paramètres
                </span>

              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ParametrePage",

  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",
      patientList: [],
      dataTableInstance: null,
      tableLoading: false,
      loading: false,

      selectedPatient: null,

      consform: {
        temperature: "",
        tension: "",
        poids: "",
        fc: "",
        fr: "",
        autre: "",
        patient_id: null,
        id_per: null,
        statut: "Pending",
      },
    };
  },

  computed: {
    selectedPatientName() {
      if (!this.selectedPatient) return "";

      return `
        ${this.selectedPatient.first_name || ""}
        ${this.selectedPatient.last_name || ""}
      `.trim();
    },
  },

  mounted() {
    this.getPatients();
  },

  beforeUnmount() {
    this.destroyDataTable();
  },

  methods: {

    // DATATABLE
    // DATATABLE
initDataTable() {

  if (
    typeof window.$ === "undefined" ||
    typeof window.$.fn.DataTable === "undefined"
  ) {
    console.error("jQuery ou DataTables indisponible");
    return;
  }

  const tableEl = this.$refs.dataTableRef;

  if (!tableEl) return;

  this.destroyDataTable();

  const tbody = tableEl.querySelector("tbody");

  tbody.innerHTML = "";

  this.patientList.forEach((patient) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${patient.first_name || ""}</td>
      <td>${patient.last_name || ""}</td>
      <td>${patient.age || "N/A"}</td>

      <td>

        <button
          class="btn btn-theme btn-sm select-btn"
          data-id="${patient.id}"
        >
          Sélectionner
        </button>

        <button
          class="btn btn-warning btn-sm view-btn"
          data-id="${patient.id}"
        >
          Voir
        </button>

      </td>
    `;

    tbody.appendChild(tr);
  });

  this.dataTableInstance = window.$(tableEl).DataTable({
    responsive: true,
    pageLength: 10,
    destroy: true,

    language: {
      search: "Rechercher :",
      lengthMenu: "Afficher _MENU_ entrées",
      zeroRecords: "Aucun résultat trouvé",
      info: "Affichage de _START_ à _END_ sur _TOTAL_",
      infoEmpty: "Aucune donnée disponible",
      paginate: {
        next: "Suivant",
        previous: "Précédent",
      },
    },

    columnDefs: [
      {
        orderable: false,
        targets: [3],
      },
    ],
  });

  // EVENT : VIEW PARAMETRES
  window
    .$(tableEl)
    .off("click", ".view-btn")
    .on("click", ".view-btn", (e) => {

      const id = parseInt(
        window.$(e.currentTarget).data("id")
      );

      this.voirParametres(id);

    });

  // EVENT : SELECT PATIENT
  window
    .$(tableEl)
    .off("click", ".select-btn")
    .on("click", ".select-btn", (e) => {

      const id = parseInt(
        window.$(e.currentTarget).data("id")
      );

      const patient = this.patientList.find(
        (p) => p.id === id
      );

      if (patient) {
        this.selectPatient(patient);
      }

    });
},
voirParametres(patientId) {

  this.$router.push({
    name: 'ViewParams',
    params: {
      patientId: patientId
    }
  })

},
    destroyDataTable() {
      if (this.dataTableInstance) {
        this.dataTableInstance.destroy();
        this.dataTableInstance = null;
      }
    },

    // GET PATIENTS
    async getPatients() {

      this.tableLoading = true;

      try {

        const token = localStorage.getItem("current_token");

        const response = await axios.get(
          `${this.baseUrl}api/caisse/done`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data || {};

        this.patientList = Array.isArray(data.patients)
          ? data.patients
          : [];

      } catch (error) {

        console.error(error);

        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de charger les patients",
        });

      } finally {

        this.tableLoading = false;

        this.$nextTick(() => {
          this.initDataTable();
        });
      }
    },
    
    // SELECT PATIENT
    selectPatient(patient) {

      this.selectedPatient = patient;

      this.consform.patient_id = patient.id;
    },

    // SUBMIT
    async submitForm() {

      if (!this.consform.patient_id) {

        this.$swal.fire({
          icon: "warning",
          title: "Attention",
          text: "Veuillez sélectionner un patient",
        });

        return;
      }

      this.loading = true;

      try {

        const token = localStorage.getItem("current_token");

        const response = await axios.post(
          `${this.baseUrl}api/parametres`,
          this.consform,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {

          this.$swal.fire({
            icon: "success",
            title: "Succès",
            text: "Paramètres enregistrés avec succès",
            timer: 2000,
            showConfirmButton: false,
          });

          this.resetForm();
        }

      } catch (error) {

        console.error(error);

        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors de l'enregistrement",
        });

      } finally {

        this.loading = false;
      }
    },

    // RESET
    resetForm() {

      this.consform = {
        temperature: "",
        tension: "",
        poids: "",
        fc: "",
        fr: "",
        autre: "",
        patient_id: null,
        id_per: null,
        statut: "Pending",
      };

      this.selectedPatient = null;
    },
  },
};
</script>

<style scoped>

.cp {
  cursor: pointer;
}

#img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
}

.form-control {
  border-radius: 10px;
}

.form-control:focus {
  border-color: rgb(59, 105, 255);
  box-shadow: 0 0 5px rgba(59, 105, 255, 0.4);
}

#btn {
  border-radius: 10px;
  font-weight: 600;
}

#btn:hover {
  box-shadow: 0 4px 10px rgba(59, 105, 255, 0.4);
}

.card {
  border-radius: 15px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

</style>