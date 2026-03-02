<template>
  <div>
    <!-- Modal Créer Patient -->
    <div
      class="modal fade"
      id="createPatientModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content border-0 shadow">
          <!-- Header -->
          <div class="border-0 text-center pt-4 adminuiux-content">
            <div class="d-flex justify-content-center mb-3">
              <img
                id="modal-logo"
                src="../../assets/img/wecare.png"
                alt="Logo"
              />
            </div>
            <h4>
              <b class="text-theme-1">{{
                isEditing ? "Modifier le Patient" : "Créer un Patient"
              }}</b>
            </h4>
          </div>

          <!-- Corps -->
          <div class="card-body px-5">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Prénom</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="patientForm.first_name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nom</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="patientForm.last_name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Téléphone</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="patientForm.phone"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Quartier</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="patientForm.quater"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Situation matrimoniale</label>
                <select
                  class="form-control"
                  v-model="patientForm.matrimonial_situation"
                  required
                >
                  <option value="" disabled>Choisir la situation</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Veuf(ve)">Veuf(ve)</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label d-block">Sexe</label>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="gender"
                    value="Masculin"
                    v-model="patientForm.gender"
                  />
                  <label class="form-check-label">Masculin</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="gender"
                    value="Féminin"
                    v-model="patientForm.gender"
                  />
                  <label class="form-check-label">Féminin</label>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Contact d'urgence</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="patientForm.emergency_contact"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Profession</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="patientForm.profession"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Âge</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="patientForm.age"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Pied -->
          <div class="border-0 pb-4 px-5 adminuiux-content">
            <div class="d-flex justify-content-between">
              <button
                type="button"
                class="btn btn-secondary me-2"
                data-bs-dismiss="modal"
                @click="resetForm"
              >
                Fermer
              </button>
              <button
                type="button"
                class="btn btn-theme"
                @click="submitPatientForm"
                :disabled="loading"
              >
                {{ loading ? "Enregistrement..." : "Enregistrer" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-fluid mt-3">
      <div class="bg-theme-1-subtle rounded px-3 py-3">
        <div class="row gx-3 align-items-center">
          <div class="col-12 col-md mb-2 mb-sm-0">
            <p class="h5">Gestion des Patients</p>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Patients
                </li>
              </ol>
            </nav>
          </div>
          <div class="col-md text-end">
            <button
              class="btn btn-theme"
              data-bs-toggle="modal"
              data-bs-target="#createPatientModal"
              @click="openCreateModal"
            >
              <i class="bi bi-plus-lg me-1"></i> Créer Patient
            </button>
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
              <p class="h6 mb-0">Liste des Patients</p>
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
                      <th>Payer</th>
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
      patientForm: {
        first_name: "",
        last_name: "",
        phone: "",
        gender: "",
        quater: "",
        emergency_contact: "",
        matrimonial_situation: "",
        profession: "",
        age: null,
      },
      loading: false,
      isEditing: false,
      editingId: null,
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
          <td>
            <a class="btn btn-theme badge badge-sm cp pay-btn" data-id="${patient.id}">
              Payer
            </a>
          </td>
          <td>
            <div class="dropdown d-inline-block">
              <a class="btn btn-link no-caret cp" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item cp edit-btn" data-id="${patient.id}">
                    <i class="bi bi-pencil me-2"></i>Modifier
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item theme-red cp delete-btn" data-id="${patient.id}">
                    <i class="bi bi-trash me-2"></i>Supprimer
                  </a>
                </li>
              </ul>
            </div>
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
        .off("click", ".pay-btn")
        .on("click", ".pay-btn", (e) => {
          const id = window.$(e.currentTarget).data("id");
          this.$router.push({ name: "PayService", params: { patientId: id } });
        });

      window
        .$(tableEl)
        .off("click", ".edit-btn")
        .on("click", ".edit-btn", (e) => {
          const id = parseInt(window.$(e.currentTarget).data("id"));
          const patient = this.patientList.find((p) => p.id === id);
          if (patient) this.editPatient(patient);
        });

      window
        .$(tableEl)
        .off("click", ".delete-btn")
        .on("click", ".delete-btn", (e) => {
          const id = parseInt(window.$(e.currentTarget).data("id"));
          this.deletePatient(id);
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
        const response = await axios.get(`${this.baseUrl}api/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.patientList = response.data.data?.patients || [];
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

    // ─── Modal ────────────────────────────────────────────────

    openCreateModal() {
      this.resetForm();
    },

    editPatient(patient) {
      this.isEditing = true;
      this.editingId = patient.id;
      console.log("Patient gender reçu:", patient.gender);
      this.patientForm = {
        first_name: patient.first_name || "",
        last_name: patient.last_name || "",
        phone: patient.phone || "",
        gender: patient.gender || "",
        quater: patient.quater || "",
        emergency_contact: patient.emergency_contact || "",
        matrimonial_situation: patient.matrimonial_situation || "",
        profession: patient.profession || "",
        age: patient.age || null,
      };
      const modal = new bootstrap.Modal(
        document.getElementById("createPatientModal"),
      );
      modal.show();
    },

    // ─── Formulaire ───────────────────────────────────────────

    async submitPatientForm() {
      this.loading = true;
      try {
        console.log("Données avant envoi:", this.patientForm); // ← Debug
        console.log("Genre:", this.patientForm.gender);
        const token = localStorage.getItem("current_token");
        let response;

        if (this.isEditing) {
          response = await axios.put(
            `${this.baseUrl}api/patients/${this.editingId}`,
            this.patientForm,
            { headers: { Authorization: `Bearer ${token}` } },
          );
        } else {
          response = await axios.post(
            `${this.baseUrl}api/patients`,
            this.patientForm,
            { headers: { Authorization: `Bearer ${token}` } },
          );
        }

        if (response.data.success) {
          this.$swal.fire({
            icon: "success",
            title: this.isEditing
              ? "Patient modifié avec succès !"
              : "Patient créé avec succès !",
            showConfirmButton: false,
            timer: 2000,
          });

          const modalEl = document.getElementById("createPatientModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();

          this.resetForm();
          await this.getPatients();
        }
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors de la création ou modification du patient.",
        });
      } finally {
        this.loading = false;
      }
    },

    async deletePatient(id) {
      const result = await this.$swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Cette action est irréversible !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Annuler",
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("current_token");
          await axios.delete(`${this.baseUrl}api/patients/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.$swal.fire({
            icon: "success",
            title: "Supprimé !",
            showConfirmButton: false,
            timer: 2000,
          });
          await this.getPatients();
        } catch (error) {
          console.error(error);
          this.$swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Erreur lors de la suppression du patient.",
          });
        }
      }
    },

    resetForm() {
      this.patientForm = {
        first_name: "",
        last_name: "",
        phone: "",
        gender: "",
        quater: "",
        emergency_contact: "",
        matrimonial_situation: "",
        profession: "",
        age: null,
      };
      this.isEditing = false;
      this.editingId = null;
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
