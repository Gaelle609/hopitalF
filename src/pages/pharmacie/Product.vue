<template>
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
              <li class="breadcrumb-item bi active">
                <router-link :to="{ name: 'Category' }">Catégorie de produits</router-link>
              </li>
              <li class="breadcrumb-item bi active" aria-current="page">Produits</li>
            </ol>
          </nav>
        </div>
        <div class="col-md text-end">
          <button
            class="btn btn-theme"
            data-bs-toggle="modal"
            data-bs-target="#createMedicamentModal"
            @click="openCreateModal"
          >
            <i class="bi bi-plus-lg me-1"></i> Créer un Produit
          </button>
        </div>
      </div>
    </div>

    <br />

    <!-- DataTable -->
    <div class="row">
      <div class="col-12">
        <div class="card adminuiux-card mb-4">
          <div class="card-header">
            <p class="h6 mb-0">Liste des Produits</p>
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
              <table ref="dataTableRef" class="table w-100" style="width: 100%">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Nom</th>
                    <th>Quantité</th>
                    <th>Prix Unitaire</th>
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

    <!-- Modal -->
    <div
      class="modal fade"
      id="createMedicamentModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <!-- Header -->
          <div class="text-center pt-4">
            <img src="../../assets/img/wecare.png" alt="Logo" width="100" class="mb-3" />
            <h5 class="fw-bold text-theme-1">
              {{ isEditing ? "Modifier le médicament" : "Créer un médicament" }}
            </h5>
          </div>

          <!-- Body -->
          <div class="px-4 py-3">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nom du médicament <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="medicamentForm.name" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Quantité <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="medicamentForm.quantity" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Prix unitaire (FCFA)</label>
                <input type="number" step="0.01" class="form-control" v-model="medicamentForm.price" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Dose</label>
                <input type="text" class="form-control" v-model="medicamentForm.dose" placeholder="Ex : 500mg" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Fabricant</label>
                <input type="text" class="form-control" v-model="medicamentForm.manufacturer" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Date d'expiration</label>
                <input type="date" class="form-control" v-model="medicamentForm.expiration_date" />
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label">Description</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="medicamentForm.description"
                  placeholder="Ajoutez une description ou une notice du médicament"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-4 pb-4 d-flex justify-content-between">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetForm"
            >
              Fermer
            </button>
            <button
              type="button"
              class="btn btn-theme"
              @click="saveMedicament"
              :disabled="loading"
            >
              {{ loading ? "Enregistrement..." : "Enregistrer" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MedicamentPage",

  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",
      medicamentList: [],
      dataTableInstance: null,
      tableLoading: false,
      loading: false,
      categoryId: null,
      isEditing: false,
      editingId: null,

      medicamentForm: {
        name: "",
        quantity: "",
        price: "",
        dose: "",
        description: "",
        manufacturer: "",
        expiration_date: "",
        statut: "active",
        category_id: null,
      },
    };
  },

  mounted() {
    this.categoryId = this.$route.query.categoryId;
    if (this.categoryId) {
      localStorage.setItem("categoryId", this.categoryId);
    } else {
      this.categoryId = localStorage.getItem("categoryId");
    }
    this.getMedicament();
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

      this.medicamentList.forEach((medicament) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><span class="small text-muted">${medicament.slug || ""}</span></td>
          <td><span class="fw-medium">${medicament.name || ""}</span></td>
          <td><span class="small">${medicament.quantity || ""}</span></td>
          <td><span class="small">${medicament.price || ""} FCFA</span></td>
          <td>
            <div class="dropdown d-inline-block">
              <a class="btn btn-link no-caret cp" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item cp view-btn" data-id="${medicament.id}">
                    <i class="bi bi-eye me-2"></i>Voir Détails
                  </a>
                </li>
                <li>
                  <a class="dropdown-item cp edit-btn" data-id="${medicament.id}">
                    <i class="bi bi-pencil me-2"></i>Modifier
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item theme-red cp delete-btn" data-id="${medicament.id}">
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
        columnDefs: [{ orderable: false, targets: [0, 4] }],
      });

      this.dataTableInstance = dtInstance;

      // Délégation d'événements jQuery
      window
        .$(tableEl)
        .off("click", ".view-btn")
        .on("click", ".view-btn", (e) => {
          const id = window.$(e.currentTarget).data("id");
          this.$router.push({ name: "ViewProduct", query: { medicamentId: id } });
        });

      window
        .$(tableEl)
        .off("click", ".edit-btn")
        .on("click", ".edit-btn", (e) => {
          const id = parseInt(window.$(e.currentTarget).data("id"));
          const medicament = this.medicamentList.find((m) => m.id === id);
          if (medicament) this.editMedicament(medicament);
        });

      window
        .$(tableEl)
        .off("click", ".delete-btn")
        .on("click", ".delete-btn", (e) => {
          const id = parseInt(window.$(e.currentTarget).data("id"));
          this.deleteMedicament(id);
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

    async getMedicament() {
      this.tableLoading = true;
      this.destroyDataTable();
      try {
        const token = localStorage.getItem("current_token");
        const res = await axios.get(
          `${this.baseUrl}api/by-category?categoryId=${this.categoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.medicamentList = res.data.data?.medicaments || [];
      } catch (e) {
        this.$swal.fire("Erreur", "Impossible de charger les produits.", "error");
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

    editMedicament(medicament) {
      this.isEditing = true;
      this.editingId = medicament.id;
      this.medicamentForm = {
        name: medicament.name || "",
        quantity: medicament.quantity || "",
        price: medicament.price || "",
        dose: medicament.dose || "",
        description: medicament.description || "",
        manufacturer: medicament.manufacturer || "",
        expiration_date: medicament.expiration_date || "",
        statut: medicament.statut || "active",
        category_id: medicament.category_id || this.categoryId,
      };
      const modal = new bootstrap.Modal(
        document.getElementById("createMedicamentModal")
      );
      modal.show();
    },

    // ─── Formulaire ───────────────────────────────────────────

    async saveMedicament() {
      this.loading = true;
      const token = localStorage.getItem("current_token");
      try {
        this.medicamentForm.category_id = this.categoryId;

        if (this.isEditing) {
          await axios.put(
            `${this.baseUrl}api/medicaments/${this.editingId}`,
            this.medicamentForm,
            { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
          );
          this.$swal.fire({
            icon: "success",
            title: "Médicament modifié avec succès !",
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          await axios.post(
            `${this.baseUrl}api/medicaments`,
            this.medicamentForm,
            { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
          );
          this.$swal.fire({
            icon: "success",
            title: "Médicament créé avec succès !",
            showConfirmButton: false,
            timer: 2000,
          });
        }

        const modalEl = document.getElementById("createMedicamentModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        this.resetForm();
        await this.getMedicament();
      } catch (e) {
        this.$swal.fire(
          "Erreur",
          e.response?.data?.message || "Erreur d'enregistrement.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },

    async deleteMedicament(id) {
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
          await axios.delete(`${this.baseUrl}api/medicaments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.$swal.fire({
            icon: "success",
            title: "Supprimé !",
            showConfirmButton: false,
            timer: 2000,
          });
          await this.getMedicament();
        } catch {
          this.$swal.fire("Erreur", "Impossible de supprimer le médicament.", "error");
        }
      }
    },

    resetForm() {
      this.medicamentForm = {
        name: "",
        quantity: "",
        price: "",
        dose: "",
        description: "",
        manufacturer: "",
        expiration_date: "",
        statut: "active",
        category_id: this.categoryId,
      };
      this.isEditing = false;
      this.editingId = null;
    },
  },
};
</script>

<style scoped>
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
.btn-theme:hover {
  box-shadow: 3px 3px 3px rgba(59, 105, 255, 0.3);
}
</style>