<template>
  <div>
    <!-- Modal Créer Personnel -->
    <div
      class="modal fade"
      id="createPersonnelModal"
      tabindex="-1"
      aria-labelledby="createPersonnelModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content border-0 shadow">
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
                isEditing ? "Modifier le Personnel" : "Créer un Personnel"
              }}</b>
            </h4>
          </div>

          <div class="card-body px-5">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Prénom</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="personnelForm.first_name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Nom</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="personnelForm.last_name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Téléphone</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="personnelForm.phone_number"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label d-block">Sexe</label>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="Masculin"
                    v-model="personnelForm.gender"
                  />
                  <label class="form-check-label">Masculin</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="Féminin"
                    v-model="personnelForm.gender"
                  />
                  <label class="form-check-label">Féminin</label>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Adresse</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="personnelForm.adress"
                />
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">Fonction</label>
                <select
                  class="form-control"
                  v-model="personnelForm.role_id"
                  required
                >
                  <option value="" disabled>Choisir une fonction</option>
                  <option v-for="role in roles" :key="role.id" :value="role.id">
                    {{ role.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Âge</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="personnelForm.age"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Photo de profil</label>
                <input
                  type="file"
                  class="form-control"
                  @change="handleFileUpload"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div class="border-0 pb-4 px-5 adminuiux-content">
            <div v-if="generatedPassword" class="alert alert-info mb-3">
              <i class="bi bi-key me-2"></i>
              <strong>Mot de passe :</strong> {{ generatedPassword }}
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary ms-3"
                @click="copyPassword"
              >
                <i class="bi bi-clipboard"></i> Copier
              </button>
            </div>
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
                @click="submitPersonnelForm"
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
            <p class="h5">Gestion du Personnel</p>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
                </li>
                <li class="breadcrumb-item bi active" aria-current="page">
                  Personnel
                </li>
              </ol>
            </nav>
          </div>
          <div class="col-md text-end">
            <button
              class="btn btn-theme"
              data-bs-toggle="modal"
              data-bs-target="#createPersonnelModal"
              @click="openCreateModal"
            >
              <i class="bi bi-plus-lg me-1"></i> Créer un Personnel
            </button>
          </div>
        </div>
      </div>
    </div>

    <br />

    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card adminuiux-card mb-4">
            <div class="card-header">
              <p class="h6 mb-0">Liste du Personnel</p>
            </div>
            <div class="card-body px-2">
              <div v-if="tableLoading" class="text-center py-5">
                <div class="spinner-border text-theme" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </div>

              <!-- v-show (pas v-if) : le DOM reste présent pour DataTables -->
              <div v-show="!tableLoading">
                <table
                  ref="dataTableRef"
                  class="table w-100"
                  style="width: 100%"
                >
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Nom Complet</th>
                      <th>Matricule</th>
                      <th>Téléphone</th>
                      <th>Sexe</th>
                      <th>Adresse</th>
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
  name: "PersonnelIndex",

  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/",
      personnelList: [],
      roles: [],
      dataTableInstance: null,
      tableLoading: false,
      personnelForm: {
        first_name: "",
        last_name: "",
        role_id: "",
        phone_number: "",
        gender: "",
        age: "",
        adress: "",
        password: "",
        picture: null,
      },
      loading: false,
      isEditing: false,
      editingId: null,
      generatedPassword: "",
    };
  },

  mounted() {
    this.getPersonnel();
  },

  // ✅ Détruire DataTables avant que Vue démonte le composant (changement de route)
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
        console.error(
          "jQuery ou DataTables non disponible. Vérifiez index.html.",
        );
        return;
      }

      const tableEl = this.$refs.dataTableRef;
      if (!tableEl) return;

      // Détruire l'ancienne instance proprement
      this.destroyDataTable();

      // Reconstruire le tbody manuellement (évite le conflit Vue/DataTables sur le DOM)
      const tbody = tableEl.querySelector("tbody");
      tbody.innerHTML = "";

      this.personnelList.forEach((personnel) => {
        const tr = document.createElement("tr");
        const imgSrc = personnel.picture
          ? `${this.baseUrl}${personnel.picture}`
          : "../../assets/img/avatar.jpg";
        const badgeClass =
          personnel.gender === "Masculin" ? "bg-primary" : "bg-pink";

        tr.innerHTML = `
          <td>
            <img src="${imgSrc}" alt="Avatar" class="rounded-circle"
              style="width:40px;height:40px;object-fit:cover;"
              onerror="this.src='../../assets/img/avatar.jpg'">
          </td>
          <td><span class="fw-medium">${personnel.first_name || ""} ${personnel.last_name || ""}</span></td>
          <td><span class="small text-muted">${personnel.matricule || ""}</span></td>
          <td><span class="small">${personnel.phone_number || ""}</span></td>
          <td><span class="badge ${badgeClass}">${personnel.gender || ""}</span></td>
          <td><span class="small">${personnel.adress || ""}</span></td>
          <td>
            <div class="dropdown d-inline-block">
              <a class="btn btn-link no-caret cp" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item cp view-btn" data-id="${personnel.id}">
                    <i class="bi bi-eye me-2"></i>Voir Détails
                  </a>
                </li>
                <li>
                  <a class="dropdown-item cp edit-btn" data-id="${personnel.id}">
                    <i class="bi bi-pencil me-2"></i>Modifier
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item theme-red cp delete-btn" data-id="${personnel.id}">
                    <i class="bi bi-trash me-2"></i>Supprimer
                  </a>
                </li>
              </ul>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Init DataTables avec langue française
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

      // Délégation d'événements jQuery (les boutons peuvent être dans n'importe quelle page de DataTables)
      window
        .$(tableEl)
        .off("click", ".view-btn")
        .on("click", ".view-btn", (e) => {
          const id = window.$(e.currentTarget).data("id");
          this.$router.push({
            name: "ViewPersonnel",
            query: { personnelId: id },
          });
        });

      window
        .$(tableEl)
        .off("click", ".edit-btn")
        .on("click", ".edit-btn", (e) => {
          const id = parseInt(window.$(e.currentTarget).data("id"));
          const personnel = this.personnelList.find((p) => p.id === id);
          if (personnel) this.editPersonnel(personnel);
        });

      window
        .$(tableEl)
        .off("click", ".delete-btn")
        .on("click", ".delete-btn", (e) => {
          const id = parseInt(window.$(e.currentTarget).data("id"));
          this.deletePersonnel(id);
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

    async getPersonnel() {
      this.tableLoading = true;
      this.destroyDataTable();
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.get(`${this.baseUrl}api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.personnelList = response.data.data.users || [];
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors du chargement du personnel.",
        });
      } finally {
        this.tableLoading = false;
        // ✅ nextTick garantit que v-show a rendu le tableau avant qu'on l'initialise
        this.$nextTick(() => {
          this.initDataTable();
        });
      }
    },

    async loadRole() {
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.get(`${this.baseUrl}api/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.roles = response.data.data.roles || [];
      } catch (error) {
        console.error("Erreur chargement rôles", error);
      }
    },

    // ─── Modal ────────────────────────────────────────────────

    async openCreateModal() {
      this.resetForm();
      this.generatedPassword = "";
      await this.loadRole();
    },

    editPersonnel(personnel) {
      this.isEditing = true;
      this.editingId = personnel.id;
      this.generatedPassword = "";
      this.personnelForm = {
        first_name: personnel.first_name || "",
        last_name: personnel.last_name || "",
        role_id: personnel.role_id || "",
        phone_number: personnel.phone_number || "",
        gender: personnel.gender || "",
        age: personnel.age || "",
        adress: personnel.adress || "",
        password: "",
        picture: null,
      };
      this.loadRole().then(() => {
        const modal = new bootstrap.Modal(
          document.getElementById("createPersonnelModal"),
        );
        modal.show();
      });
    },

    // ─── Formulaire ───────────────────────────────────────────

    handleFileUpload(event) {
      this.personnelForm.picture = event.target.files[0] || null;
    },

    async submitPersonnelForm() {
      this.loading = true;
      try {
        const token = localStorage.getItem("current_token");
        const formData = new FormData();
        Object.keys(this.personnelForm).forEach((key) => {
          if (
            this.personnelForm[key] !== null &&
            this.personnelForm[key] !== ""
          ) {
            formData.append(key, this.personnelForm[key]);
          }
        });

        let response;
        if (this.isEditing) {
          response = await axios.post(
            `${this.baseUrl}api/users/${this.editingId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } else {
          response = await axios.post(`${this.baseUrl}api/register`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          this.generatedPassword = response.data.data.password || "";
        }

        this.$swal.fire({
          icon: "success",
          title: this.isEditing
            ? "Personnel modifié avec succès !"
            : "Personnel créé avec succès !",
          showConfirmButton: false,
          timer: 2000,
        });

        if (this.isEditing) {
          const modalEl = document.getElementById("createPersonnelModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          this.resetForm();
        }

        await this.getPersonnel();
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.response?.data?.message || "Erreur lors de l'opération.",
        });
      } finally {
        this.loading = false;
      }
    },

    async deletePersonnel(id) {
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
          await axios.delete(`${this.baseUrl}api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.$swal.fire({
            icon: "success",
            title: "Supprimé !",
            showConfirmButton: false,
            timer: 2000,
          });
          await this.getPersonnel(); // ✅ plus de window.location.reload()
        } catch (error) {
          console.error(error);
          this.$swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Erreur lors de la suppression.",
          });
        }
      }
    },

    copyPassword() {
      if (this.generatedPassword) {
        navigator.clipboard.writeText(this.generatedPassword).then(() => {
          this.$swal.fire({
            icon: "success",
            title: "Copié !",
            showConfirmButton: false,
            timer: 1000,
          });
        });
      }
    },

    resetForm() {
      this.personnelForm = {
        first_name: "",
        last_name: "",
        role_id: "",
        phone_number: "",
        gender: "",
        age: "",
        adress: "",
        password: "",
        picture: null,
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
