<template>
  <div class="container-fluid mt-3">
    <!-- En-tête -->
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-md mb-2 mb-sm-0">
          <p class="h5">Gestion des Médicaments</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">Médicaments</li>
            </ol>
          </nav>
        </div>
        <div class="col-md text-end">
          <button 
            class="btn btn-theme" 
            data-bs-toggle="modal" 
            data-bs-target="#createCategoryModal" 
            @click="openCreateCategoryModal"
            :disabled="loading"
          >
            <i data-feather="plus" class="me-1"></i> Créer une Catégorie
          </button>
        </div>
      </div>
    </div>
    <br>

    <!-- Loader -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- Affichage des catégories -->
    <div class="row" v-else-if="categories.length > 0">
      <div 
        v-for="(category, index) in categories" 
        :key="category.id" 
        class="col-12 col-md-6 col-lg-3"
      >
        <div class="card adminuiux-card mb-4">
          <div class="card-body">
            <div class="row gx-3 align-items-center">
              <div class="col-auto">
                <div 
                  class="avatar avatar-50 rounded"
                  :class="getCategoryColorClass(index)"
                >
                  <i :class="(category.icon || 'bi bi-capsule') + ' fs-4 vm'"></i>
                </div>
              </div>
              <div class="col">
                <p class="h4 mb-0">{{ category.medication_count || 0 }}</p>
                <p class="text-secondary small">{{ category.name }}</p>
              </div>
              <div class="col-auto">
                <div class="height-50 width-50 position-relative">
                  <div :id="'circleprogress' + category.id"></div>
                </div>
              </div>
            </div>
            <!-- Actions sur la catégorie -->
            <div class="row mt-2">
              <div class="col text-end">
                <button 
                  class="btn btn-sm btn-outline-primary me-1" 
                  @click="editCategory(category)"
                  title="Modifier"
                  :disabled="loading"
                >
                  <i data-feather="edit-2"></i>
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger" 
                  @click="deleteCategory(category.id)"
                  title="Supprimer"
                  :disabled="loading"
                >
                  <i data-feather="trash-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucune catégorie -->
    <div v-else class="text-center py-5">
      <div class="mb-3">
        <i data-feather="package" class="text-muted" style="width: 64px; height: 64px;"></i>
      </div>
      <h5 class="text-muted">Aucune catégorie de médicament</h5>
      <p class="text-secondary">Cliquez sur "Créer une Catégorie" pour commencer</p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="error = null"></button>
    </div>

    <!-- Message de succès -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = null"></button>
    </div>

    <!-- Modal Créer/Modifier Catégorie -->
    <div 
      class="modal fade" 
      id="createCategoryModal" 
      tabindex="-1" 
      aria-labelledby="createCategoryModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createCategoryModalLabel">
              {{ isEditMode ? 'Modifier la Catégorie' : 'Créer une Catégorie' }}
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label for="categoryName" class="form-label">Nom de la catégorie</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="categoryName" 
                  v-model="formData.name"
                  placeholder="Ex: Comprimé, Sirop, Pommade..."
                  required
                  :disabled="saving"
                >
              </div>
              <div class="mb-3">
                <label for="categoryIcon" class="form-label">Icône (optionnel)</label>
                <select 
                  class="form-select" 
                  id="categoryIcon" 
                  v-model="formData.icon"
                  :disabled="saving"
                >
                  <option value="bi bi-capsule">Capsule</option>
                  <option value="bi bi-file-earmark-medical">Médical</option>
                  <option value="bi bi-clipboard2-pulse">Pulse</option>
                  <option value="bi bi-heart-pulse">Coeur</option>
                  <option value="bi bi-eyedropper">Gouttes</option>
                  <option value="bi bi-bandaid">Pansement</option>
                  <option value="bi bi-thermometer">Thermomètre</option>
                  <option value="bi bi-prescription2">Prescription</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="categoryDescription" class="form-label">Description (optionnel)</label>
                <textarea 
                  class="form-control" 
                  id="categoryDescription" 
                  v-model="formData.description"
                  rows="3"
                  placeholder="Description de la catégorie..."
                  :disabled="saving"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
              :disabled="saving"
            >
              Annuler
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="saveCategory"
              :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              {{ isEditMode ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MedicationManagement',
  data() {
    return {
      categories: [],
      isEditMode: false,
      currentCategoryId: null,
      loading: false,
      saving: false,
      error: null,
      successMessage: null,
      formData: {
        name: '',
        icon: 'bi bi-capsule',
        description: ''
      },
      colorClasses: [
        'bg-primary-subtle text-primary-emphasis',
        'bg-success-subtle text-success-emphasis',
        'bg-warning-subtle text-warning-emphasis',
        'bg-danger-subtle text-danger-emphasis',
        'bg-info-subtle text-info-emphasis',
        'bg-secondary-subtle text-secondary-emphasis'
      ]
    }
  },
  mounted() {
    this.loadCategories();
    // Initialiser Feather Icons si disponible
    if (window.feather) {
      this.$nextTick(() => {
        window.feather.replace();
      });
    }
  },
  updated() {
    // Réinitialiser Feather Icons après chaque mise à jour
    if (window.feather) {
      this.$nextTick(() => {
        window.feather.replace();
      });
    }
  },
  methods: {
    async loadCategories() {
      this.loading = true;
      this.error = null;
      
      try {
        // Remplacez '/api/medication-categories' par votre endpoint réel
        const response = await axios.get('/api/medication-categories');
        this.categories = response.data.data || response.data;
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        this.error = 'Impossible de charger les catégories. Veuillez réessayer.';
        this.categories = [];
      } finally {
        this.loading = false;
      }
    },
    
    openCreateCategoryModal() {
      this.isEditMode = false;
      this.currentCategoryId = null;
      this.formData = {
        name: '',
        icon: 'bi bi-capsule',
        description: ''
      };
      this.error = null;
    },
    
    editCategory(category) {
      this.isEditMode = true;
      this.currentCategoryId = category.id;
      this.formData = {
        name: category.name,
        icon: category.icon || 'bi bi-capsule',
        description: category.description || ''
      };
      this.error = null;
      
      // Ouvrir le modal
      const modal = new bootstrap.Modal(document.getElementById('createCategoryModal'));
      modal.show();
    },
    
    async saveCategory() {
      if (!this.formData.name.trim()) {
        this.error = 'Veuillez entrer un nom de catégorie';
        return;
      }

      this.saving = true;
      this.error = null;

      try {
        let response;
        
        if (this.isEditMode) {
          // Modification - PUT ou PATCH
          response = await axios.put(
            `/api/medication-categories/${this.currentCategoryId}`, 
            this.formData
          );
          this.successMessage = 'Catégorie modifiée avec succès';
        } else {
          // Création - POST
          response = await axios.post('/api/medication-categories', this.formData);
          this.successMessage = 'Catégorie créée avec succès';
        }

        // Recharger les catégories
        await this.loadCategories();
        
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createCategoryModal'));
        if (modal) {
          modal.hide();
        }

        // Réinitialiser le formulaire
        this.formData = {
          name: '',
          icon: 'bi bi-capsule',
          description: ''
        };

        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);

      } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err);
        this.error = err.response?.data?.message || 'Erreur lors de la sauvegarde de la catégorie';
      } finally {
        this.saving = false;
      }
    },
    
    async deleteCategory(categoryId) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`/api/medication-categories/${categoryId}`);
        this.successMessage = 'Catégorie supprimée avec succès';
        
        // Recharger les catégories
        await this.loadCategories();

        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);

      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        this.error = err.response?.data?.message || 'Erreur lors de la suppression de la catégorie';
      } finally {
        this.loading = false;
      }
    },
    
    getCategoryColorClass(index) {
      return this.colorClasses[index % this.colorClasses.length];
    }
  }
}
</script>

<style scoped>
.adminuiux-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.adminuiux-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vm {
  vertical-align: middle;
}

.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>