<template>
  <div class="container-fluid mt-4 px-4">
    <!-- HEADER -->
    <div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Détails du personnel</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'IndexPersonnel' }">Personnel</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">Détails</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
<br>
    <!-- INFOS UTILISATEUR -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header  border-bottom py-3 d-flex align-items-center gap-3">
        <!-- AVATAR -->
        <img
          :src="userImage"
          @error="onImageError"
          alt="Avatar"
          class="rounded-circle"
          style="width: 60px; height: 60px; object-fit: cover;"
        />

        <h5 class="mb-0 fw-semibold">
          Informations générales
        </h5>
      </div>

      <div class="card-body p-4">
        <div class="row g-4">
          <div class="col-md-3">
            <label class="text-muted small">Nom</label>
            <p class="fw-semibold mb-0">{{ user.first_name || 'N/A' }}</p>
          </div>

          <div class="col-md-3">
            <label class="text-muted small">Prénom</label>
            <p class="fw-semibold mb-0">{{ user.last_name || 'N/A' }}</p>
          </div>

          <div class="col-md-3">
            <label class="text-muted small">Statut</label>
            <p class="mb-0">
              <span class="badge bg-success-subtle text-success px-3 py-2">
                <i class="bi bi-check-circle me-1"></i>Actif
              </span>
            </p>
          </div>

          <div class="col-md-3">
            <label class="text-muted small">Créé le</label>
            <p class="fw-semibold mb-0">{{ formatDate(user.created_at) }}</p>
          </div>
        </div>

        <div class="row g-4 mt-2">
          <div class="col-md-3">
            <label class="text-muted small">Matricule</label>
            <p class="fw-semibold mb-0">{{ user.matricule || 'N/A' }}</p>
          </div>

          <div class="col-md-3">
            <label class="text-muted small">Adresse</label>
            <p class="fw-semibold mb-0">{{ user.adress || 'N/A' }}</p>
          </div>

          <div class="col-md-3">
            <label class="text-muted small">Téléphone</label>
            <p class="fw-semibold mb-0">{{ user.phone_number || 'N/A' }}</p>
          </div>

          <div class="col-md-3">
            <label class="text-muted small">Âge</label>
            <p class="fw-semibold mb-0">{{ user.age || 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ROLES & PERMISSIONS -->
    <div class="row g-4">
      <!-- ROLES -->
      <div class="col-lg-6">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header border-bottom py-3">
            <h5 class="fw-semibold mb-0">
              <i class="bi bi-briefcase me-2 text-primary"></i>
              Rôles
              <span class="badge bg-primary-subtle text-primary ms-2">
                {{ userRoles.length }}
              </span>
            </h5>
          </div>

          <div class="card-body p-4">
            <div
              v-for="role in roles"
              :key="role.id"
              class="d-flex justify-content-between align-items-center p-3 mb-2 rounded"
              :class="hasRole(role.id) ? 'bg-primary-subtle' : 'bg-light'"
            >
              <span class="fw-medium">{{ role.name }}</span>

              <button
                v-if="hasRole(role.id)"
                class="btn btn-sm btn-danger"
                @click="removeRole(role.id)"
              >
                <i class="bi bi-x-circle me-1"></i>Révoquer
              </button>

              <button
                v-else
                class="btn btn-sm btn-primary"
                @click="assignRole(role.id)"
              >
                <i class="bi bi-plus-circle me-1"></i>Attribuer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PERMISSIONS -->
      <div class="col-lg-6">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header  border-bottom py-3">
            <h5 class="fw-semibold mb-0">
              <i class="bi bi-key me-2 text-success"></i>
              Permissions
              <span class="badge bg-success-subtle text-success ms-2">
                {{ userPermissions.length }}
              </span>
            </h5>
          </div>

          <div class="card-body p-4">
            <div
              v-for="permission in permissions"
              :key="permission.id"
              class="d-flex justify-content-between align-items-center p-3 mb-2 rounded"
              :class="hasPermission(permission.id) ? 'bg-success-subtle' : 'bg-light'"
            >
              <span class="fw-medium">{{ permission.name }}</span>

              <button
                v-if="hasPermission(permission.id)"
                class="btn btn-sm btn-danger"
                @click="removePermission(permission.id)"
              >
                <i class="bi bi-x-circle me-1"></i>Révoquer
              </button>

              <button
                v-else
                class="btn btn-sm btn-success"
                @click="assignPermission(permission.id)"
              >
                <i class="bi bi-plus-circle me-1"></i>Attribuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import defaultAvatar from "@/assets/img/avatar.jpg";

export default {
  data() {
    return {
      userId: null,
      user: {},
      roles: [],
      permissions: [],
      userRoles: [],
      userPermissions: [],
      apiUrl: "http://127.0.0.1:8000/api/",
      serverUrl: "http://127.0.0.1:8000",
      defaultAvatar
    };
  },

  computed: {
    userImage() {
      if (!this.user.picture) return this.defaultAvatar;

      // Si l'URL commence par http ou https, on la retourne telle quelle
      if (/^https?:\/\//.test(this.user.picture)) return this.user.picture;

      // Sinon on ajoute serverUrl
      let cleanPath = this.user.picture.startsWith("/") ? this.user.picture : "/" + this.user.picture;

      console.log("Image URL générée:", this.serverUrl + cleanPath); // Debug
      return this.serverUrl + cleanPath;
    }
  },

  mounted() {
    this.userId = this.$route.query.personnelId;
    this.fetchUser();
    this.fetchRoles();
    this.fetchPermissions();
  },

  methods: {
    onImageError(e) {
      e.target.src = this.defaultAvatar;
    },

    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(dateString));
    },

    authHeader() {
      return {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("current_token")}`
        }
      };
    },

    fetchUser() {
      axios.get(`${this.apiUrl}users/${this.userId}`, this.authHeader())
        .then(res => {
      this.user = res.data.data.user;

      this.userRoles = this.user.roles || [];

      this.userPermissions = this.user.roles
        ? this.user.roles.flatMap(role => role.permissions)
        : [];

      this.userPermissions = [...this.userPermissions, ...(this.user.permissions || [])];

      
    })
        .catch(err => console.error(err));
    },

    fetchRoles() {
      axios.get(`${this.apiUrl}roles`, this.authHeader())
        .then(res => this.roles = res.data.data.roles)
        .catch(err => console.error(err));
    },

    fetchPermissions() {
      axios.get(`${this.apiUrl}permissions`, this.authHeader())
        .then(res => this.permissions = res.data.data.permissions)
        .catch(err => console.error(err));
    },

    

    hasRole(id) {
      return this.userRoles.some(r => r.id === id);
    },

    hasPermission(id) {
      return this.userPermissions.some(p => p.id === id);
    },

    assignRole(id) {
      axios.post(`${this.apiUrl}users/${this.userId}/assign_roles`, 
      { roles: [id] }, this.authHeader())
        .then(this.fetchUser());
    },

    removeRole(id) {
      axios.delete(`${this.apiUrl}users/${this.userId}/roles/${id}`, this.authHeader())
        .then(this.fetchUser());
    },

    assignPermission(id) {
        console.log("Permission envoyée:", id);

      axios.post(
        `${this.apiUrl}user/${this.userId}/permissions`,
        { permission: [id] }, 
        this.authHeader()
      )
      .then(() => {
        this.fetchUser();
      });
    },


    removePermission(id) {
      axios.delete(`${this.apiUrl}users/${this.userId}/permissions/${id}`, this.authHeader())
        .then(this.fetchUser());
    }
  }
};
</script>



<style scoped>
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  color: white;
}

.header-section h3 {
  color: white;
}

.header-section .text-muted {
  color: rgba(255, 255, 255, 0.9) !important;
}

.header-section .btn-outline-secondary {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}

.header-section .btn-outline-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

.info-block {
  padding: 0.5rem 0;
}

.role-item, .permission-item {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.role-item:hover, .permission-item:hover {
  transform: translateX(5px);
  border-color: rgba(0, 0, 0, 0.1);
}

.bg-primary-subtle {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-success-subtle {
  background-color: rgba(25, 135, 84, 0.1) !important;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 6px;
  font-weight: 500;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

</style>