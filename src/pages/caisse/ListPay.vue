<template>
  <div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Profile Utilisateurs</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">
                Profile
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <br />

    <div class="row">
     <div class="col-12 col-md-4">
  <div class="card adminuiux-card">
    <div class="card-header">
      <p class="h6 mb-0">Petit calendrier</p>
    </div>
    <div class="card-body p-2">
      <div id="calendar" ref="calendar"></div>
    </div>
  </div>
</div>

    
      <!-- <div class="row">
          <div class="col-12 col-sm-6 col-xl-12 mb-4">
              <p class="h6 mb-3">Select Date</p>
              <div class="inlinewrap1 inline-calendar mx-auto" id="calendar" ref="calendar"></div><input id="inlinewrap1"
                  class="d-none">
          </div>
          
      </div> -->
      <!-- Table des paiements -->
      <div class="col-12">
        <div class="card adminuiux-card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <p class="h6 mb-0">Détails des Paiements</p>
            <span class="badge bg-primary" v-if="selectedDate">
              {{ payments.length }} paiement(s) trouvé(s)
            </span>
          </div>
          <div class="card-body px-2">
            <div class="table-responsive">
              <table class="table table-hover" >
                <thead class="table-light">
                  <tr>
                    <th>#</th>
                    <th>Code Paiement</th>
                    <th>Montant (FCFA)</th>
                    <th>Patient</th>
                    <th>Personnel</th>
                    <th>Service/Motif</th>
                    <th>Date</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(pay, index) in payments" :key="pay.id" 
                      class="clickable-row"
                      @click="showPaymentDetails(pay)">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <span class="badge bg-secondary">{{ pay.code }}</span>
                    </td>
                    <td class="fw-bold text-success">{{ formatAmount(pay.verser) }}</td>
                    <td>
                      <div v-if="pay.patient">
                        <strong>{{ pay.patient.first_name }} {{ pay.patient.last_name }}</strong>
                        <br>
                        <small class="text-muted">Tel: {{ pay.patient.phone }}</small>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div v-if="pay.user">
                        <strong>{{ pay.user.first_name }} {{ pay.user.last_name }}</strong>
                        <br>
                        <small class="text-muted">{{ pay.user.role_id === 1 ? 'Admin' : 'Utilisateur' }}</small>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span class="badge bg-info text-dark">{{ pay.motif || pay.service?.libelle || '-' }}</span>
                    </td>
                    <td>
                      <small>{{ formatDateTime(pay.created_at) }}</small>
                    </td>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(pay.etatCaisse)">
                        {{ getStatusText(pay.etatCaisse) }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="payments.length === 0">
                    <td colspan="8" class="text-center py-4">
                      <div class="text-muted">
                        <i class="bi bi-calendar-x fs-1"></i>
                        <p class="mt-2">Aucun paiement trouvé pour cette date</p>
                        <small>Cliquez sur une date du calendrier pour voir les paiements</small>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="payments.length > 0" class="table-active">
                    <td colspan="2"><strong>Total</strong></td>
                    <td><strong class="text-primary">{{ formatAmount(totalAmount) }} FCFA</strong></td>
                    <td colspan="5"></td>
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
import { onMounted, ref, computed } from "vue";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default {
  name: "ProfilePage",
  setup() {
    const calendar = ref(null);
    const payments = ref([]);
    const selectedDate = ref("");

    const fetchPayments = async (date) => {
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/caisse/date?date=${date}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        payments.value = response.data.data.payment || [];
        selectedDate.value = date;
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements:", error);
        payments.value = [];
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('fr-FR').format(amount);
    };

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'attente': return 'bg-warning';
        case 'validé': return 'bg-success';
        case 'annulé': return 'bg-danger';
        default: return 'bg-secondary';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'attente': return 'En attente';
        case 'validé': return 'Validé';
        case 'annulé': return 'Annulé';
        default: return status;
      }
    };

    const showPaymentDetails = (payment) => {
      // Vous pouvez implémenter une modal ou autre pour afficher les détails
      console.log('Détails du paiement:', payment);
      // Exemple: this.$router.push({ name: 'PaymentDetails', params: { id: payment.id } });
    };

    // Calcul du total
    const totalAmount = computed(() =>
      payments.value.reduce((sum, pay) => sum + Number(pay.amount || pay.total || 0), 0)
    );

    onMounted(() => {
      const calendarEl = document.getElementById("calendar");

      if (calendarEl) {
       calendar.value = new Calendar(calendarEl, {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: "fr",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: ""
  },
  height: "auto",
  aspectRatio: 0, // 👈 plus petit
  contentHeight: 0, // 👈 limite la hauteur
  dateClick: (info) => {
    fetchPayments(info.dateStr);
    document.querySelectorAll('.fc-day').forEach(day => {
      day.classList.remove('fc-day-selected');
    });
    info.dayEl.classList.add('fc-day-selected');
  },
  datesSet: () => {
    // Réinitialiser la sélection quand on change de mois
    setTimeout(() => {
      document.querySelectorAll('.fc-day').forEach(day => {
        day.classList.remove('fc-day-selected');
      });
    }, 100);
  }
});

      calendar.value.render();
      
      // Afficher les paiements du jour par défaut
      const today = new Date().toISOString().split('T')[0];
      fetchPayments(today);
    }
  });

    return {
      payments,
      selectedDate,
      totalAmount,
      formatDate,
      formatDateTime,
      formatAmount,
      getStatusBadgeClass,
      getStatusText,
      showPaymentDetails
    };
  },
};
</script>

<style scoped>
#calendar {
  max-width: 400px;   /* largeur max */
  height: 300px;      /* hauteur réduite */
  margin: auto;
  font-size: 0.8rem;  /* texte plus petit */
}


/* Styles pour le calendrier */
:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-day-selected) {
  background-color: #e3f2fd !important;
  border: 2px solid #2196f3 !important;
}

:deep(.fc-day:hover) {
  background-color: #f5f5f5 !important;
  cursor: pointer;
}

:deep(.fc-toolbar) {
  flex-wrap: wrap;
}

:deep(.fc-header-toolbar) {
  margin-bottom: 1rem;
}

/* Styles pour la table */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-row:hover {
  background-color: #f8f9fa !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-responsive {
  border-radius: 0.375rem;
  overflow: hidden;
}

.badge {
  font-size: 0.75em;
}

/* Responsive */
@media (max-width: 768px) {
  :deep(.fc-toolbar) {
    flex-direction: column;
    align-items: flex-start;
  }
  
  :deep(.fc-toolbar-chunk) {
    margin-bottom: 0.5rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
}
</style>