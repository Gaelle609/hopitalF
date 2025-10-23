<template>
  <div>
    <!-- Modal Créer / Modifier Service -->
    <div class="modal fade" id="createServiceModal" tabindex="-1" aria-labelledby="createServiceModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow">
          <!-- Header -->
          <div class="border-0 text-center pt-4 adminuiux-content">
            <div class="d-flex justify-content-center mb-3">
              <img id="modal-logo" src="../../assets/img/wecare.png" alt="Logo">
            </div>
            <h4 id="modal-title"><b class="text-theme-1">{{ isEditing ? "Modifier le Service" : "Créer un Service" }}</b></h4>
          </div>

          <!-- Corps -->
          <div class="card-body px-4">
            <form @submit.prevent="submitServiceForm">
              <div class="mb-3">
                <label class="form-label">Nom du service</label>
                <input type="text" class="form-control" v-model="serviceForm.name" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Prix</label>
                <input type="number" class="form-control" v-model="serviceForm.price" required>
              </div>
            </form>
          </div>

          <!-- Pied -->
          <div class="border-0 pb-4 px-4 adminuiux-content">
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal" @click="resetForm">Fermer</button>
              <button type="button" class="btn btn-theme" @click="submitServiceForm" :disabled="loading">
                {{ loading ? "Enregistrement..." : (isEditing ? "Mettre à jour" : "Enregistrer") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Service -->
    <div class="modal fade" id="viewServiceModal" tabindex="-1" aria-labelledby="viewServiceModalLabel" aria-hidden="true">
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
                <p class="fw-bold">{{ selectedService.price }} FCFA</p>
              </div>
            </div>
          </div>

          <div class="border-0 pb-4 px-4 adminuiux-content">
            <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal">Fermer</button>
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
                <li class="breadcrumb-item"><router-link :to="{ name: 'HomePage' }">Accueil</router-link></li>
                <li class="breadcrumb-item active" aria-current="page">Service</li>
              </ol>
            </nav>
          </div>
          <div class="col-md text-end">
            <button class="btn btn-theme" data-bs-toggle="modal" data-bs-target="#createServiceModal" @click="openCreateModal">
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
            <table class="table" id="dataTable">
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
                  <td>{{ service.price }} FCFA</td>
                  <td class="text-end">
                    <div class="dropdown d-inline-block">
                      <a class="btn btn-link no-caret cp" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots"></i>
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                          <a class="dropdown-item cp" @click="viewService(service)">
                            <i class="bi bi-eye me-2"></i> Voir Détails
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item cp" @click="editService(service)">
                            <i class="bi bi-pencil me-2"></i> Modifier
                          </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <a class="dropdown-item theme-red cp" @click="deleteService(service.id)">
                            <i class="bi bi-trash me-2"></i> Supprimer
                          </a>
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
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
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
    };
  },
  mounted() {
    this.getServices();
  },
  methods: {
    async getServices() {
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.get(`${this.baseUrl}api/services`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.serviceList = response.data.data.services || [];
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Impossible de charger les services", "error");
      }
    },

    openCreateModal() {
      this.isEditing = false;
      this.resetForm();
    },

    viewService(service) {
      this.selectedService = service;
      const modal = new bootstrap.Modal(document.getElementById("viewServiceModal"));
      modal.show();
    },

    editService(service) {
      this.isEditing = true;
      this.editingId = service.id;
      this.serviceForm = {
        name: service.name,
        price: service.price,
      };
      const modal = new bootstrap.Modal(document.getElementById("createServiceModal"));
      modal.show();
    },

    async submitServiceForm() {
      this.loading = true;
      try {
        const token = localStorage.getItem("current_token");
        const url = this.isEditing
          ? `${this.baseUrl}api/services/${this.editingId}`
          : `${this.baseUrl}api/services`;

        const method = this.isEditing ? "put" : "post";

        await axios[method](url, this.serviceForm, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: "success",
          title: this.isEditing ? "Service modifié" : "Service créé",
          showConfirmButton: false,
          timer: 1500,
        });

        this.getServices();
        this.resetForm();
        const modal = bootstrap.Modal.getInstance(document.getElementById("createServiceModal"));
        modal.hide();
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Échec de l’opération", "error");
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
      });
      if (confirm.isConfirmed) {
        try {
          const token = localStorage.getItem("current_token");
          await axios.delete(`${this.baseUrl}api/services/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Supprimé", "Le service a été supprimé", "success");
          this.getServices();
        } catch (error) {
          Swal.fire("Erreur", "Impossible de supprimer le service", "error");
        }
      }
    },

    resetForm() {
      this.serviceForm = { name: "", price: "" };
      this.isEditing = false;
      this.editingId = null;
    },
  },
};
</script>

<style scoped>
#modal-logo {
  height: 70px;
  width: 70px;
  border-radius: 70rem;
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
</style>
