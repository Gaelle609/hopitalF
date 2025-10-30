<template>
  <div class="container-fluid mt-3">
    <!-- ✅ En-tête -->
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-md mb-2 mb-sm-0">
          <p class="h5 fw-bold">Gestion des Médicaments</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link :to="{ name: 'Category' }">Catégorie de produits</router-link>
              </li>
              <li class="breadcrumb-item" v-if="categoryId">
                <router-link :to="{ name: 'ViewProduct', query: { categoryId: categoryId } }">Produits</router-link>
              </li>
              <li class="breadcrumb-item" v-if="medicamentId">
                <router-link :to="{ name: 'ProductDetail', query: { medicamentId: medicamentId } }">Détail du produit</router-link>
              </li>
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
    };
  },

  mounted() {
    // ✅ Corrigé : assignation avec =
    this.categoryId = this.$route.query.categoryId || null;
    this.medicamentId = this.$route.query.medicamentId || null;

    console.log("Catégorie ID :", this.categoryId);
    console.log("Médicament ID :", this.medicamentId);

    this.getMedicament();
  },

  methods: {
    getMedicament() {
      // ici tu peux récupérer les produits de la catégorie
      if (!this.categoryId) return;

      this.loading = true;
      const token = localStorage.getItem("current_token");

      axios
        .get(`${this.baseUrl}api/medicaments?category_id=${this.categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Produits :", res.data.data.medicaments);
        })
        .catch(() => {
          Swal.fire("Erreur", "Impossible de charger les produits.", "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    openCreateModal() {
      // ouverture du modal
      const modal = new bootstrap.Modal(document.getElementById("createMedicamentModal"));
      modal.show();
    },
  },
};
</script>
