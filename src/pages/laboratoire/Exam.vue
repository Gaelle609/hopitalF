<template>
  <div>
    <!-- Modal Créer / Modifier examen -->
    <div
      class="modal fade"
      id="createExamModal"
      tabindex="-1"
      aria-labelledby="createExamModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-sm">
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
            <h4 id="modal-title">
              <b class="text-theme-1">{{
                isEditing ? "Modifier le examen" : "Créer un examen"
              }}</b>
            </h4>
          </div>

          <!-- Corps -->
          <div class="card-body px-4">
            <form @submit.prevent="submitexamForm">
              <div class="mb-3">
                <label class="form-label">Nom de l'examen</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="examForm.name"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Prix</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="examForm.price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </form>
          </div>

          <!-- Pied -->
          <div class="border-0 pb-4 px-4 adminuiux-content">
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
                @click="submitexamForm"
                :disabled="loading || !isFormValid"
              >
                {{
                  loading
                    ? "Enregistrement..."
                    : isEditing
                    ? "Mettre à jour"
                    : "Enregistrer"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails examen -->
    <div
      class="modal fade"
      id="viewExamModal"
      tabindex="-1"
      aria-labelledby="viewExamModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow">
          <div class="border-0 text-center pt-4 adminuiux-content">
            <h4><b class="text-theme-1">Détails de l'examen</b></h4>
          </div>

          <div class="card-body px-4" v-if="selectedExam">
            <div class="row">
              <div class="col-12 mb-3">
                <p class="text-secondary mb-1">Nom</p>
                <p class="fw-bold">{{ selectedExam.name }}</p>
              </div>
              <div class="col-12 mb-3">
                <p class="text-secondary mb-1">Prix</p>
                <p class="fw-bold">
                  {{ formatPrice(selectedExam.price) }} FCFA
                </p>
              </div>
            </div>
          </div>

          <div class="border-0 pb-4 px-4 adminuiux-content">
            <button
              type="button"
              class="btn btn-secondary w-100"
              data-bs-dismiss="modal"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="container-fluid mt-3">
      <div class="bg-theme-1-subtle rounded px-3 py-3">
        <div class="row gx-3 align-items-center">
          <div class="col-md mb-2 mb-sm-0">
            <p class="h5">Gestion des Examen</p>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item bi">
                  <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
                </li>
                <li class="breadcrumb-item active bi" aria-current="page">
                  examen
                </li>
              </ol>
            </nav>
          </div>
          <div class="col-md text-end">
            <button
              class="btn btn-theme"
              data-bs-toggle="modal"
              data-bs-target="#createExamModal"
              @click="openCreateModal"
            >
              <i data-feather="plus" class="me-1"></i> Créer un Examen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- DataTable -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card adminuiux-card mb-4">
          <div class="card-header">
            <p class="h6 mb-0">Liste des Examen</p>
          </div>
          <div class="card-body px-2">
            <div v-if="tableLoading" class="text-center py-4">
              <div class="spinner-border text-theme-1" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
            <div v-else-if="examList.length === 0" class="text-center py-4">
              <p class="text-muted">Aucun examen disponible</p>
              <button
                class="btn btn-theme btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#createExamModal"
                @click="openCreateModal"
              >
                <i data-feather="plus" class="me-1"></i> Créer le premier
                examen
              </button>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover" ref="examensTable">
                <thead>
                  <tr>
                    <th>Nom de l'eamen</th>
                    <th>Prix</th>
                    <th class="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="examen in examList" :key="examen.id">
                    <td>{{ examen.name }}</td>
                    <td>{{ formatPrice(examen.price) }} FCFA</td>
                    <td class="text-end">
                      <div class="dropdown d-inline-block">
                        <button
                          class="btn btn-link no-caret cp p-0 border-0 bg-transparent"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li>
                            <button
                              class="dropdown-item cp"
                              @click="viewExam(examen)"
                            >
                              <i class="bi bi-eye me-2"></i> Voir Détails
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item cp"
                              @click="editExam(examen)"
                            >
                              <i class="bi bi-pencil me-2"></i> Modifier
                            </button>
                          </li>
                          <li><hr class="dropdown-divider" /></li>
                          <li>
                            <button
                              class="dropdown-item theme-red cp"
                              @click="deleteExam(examen.id)"
                            >
                              <i class="bi bi-trash me-2"></i> Supprimer
                            </button>
                          </li>
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
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "examenManagement",
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",
      examList: [],
      examForm: {
        name: "",
        price: "",
        description: "",
      },
      selectedExam: null,
      loading: false,
      isEditing: false,
      editingId: null,
      tableLoading: false,
      hasError: false,
      dataTable: null,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.examForm.name.trim() !== "" &&
        this.examForm.price !== "" &&
        this.examForm.price >= 0
      );
    },
  },
  mounted() {
    this.getExam();
  },
  beforeUnmount() {
    // Nettoyer DataTable si il existe
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  },
  methods: {
    async getExam() {
      this.tableLoading = true;
      this.hasError = false;

      try {
        const token = localStorage.getItem("current_token");
        if (!token) {
          this.handleAuthError();
          return;
        }

        const response = await axios.get(`${this.baseUrl}api/examens`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        // Gestion simplifiée de la réponse
        if (response.data) {
          if (Array.isArray(response.data)) {
            this.examList = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            this.examList = response.data.data;
          } else if (response.data.data && response.data.data.examens) {
            this.examList = response.data.data.examens;
          } else if (response.data.examens) {
            this.examList = response.data.examens;
          } else {
            this.examList = [];
          }
        } else {
          this.examList = [];
        }
      } catch (error) {
        console.error("Erreur lors du chargement des examens:", error);
        this.hasError = true;
        this.handleError(error, "Impossible de charger les examens");
      } finally {
        this.tableLoading = false;
        // Initialiser DataTable après le chargement des données
        this.$nextTick(() => {
          this.initializeDataTable();
        });
      }
    },

    initializeDataTable() {
      // Éviter d'initialiser DataTable s'il existe déjà ou si pas de données
      if (this.dataTable || this.examList.length === 0) {
        return;
      }

      const table = this.$refs.examensTable;
      if (table && typeof $.fn.DataTable !== "undefined") {
        try {
          this.dataTable = $(table).DataTable({
            pageLength: 10,
            responsive: true,
            ordering: true,
            searching: true,
            info: true,
            paging: true,
            autoWidth: false,
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
          });
        } catch (error) {
          console.warn("DataTable initialization failed:", error);
        }
      }
    },

    openCreateModal() {
      this.isEditing = false;
      this.resetForm();
    },

    viewExam(examen) {
      this.selectedExam = { ...examen };
      const modalElement = document.getElementById("viewExamModal");
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    },

    editExam(examen) {
      this.isEditing = true;
      this.editingId = examen.id;
      this.examForm = {
        name: examen.name,
        price: examen.price,
      };
      const modalElement = document.getElementById("createExamModal");
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    },

    async submitexamForm() {
      if (!this.isFormValid) {
        Swal.fire(
          "Erreur",
          "Veuillez remplir tous les champs correctement",
          "warning"
        );
        return;
      }

      this.loading = true;
      try {
        const token = localStorage.getItem("current_token");
        if (!token) {
          this.handleAuthError();
          return;
        }

        const url = this.isEditing
          ? `${this.baseUrl}api/examens/${this.editingId}`
          : `${this.baseUrl}api/examens`;

        const method = this.isEditing ? "put" : "post";

        await axios[method](url, this.examForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        Swal.fire({
          icon: "success",
          title: this.isEditing ? "examen modifié" : "examen créé",
          showConfirmButton: false,
          timer: 1500,
        });

        await this.getExam();
        this.resetForm();
        window.location.reload();

        const modalElement = document.getElementById("createExamModal");
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'opération:", error);
        this.handleError(error, "Échec de l'opération");
      } finally {
        this.loading = false;
      }
    },

    async deleteExam(id) {
      const confirm = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Cette action est irréversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#dc3545",
      });

      if (confirm.isConfirmed) {
        try {
          const token = localStorage.getItem("current_token");
          if (!token) {
            this.handleAuthError();
            return;
          }

          await axios.delete(`${this.baseUrl}api/examens/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire("Supprimé", "Le examen a été supprimé", "success");
          await this.getExam();
          window.location.reload();
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          this.handleError(error, "Impossible de supprimer le examen");
        }
      }
    },

    resetForm() {
      this.examForm = { name: "", price: "" };
      this.isEditing = false;
      this.editingId = null;
    },

    formatPrice(price) {
      return new Intl.NumberFormat("fr-FR").format(price);
    },

    handleError(error, defaultMessage) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          this.handleAuthError();
        } else if (status === 403) {
          Swal.fire(
            "Erreur",
            "Vous n'avez pas les permissions nécessaires",
            "error"
          );
        } else if (status === 404) {
          Swal.fire("Erreur", "Ressource non trouvée", "error");
        } else {
          Swal.fire(
            "Erreur",
            error.response.data?.message || defaultMessage,
            "error"
          );
        }
      } else if (error.request) {
        Swal.fire("Erreur", "Problème de connexion au serveur", "error");
      } else {
        Swal.fire("Erreur", defaultMessage, "error");
      }
    },

    handleAuthError() {
      Swal.fire({
        icon: "warning",
        title: "Session expirée",
        text: "Veuillez vous reconnecter",
        confirmButtonText: "Se connecter",
      }).then(() => {
        localStorage.removeItem("current_token");
        this.$router.push("/login");
      });
    },
  },
};
</script>

<style scoped>
#modal-logo {
  height: 70px;
  width: 70px;
  border-radius: 70rem;
  object-fit: cover;
}

#modal-title {
  color: rgb(59, 105, 255);
}

.cp {
  cursor: pointer;
}

.theme-red {
  color: #dc3545;
}

.theme-red:hover {
  background-color: #dc3545;
  color: white;
}

.no-caret::after {
  display: none;
}

.form-control:focus {
  border-color: rgb(59, 105, 255);
  box-shadow: 0 0 5px rgba(59, 105, 255, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dropdown-menu {
  min-width: 180px;
}

.table th {
  border-top: none;
  font-weight: 600;
  background-color: #f8f9fa;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}

/* Styles pour DataTable */
.dataTables_wrapper {
  width: 100%;
}

.table-responsive {
  overflow-x: auto;
}
</style>
