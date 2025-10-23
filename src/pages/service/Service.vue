<template>
  <div>
    <!-- Modal Créer / Modifier Service -->
    <div
      class="modal fade"
      id="createServiceModal"
      tabindex="-1"
      aria-labelledby="createServiceModalLabel"
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
                isEditing ? "Modifier le Service" : "Créer un Service"
              }}</b>
            </h4>
          </div>

          <!-- Corps -->
          <div class="card-body px-4">
            <form @submit.prevent="submitServiceForm">
              <div class="mb-3">
                <label class="form-label">Nom du service</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="serviceForm.name"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Prix</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="serviceForm.price"
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
                @click="submitServiceForm"
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

    <!-- Modal Détails Service -->
    <div
      class="modal fade"
      id="viewServiceModal"
      tabindex="-1"
      aria-labelledby="viewServiceModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow">
          <div class="border-0 text-center pt-4 adminuiux-content">
            <h4><b class="text-theme-1">Détails du Service</b></h4>
          </div>

          <div class="card-body px-4" v-if="selectedService">
            <div class="row">
              <div class="col-12 mb-3">
                <p class="text-secondary mb-1">Nom</p>
                <p class="fw-bold">{{ selectedService.name }}</p>
              </div>
              <div class="col-12 mb-3">
                <p class="text-secondary mb-1">Prix</p>
                <p class="fw-bold">
                  {{ formatPrice(selectedService.price) }} FCFA
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
            <p class="h5">Gestion des Services</p>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Service
                </li>
              </ol>
            </nav>
          </div>
          <div class="col-md text-end">
            <button
              class="btn btn-theme"
              data-bs-toggle="modal"
              data-bs-target="#createServiceModal"
              @click="openCreateModal"
            >
              <i data-feather="plus" class="me-1"></i> Créer un Service
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
            <p class="h6 mb-0">Liste des Services</p>
          </div>
          <div class="card-body px-2">
            <div v-if="tableLoading" class="text-center py-4">
              <div class="spinner-border text-theme-1" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
            <div v-else-if="serviceList.length === 0" class="text-center py-4">
              <p class="text-muted">Aucun service disponible</p>
              <button
                class="btn btn-theme btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#createServiceModal"
                @click="openCreateModal"
              >
                <i data-feather="plus" class="me-1"></i> Créer le premier
                service
              </button>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover" ref="servicesTable">
                <thead>
                  <tr>
                    <th>Nom du Service</th>
                    <th>Prix</th>
                    <th class="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="service in serviceList" :key="service.id">
                    <td>{{ service.name }}</td>
                    <td>{{ formatPrice(service.price) }} FCFA</td>
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
                              @click="viewService(service)"
                            >
                              <i class="bi bi-eye me-2"></i> Voir Détails
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item cp"
                              @click="editService(service)"
                            >
                              <i class="bi bi-pencil me-2"></i> Modifier
                            </button>
                          </li>
                          <li><hr class="dropdown-divider" /></li>
                          <li>
                            <button
                              class="dropdown-item theme-red cp"
                              @click="deleteService(service.id)"
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
  name: "ServiceManagement",
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",
      serviceList: [],
      serviceForm: {
        name: "",
        price: "",
      },
      selectedService: null,
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
        this.serviceForm.name.trim() !== "" &&
        this.serviceForm.price !== "" &&
        this.serviceForm.price >= 0
      );
    },
  },
  mounted() {
    this.getServices();
  },
  beforeUnmount() {
    // Nettoyer DataTable si il existe
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  },
  methods: {
    async getServices() {
      this.tableLoading = true;
      this.hasError = false;

      try {
        const token = localStorage.getItem("current_token");
        if (!token) {
          this.handleAuthError();
          return;
        }

        const response = await axios.get(`${this.baseUrl}api/services`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        // Gestion simplifiée de la réponse
        if (response.data) {
          if (Array.isArray(response.data)) {
            this.serviceList = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            this.serviceList = response.data.data;
          } else if (response.data.data && response.data.data.services) {
            this.serviceList = response.data.data.services;
          } else if (response.data.services) {
            this.serviceList = response.data.services;
          } else {
            this.serviceList = [];
          }
        } else {
          this.serviceList = [];
        }
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        this.hasError = true;
        this.handleError(error, "Impossible de charger les services");
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
      if (this.dataTable || this.serviceList.length === 0) {
        return;
      }

      const table = this.$refs.servicesTable;
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

    viewService(service) {
      this.selectedService = { ...service };
      const modalElement = document.getElementById("viewServiceModal");
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    },

    editService(service) {
      this.isEditing = true;
      this.editingId = service.id;
      this.serviceForm = {
        name: service.name,
        price: service.price,
      };
      const modalElement = document.getElementById("createServiceModal");
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    },

    async submitServiceForm() {
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
          ? `${this.baseUrl}api/services/${this.editingId}`
          : `${this.baseUrl}api/services`;

        const method = this.isEditing ? "put" : "post";

        await axios[method](url, this.serviceForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        Swal.fire({
          icon: "success",
          title: this.isEditing ? "Service modifié" : "Service créé",
          showConfirmButton: false,
          timer: 1500,
        });

        await this.getServices();
        this.resetForm();

        const modalElement = document.getElementById("createServiceModal");
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

    async deleteService(id) {
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

          await axios.delete(`${this.baseUrl}api/services/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire("Supprimé", "Le service a été supprimé", "success");
          await this.getServices();
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          this.handleError(error, "Impossible de supprimer le service");
        }
      }
    },

    resetForm() {
      this.serviceForm = { name: "", price: "" };
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
