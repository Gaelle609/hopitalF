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
              <li class="breadcrumb-item active bi" aria-current="page">Catégorie de produits</li>
            </ol>
          </nav>
        </div>
        <div class="col-md text-end">
          <button 
            class="btn btn-theme"
            data-bs-toggle="modal"
            data-bs-target="#createCategoryModal"
            @click="openCreateModal"
          >
            <i class="bi bi-plus-lg me-1"></i> Créer une Catégorie
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
   <div v-else class="row g-4">
  <div 
    v-for="category in categories" 
    :key="category.id" 
    class="col-12 col-sm-6 col-lg-4"
  >
    <div class="card adminuiux-card mb-4 shadow-sm rounded-4">
      <div class="card-body">
        <div class="row gx-3 align-items-center">
          <div class="col-auto">
            <div class="avatar avatar-100 rounded b text-primary-emphasis">
              <img 
                :src="getCategoryImage(category.name)" 
                alt="Icône catégorie"
                class="img-fluid"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
          </div>

          <div class="col">
            <p class="h4 mb-0">{{ category.medicaments_count || 0 }}</p>
            <p class="text-secondary small">{{ category.name }}</p>
          </div>

          <div class="col-auto">
            <div class="height-50 width-50 position-relative">
              
             <router-link 
                :to="{ name: 'Product', query: { categoryId: category.id } }" 
                class="btn btn-theme btn-sm rounded-pill text-decoration-none">
                Voir
            </router-link>

            </div>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col text-end">
            <button 
              class="btn btn-outline-theme btn-sm me-1"
              @click="editCategory(category)"
              title="Modifier"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button 
              class="btn btn-outline-danger btn-sm"
              @click="deleteCategory(category.id)"
              title="Supprimer"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


    <!-- ✅ Modal -->
    <div 
      class="modal fade"
      id="createCategoryModal"
      tabindex="-1"
      aria-labelledby="createCategoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow">
          <!-- Header -->
          <div class="text-center pt-4">
            <img src="../../assets/img/wecare.png" alt="Logo" width="100" class="mb-3" />
            <h5 class="fw-bold text-theme-1">
              {{ isEditing ? 'Modifier la catégorie' : 'Créer une catégorie' }}
            </h5>
          </div>

          <!-- Body -->
          <div class="px-4 py-3">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label class="form-label">Nom de la catégorie <span class="text-danger">*</span></label>
                <input 
                  type="text"
                  class="form-control"
                  v-model="categoryForm.name"
                  placeholder="Ex : Comprimés, Sirops, Injectables..."
                  required
                />
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="px-4 pb-4 text-end">
            <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">
              Fermer
            </button>
            <button type="button" class="btn btn-theme" @click="saveCategory" :disabled="loading">
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

export default {
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",
      categories: [],
      loading: false,
      isEditing: false,
      editingId: null,
      categoryForm: { name: "" },
    };
  },
  
  mounted() {
    this.getCategories();
  },
  methods: {
  
    async getCategories() {
    this.loading = true;
    const token = localStorage.getItem("current_token");

    try {
      const res = await axios.get(`${this.baseUrl}api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const categories = res.data.data.categories;

      // Ajouter les counts
      for (let cat of categories) {
        const resCount = await axios.get(
          `${this.baseUrl}api/count?categoryId=${cat.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        cat.medicaments_count = resCount.data.data.count;
      }

      this.categories = categories;
    } catch (e) {
      Swal.fire("Erreur", "Impossible de charger les catégories.", "error");
    } finally {
      this.loading = false;
    }
  },


   getCategoryImage(name) {
  const lowerName = name.toLowerCase();

  const images = {
    comprime: new URL('../../assets/img/compri.png', import.meta.url).href,
    sirop: new URL('../../assets/img/syrup.png', import.meta.url).href,
    injectable: new URL('../../assets/img/injection.png', import.meta.url).href,
    collyre: new URL('../../assets/img/collyr.png', import.meta.url).href,
    pommade: new URL('../../assets/img/pommade.png', import.meta.url).href,
    materiel: new URL('../../assets/img/materiel.png', import.meta.url).href,
    default: new URL('../../assets/img/ste.png', import.meta.url).href,
  };

  if (lowerName.includes('comprimé')) return images.comprime;
  if (lowerName.includes('sirop')) return images.sirop;
  if (lowerName.includes('injectable')) return images.injectable;
  if (lowerName.includes('pommade')) return images.pommade;
  if (lowerName.includes('collyre')) return images.collyre;
  if (lowerName.includes('materiel')) return images.materiel;

  return images.default;
},


    openCreateModal() {
      this.resetForm();
      this.isEditing = false;
      this.editingId = null;
    },

    editCategory(category) {
      this.isEditing = true;
      this.editingId = category.id;
      this.categoryForm.name = category.name;
      const modal = new bootstrap.Modal(document.getElementById("createCategoryModal"));
      modal.show();
    },

    async saveCategory() {
      this.loading = true;
      const token = localStorage.getItem("current_token");
      try {
        if (this.isEditing) {
          await axios.put(
            `${this.baseUrl}api/categories/${this.editingId}`,
            { name: this.categoryForm.name },
            { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
          );
          Swal.fire("Succès", "Catégorie modifiée avec succès.", "success");
        } else {
          await axios.post(`${this.baseUrl}api/categories`, { name: this.categoryForm.name }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Succès", "Catégorie créée avec succès.", "success");
        }

        this.getCategories();
        bootstrap.Modal.getInstance(document.getElementById("createCategoryModal")).hide();
      } catch (e) {
        Swal.fire("Erreur", e.response?.data?.message || "Erreur d'enregistrement.", "error");
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id) {
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
          await axios.delete(`${this.baseUrl}api/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Supprimé !", "Catégorie supprimée avec succès.", "success");
          this.getCategories();
        } catch {
          Swal.fire("Erreur", "Impossible de supprimer la catégorie.", "error");
        }
      }
    },

    resetForm() {
      this.categoryForm.name = "";
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
