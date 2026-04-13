<template>
  <div class="container-fluid mt-3">
    <!-- En-tête -->
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Paramètre du patient</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item bi active" aria-current="page">Paramètre</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <br />

    <div class="row">
      <!-- Table des patients -->
      <div class="col-12 col-lg-6">
        <div class="card adminuiux-card mb-4">
          <div class="card-header">
            <p class="h6 mb-0">Prendre les paramètres</p>
          </div>
          <div class="card-body px-2">
            <!-- Loader -->
            <div v-if="tableLoading" class="text-center py-5">
              <div class="spinner-border text-theme" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>

            <!-- v-show pour que DataTables trouve toujours le DOM -->
            <div v-show="!tableLoading">
              <table ref="dataTableRef" class="table w-100" style="width: 100%">
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

      <!-- Formulaire paramètres -->
      <div class="col-12 col-lg-6">
        <form @submit.prevent="submitForm">
          <div class="card shadow text-center px-4">
            <div class="d-flex justify-content-center mt-3 mb-2">
              <img id="img" src="../../assets/img/wecare.png" alt="Logo" />
            </div>

            <div class="card-body text-start">
              <div class="mb-3">
                <label class="form-label">Tension</label>
                <input type="number" v-model="consform.tension" class="form-control" />
              </div>

              <div class="mb-3">
                <label class="form-label">Température</label>
                <input type="number" v-model="consform.temperature" class="form-control" />
              </div>

              <div class="mb-3">
                <label class="form-label">Poids</label>
                <input type="number" v-model="consform.poids" class="form-control" />
              </div>

              <div class="mb-3">
                <label class="form-label">Patient sélectionné</label>
                <input
                  type="text"
                  class="form-control"
                  :value="selectedPatientName"
                  disabled
                  placeholder="Patient sélectionner"
                />
                <input type="hidden" v-model="consform.patient_id" />
              </div>

              <button
                id="btn"
                type="submit"
                class="btn btn-theme w-100"
                :disabled="loading || !consform.patient_id"
              >
                {{ loading ? "Enregistrement..." : "Valider" }}
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
        poids: 0,
        patient_id: null,
        id_per: null,
      },
    };
  },

  computed: {
    selectedPatientName() {
      if (!this.selectedPatient) return "";
      return `${this.selectedPatient.first_name || ""} ${this.selectedPatient.last_name || ""}`.trim();
    },
  },

  mounted() {
    this.getPatients();
  },

  beforeUnmount() {
    this.destroyDataTable();
  },

  methods: {
    // ─── DataTables ───────────────────────────────────────────

    initDataTable() {
      if (
        typeof window.$ === "undefined" ||
        typeof window.$.fn.DataTable === "undefined"
      ) {
        console.error("jQuery ou DataTables non disponible.");
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
          <td><span class="fw-medium">${patient.first_name || ""}</span></td>
          <td><span>${patient.last_name || ""}</span></td>
          <td><span class="small">${patient.age || "N/A"}</span></td>
          <td>
            <button class="btn btn-theme badge badge-sm cp select-btn" data-id="${patient.id}">
              Paramètre
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      const dtInstance = window.$(tableEl).DataTable({
        language: {
          decimal: ",",
          thousands: ".",
          emptyTable: "Aucun patient disponible",
          info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
          infoEmpty: "Affichage de 0 à 0 sur 0 entrée",
          infoFiltered: "(filtré depuis _MAX_ entrées au total)",
          lengthMenu: "Afficher _MENU_ entrées",
          loadingRecords: "Chargement...",
          processing: "Traitement...",
          search: "Rechercher :",
          zeroRecords: "Aucun résultat trouvé",
          paginate: {
            first: "Premier",
            last: "Dernier",
            next: "Suivant",
            previous: "Précédent",
          },
        },
        responsive: true,
        pageLength: 10,
        destroy: true,
        columnDefs: [{ orderable: false, targets: [3] }],
      });

      this.dataTableInstance = dtInstance;

      // Délégation d'événements jQuery
      window
        .$(tableEl)
        .off("click", ".select-btn")
        .on("click", ".select-btn", (e) => {
          const id = parseInt(window.$(e.currentTarget).data("id"));
          const patient = this.patientList.find((p) => p.id === id);
          if (patient) this.selectPatient(patient);
        });
    },

    destroyDataTable() {
      if (this.dataTableInstance) {
        try {
          this.dataTableInstance.destroy();
        } catch (e) {
          /* silencieux */
        }
        this.dataTableInstance = null;
      }
    },

    // ─── Données ──────────────────────────────────────────────

    async getPatients() {
      this.tableLoading = true;
      this.destroyDataTable();
      try {
        const token = localStorage.getItem("current_token");
        if (!token) throw new Error("Token d'authentification manquant");

        const response = await axios.get(`${this.baseUrl}api/caisse/done`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.data || {};
        this.patientList = Array.isArray(data.patients) ? data.patients : [];
      } catch (error) {
        console.error("Erreur lors du chargement des patients:", error);
        this.patientList = [];

        if (error.response?.status === 401) {
          this.$swal.fire({
            icon: "error",
            title: "Session expirée",
            text: "Veuillez vous reconnecter.",
          });
        } else {
          this.$swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Erreur lors du chargement des patients.",
          });
        }
      } finally {
        this.tableLoading = false;
        this.$nextTick(() => {
          this.initDataTable();
        });
      }
    },

    // ─── Sélection ────────────────────────────────────────────

    selectPatient(patient) {
      this.selectedPatient = patient;
      this.consform.patient_id = patient.id;
      console.log("Patient sélectionné:", patient);
    },

    // ─── Formulaire ───────────────────────────────────────────

    async submitForm() {
      if (!this.consform.patient_id) {
        this.$swal.fire({
          icon: "warning",
          title: "Attention",
          text: "Veuillez sélectionner un patient.",
        });
        return;
      }

      this.loading = true;
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.post(
          `${this.baseUrl}api/consultations`,
          this.consform,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {

          // récupérer l'id de la consultation
      const consultationId = response.data.data.consultation.id;

      // stocker dans le localStorage
      localStorage.setItem("current_consultation_id", consultationId);


          this.$swal.fire({
            icon: "success",
            title: "Paramètres enregistrés avec succès !",
            showConfirmButton: false,
            timer: 2000,
          });
          this.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors de l'enregistrement des paramètres.",
        });
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.consform = {
        temperature: "",
        tension: "",
        poids: 0,
        patient_id: null,
        id_per: null,
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
.form-control:focus {
  border-color: rgb(59, 105, 255);
  box-shadow: 0 0 5px rgba(59, 105, 255, 0.4);
}
#img {
  height: 80px;
  width: 80px;
  border-radius: 70rem;
}
#btn:hover {
  box-shadow: 3px 3px 3px rgb(59, 105, 255);
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>