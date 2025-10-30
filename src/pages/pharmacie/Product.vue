<template>
  <div class="container-fluid mt-3">
    <!-- ✅ En-tête -->
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-md mb-2 mb-sm-0">
          <p class="h5 fw-bold">Gestion des Médicaments</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">
                <router-link :to="{ name: 'Category' }"> Catégorie de produits </router-link>
             </li>
              <li class="breadcrumb-item active bi" aria-current="page">produits</li>
            </ol>
          </nav>
        </div>
        <div class="col-md text-end">
          <button class="btn btn-theme" data-bs-toggle="modal" data-bs-target="#createMedicamentModal" @click="openCreateModal">
            <i class="bi bi-plus-lg me-1"></i> Créer un Produit
          </button>
        </div>
      </div>
    </div>

    <br>

    <!-- ✅ Chargement -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- ✅ Liste des catégories -->
   <!-- DataTable -->
    <div class="row">
      <div class="col-12">
        <div class="card adminuiux-card mb-4">
          <div class="card-header">
            <p class="h6">Liste des Produits</p>
          </div>
          <div class="card-body px-2">
            <table class="table" id="dataTable">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Nom</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="medicament in medicamentList" :key="medicament.id">
                  <td>
                    <p class="mb-0 fw-medium">{{ medicament.slug }}</p>
                  </td>
                  <td>
                    <p class="small mb-0">{{ medicament.name }}</p>
                  </td>
                  <td>
                    <p class="small mb-0">{{ medicament.quentity }}</p>
                  </td>
                  <td>
                    <p class="small mb-0">{{ medicament.price }} FCFA</p>
                  </td>
                  <td>
                    <div class="dropdown d-inline-block">
                      <a class="btn btn-link no-caret cp" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots"></i>
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                             <router-link 
                                :to="{ name: 'ViewProduct', query: { medicamentId: medicament.id } }" 
                                class="btn btn-theme btn-sm dropdown-item cp">
                                <i class="bi bi-eye me-2"></i>Voir Détails
                            </router-link>
                          <a class="">
                           
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item cp" @click="editMedicament(medicament)">
                            <i class="bi bi-pencil me-2"></i>Modifier
                          </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <a class="dropdown-item theme-red cp" @click="deleteMedicament(medicament.id)">
                            <i class="bi bi-trash me-2"></i>Supprimer
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


    <!-- ✅ Modal -->
    <div 
      class="modal fade"
      id="createMedicamentModal"
      tabindex="-1"
      aria-labelledby="createMedicamentModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <!-- Header -->
          <div class="text-center pt-4">
            <img src="../../assets/img/wecare.png" alt="Logo" width="100" class="mb-3" />
            <h5 class="fw-bold text-theme-1">
              {{ isEditing ? 'Modifier le produit' : 'Créer un produit' }}
            </h5>
          </div>

          <!-- Body -->
          <div class="px-4 py-3">
            <form @submit.prevent="saveMedicament">
              <div class="mb-3">
                <label class="form-label">Nom du produit <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="medicamentForm.name" required/>
              </div>
              <div class="mb-3">
                <label class="form-label">Quantité du produit <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="medicamentForm.quentity" required/>
              </div>
              <div class="mb-3">
                <label class="form-label">Prix unitaire <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="medicamentForm.price" required/>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="px-4 pb-4 text-end">
            <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">
              Fermer
            </button>
            <button type="button" class="btn btn-theme" @click="saveMedicament" :disabled="loading">
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { nextTick } from "vue";
export default {
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",
      medicamentList: [],
      loading: false,
      categoryId: null,
      isEditing: false,
      editingId: null,
      medicamentForm: {
        name: "",
        quentity: "",
        price: "",
        category_id: null,
      },
    };
  },

  mounted() {
    this.categoryId = this.$route.query.categoryId;
    console.log("Catégorie ID :", this.categoryId);
    this.getMedicament();
  },

  methods: {
    async getMedicament() {
      this.loading = true;
      try {
        const token = localStorage.getItem("current_token");
        const res = await axios.get(`${this.baseUrl}api/medicaments?categoryId=${this.categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        this.medicamentList = res.data.data.medicaments || [];
      } catch (e) {
        Swal.fire("Erreur", "Impossible de charger les produits.", "error");
      } finally {
        this.loading = false;
      }
    },

    openCreateModal() {
      this.resetForm();
      this.isEditing = false;
      this.editingId = null;
      const modal = new bootstrap.Modal(document.getElementById("createMedicamentModal"));
      modal.show();
    },

    editMedicament(medicament) {
      this.isEditing = true;
      this.editingId = medicament.id;
      this.medicamentForm = {
        name: medicament.name,
        quentity: medicament.quentity,
        price: medicament.price,
        category_id: medicament.category_id,
      };
      const modal = new bootstrap.Modal(document.getElementById("createMedicamentModal"));
      modal.show();
    },

    async saveMedicament() {
      this.loading = true;
      const token = localStorage.getItem("current_token");

      try {

        this.medicamentForm.category_id = this.categoryId;
        console.log(this.medicamentForm);
        if (this.isEditing) {

            console.log("Modification du médicament ID :", this.editingId);
            await axios.put(
            `${this.baseUrl}api/medicaments/${this.editingId}`,
            this.medicamentForm,
            {
              headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            }
          );
          Swal.fire("Succès", "Produit modifié avec succès.", "success");
        } else {

          await axios.post(`${this.baseUrl}api/medicaments`, this.medicamentForm, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          Swal.fire("Succès", "Produit créé avec succès.", "success");
        }

        this.getMedicament();
        bootstrap.Modal.getInstance(document.getElementById("createMedicamentModal")).hide();
      } catch (e) {
        Swal.fire("Erreur", e.response?.data?.message || "Erreur d'enregistrement.", "error");
      } finally {
        this.loading = false;
      }
    },

    async deleteMedicament(id) {
      const confirm = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Cette action est irréversible !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
      });

      if (confirm.isConfirmed) {
        try {
          const token = localStorage.getItem("current_token");
          await axios.delete(`${this.baseUrl}api/medicaments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Supprimé !", "Produit supprimé avec succès.", "success");
          this.getMedicament();
        } catch {
          Swal.fire("Erreur", "Impossible de supprimer le produit.", "error");
        }
      }
    },

    resetForm() {
      this.medicamentForm = {
        name: "",
        quentity: "",
        price: "",
        category_id: this.categoryId,
      };
    },
  },
};
</script>



<style scoped>
.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}
</style>
