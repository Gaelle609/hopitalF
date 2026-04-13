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
                  Liste des Patients consultés
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

    <!-- DataTable -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card adminuiux-card mb-4">
            <div class="card-header">
              <p class="h6 mb-0">Liste des Patients à Consulter</p>
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
                <table
                  ref="dataTableRef"
                  class="table w-100"
                  style="width: 100%"
                >
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Date</th>
                      <th>Patient</th>
                      <th>Contact</th>
                      <th>Sexe</th>
                      <th>Temperature</th>
                      <th>Tension</th>
                      <th>poids</th>
                      <th>Action</th>
                      
                    </tr>
                  </thead>
                  <tbody></tbody>
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
  name: "HomePage",

  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",
      patientList: [],
      dataTableInstance: null,
      tableLoading: false,
      loading: false,
      
    };
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
        const date = new Date(patient.created_at);
        const badgeClass = patient.gender === "Masculin" ? "bg-primary" : "bg-pink";
        const genderLabel = patient.gender === "Masculin" ? "Masculin" : "Féminin";

        tr.innerHTML = `
          <td><span class="small text-muted">${patient.slug || ""}</span></td>
          <td>
            <p class="mb-0 fw-medium">${date.toLocaleTimeString()}</p>
            <p class="text-secondary small mb-0">${date.toLocaleDateString()}</p>
          </td>
          <td><span class="fw-medium">${patient.first_name || ""} ${patient.last_name || ""}</span></td>
          <td><span class="small">${patient.phone || ""}</span></td>
          <td><span class="badge ${badgeClass}">${genderLabel}</span></td>
          <td><span class="small">${patient.temperature || ""}</span></td>
          <td><span class="small">${patient.tension || ""}</span></td>
          <td><span class="small">${patient.weight || ""}</span></td>
          <td>
            <a class="btn btn-theme badge badge-sm cp cons-btn" data-id="${patient.id}">
              Consulter
            </a>
          </td>
          
        `;
        tbody.appendChild(tr);
      });

      const dtInstance = window.$(tableEl).DataTable({
        language: {
          decimal: ",",
          thousands: ".",
          emptyTable: "Aucune donnée disponible",
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
        columnDefs: [{ orderable: false, targets: [0, 6] }],
      });

      this.dataTableInstance = dtInstance;

      // Délégation d'événements jQuery
      window
        .$(tableEl)
        .off("click", ".cons-btn")
        .on("click", ".cons-btn", (e) => {
          const id = window.$(e.currentTarget).data("id");
          this.$router.push({ name: "Consultation", params: { patientId: id } });
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
        const response = await axios.get(`${this.baseUrl}api/consultations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.patientList = response.data.data?.consultation || [];
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors du chargement des patients.",
        });
      } finally {
        this.tableLoading = false;
        this.$nextTick(() => {
          this.initDataTable();
        });
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
