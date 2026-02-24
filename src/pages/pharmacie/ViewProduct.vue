<template>
  <!-- Modal pour modifier la quantité (ajout ou retrait) -->
  <div class="modal fade" id="updateStockModal" tabindex="-1" aria-labelledby="updateStockModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="text-center pt-4">
          <h5 class="fw-bold text-theme-1">Modifier la quantité</h5>
        </div>
        <div class="px-4 py-3">
          <form @submit.prevent="updateStock">
            <div class="mb-3">
              <label class="form-label">Quantité actuelle</label>
              <input type="number" class="form-control" :value="medicament?.quantity" disabled />
            </div>

            <div class="mb-3" hidden>
              <label class="form-label">Action</label>
              <select class="form-select" v-model="stockAction">
                <option value="add">Ajouter</option>
                <option value="remove">Retirer</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Quantité</label>
              <input type="number" class="form-control" v-model.number="quantityChange" min="1" placeholder="Ex : 5" required />
              <small class="text-muted">
                L'opération sera {{ stockAction === 'add' ? 'un ajout' : 'un retrait' }}.
              </small>
            </div>
          </form>
        </div>

        <div class="px-4 pb-4 text-end">
          <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Fermer</button>
          <button type="button" class="btn btn-theme" @click="updateStock" :disabled="loading">
            {{ loading ? 'Enregistrement...' : 'Mettre à jour' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid mt-3">
    <!-- En-tête -->
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-md mb-2 mb-sm-0">
          <p class="h5 fw-bold">Gestion des Médicaments</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'Category' }">Catégorie de produits</router-link>
              </li>
              <li class="breadcrumb-item bi" v-if="categoryId">
                <router-link :to="{ name: 'Product', query: { categoryId: categoryId } }">Produits</router-link>
              </li>
              <li class="breadcrumb-item bi">Détail du produit</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- Carte du Produit -->
    <div v-else-if="medicament" class="row mt-4">
      <div class="col-lg-12 mx-auto">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <div class="row">
              <!-- Détails du produit -->
              <div class="col-md-8">
                <h3 class="fw-bold text-primary mb-3">{{ medicament?.name || 'Produit inconnu' }}</h3>

                <div class="mb-3">
                  <span class="badge bg-info text-dark me-2">
                    <i class="bi bi-tag-fill me-1"></i>{{ category?.name || 'Non catégorisé' }}
                  </span>
                  <span class="badge" :class="medicament?.quantity > 0 ? 'bg-warning' : 'bg-danger'">
                    <i class="bi bi-box-seam me-1"></i>
                    {{ medicament?.quantity <= 0 ? 'Rupture de stock' : medicament?.quantity <= 6 ? 'Stock limité' : 'En stock' }}
                  </span>
                </div>

                <div class="row g-3 mb-4">
                  <div class="col-sm-6">
                    <div class="p-3 bg-light rounded">
                      <small class="text-muted d-block">Prix Unitaire</small>
                      <h5 class="mb-0 text-success fw-bold">{{ medicament?.price || '-' }} FCFA</h5>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="p-3 bg-light rounded">
                      <small class="text-muted d-block">Quantité Disponible</small>
                      <h5 class="mb-0 fw-bold">{{ medicament?.quantity || 0 }} unités</h5>
                    </div>
                  </div>
                </div>

                <hr>

                <!-- Informations supplémentaires -->
                <div class="row g-3">
                  <div class="col-12">
                    <h6 class="fw-bold mb-2"><i class="bi bi-file-text me-2 text-primary"></i>Description</h6>
                    <p class="text-muted mb-0">{{ medicament?.description || 'Aucune description' }}</p>
                  </div>

                  <div class="col-sm-6" v-if="medicament?.slug">
                    <h6 class="fw-bold mb-2"><i class="bi bi-upc me-2 text-primary"></i>Code Produit</h6>
                    <p class="text-muted mb-0">{{ medicament?.slug }}</p>
                  </div>

                  <div class="col-sm-6" v-if="medicament?.expiration_date">
                    <h6 class="fw-bold mb-2"><i class="bi bi-calendar-event me-2 text-primary"></i>Date d'expiration</h6>
                    <p class="text-muted mb-0">{{ formatDate(medicament?.expiration_date) }}</p>
                  </div>

                  <div class="col-sm-6">
                    <h6 class="fw-bold mb-2"><i class="bi bi-building me-2 text-primary"></i>Fabricant</h6>
                    <p class="text-muted mb-0">{{ medicament?.manufacturer || '-' }}</p>
                  </div>

                  <div class="col-sm-6">
                    <h6 class="fw-bold mb-2"><i class="bi bi-capsule me-2 text-primary"></i>Dosage</h6>
                    <p class="text-muted mb-0">{{ medicament?.dose || '-' }} mmg</p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-4 d-flex gap-2">
                  <button class="btn btn-success" @click="openStockModal('add')">
                    <i class="bi bi-pencil-square me-1"></i> Ajouter
                  </button>
                  <button class="btn btn-outline-danger" @click="openStockModal('remove')">
                    <i class="bi bi-trash me-1"></i> Retirer
                  </button>
                  <button class="btn btn-outline-secondary ms-auto" @click="retour">
                    <i class="bi bi-arrow-left me-1"></i> Retour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucun produit -->
    <div v-else class="text-center my-5">
      <i class="bi bi-exclamation-circle text-muted" style="font-size: 4rem;"></i>
      <p class="text-muted mt-3">Aucun produit trouvé</p>
      <button class="btn btn-primary" @click="retour">
        <i class="bi bi-arrow-left me-1"></i> Retour à la liste
      </button>
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
      loading: false,
      categoryId: null,
      medicamentId: null,
      medicament: null,
      quantityChange: 0, 
      stockAction: 'add', 
      category: null,
    };
  },

  mounted() {
    this.categoryId = localStorage.getItem("categoryId") || null;
    this.medicamentId = this.$route.query.medicamentId || null;

    this.getMedicament();
    this.getCategory();
  },

  methods: {
    getMedicament() {
      this.loading = true;
      const token = localStorage.getItem("current_token");

      axios
        .get(`${this.baseUrl}api/medicaments/${this.medicamentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          this.medicament = res.data.data.medicament || null;
        })
        .catch(() => {
          Swal.fire("Erreur", "Impossible de charger le produit.", "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getCategory() {
      if (!this.categoryId) return;
      this.loading = true;
      const token = localStorage.getItem("current_token");

      axios
        .get(`${this.baseUrl}api/categories/${this.categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          this.category = res.data.data.category || null;
        })
        .catch(() => {
          Swal.fire("Erreur", "Impossible de charger la catégorie.", "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    openStockModal(action = 'add') {
      this.stockAction = action;
      this.quantityChange = 0;
      const modal = new bootstrap.Modal(document.getElementById("updateStockModal"));
      modal.show();
    },

    updateStock() {
      if (!this.medicament) return;

      let newQuantity = this.medicament.quantity;
      if (this.stockAction === 'add') {
        newQuantity += this.quantityChange;
      } else {
        newQuantity -= this.quantityChange;
        if (newQuantity < 0) {
          Swal.fire("Erreur", "La quantité finale ne peut pas être négative.", "error");
          return;
        }
      }

      this.loading = true;
      const token = localStorage.getItem("current_token");

      axios.put(`${this.baseUrl}api/medicaments/${this.medicament.id}`, {
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
      })
      .then(() => {
        Swal.fire("Succès", "Quantité mise à jour avec succès.", "success");
        this.medicament.quantity = newQuantity;
        this.quantityChange = 0;
        bootstrap.Modal.getInstance(document.getElementById("updateStockModal"))?.hide();
      })
      .catch(err => {
        Swal.fire("Erreur", err.response?.data?.message || "Impossible de mettre à jour la quantité.", "error");
      })
      .finally(() => {
        this.loading = false;
      });
    },

    formatDate(date) {
      if (!date) return 'Non spécifiée';
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    supprimerProduit() {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Cette action est irréversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Info", "Fonctionnalité de suppression à implémenter", "info");
        }
      });
    },

    retour() {
      this.$router.push({ name: 'Product', query: { categoryId: this.categoryId } });
    }
  },
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.badge {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}
</style>
