<template>
  <div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Détails des Paiements Journalier</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">
                Paiements Journalier
              </li>
            </ol>
          </nav>
        </div>
        <div class="col-auto py-1">
                            <div class="btn-group" role="group" aria-label="Basic example">
                             <div class="btn btn-link active d-flex align-items-center position-relative"
                                  @click="$refs.hiddenDate.click()">
                                <i data-feather="calendar" class="me-1"></i>
                                <span>{{ selectedDate || 'Choisir une date' }}</span>

                                <!-- input invisible -->
                                <input 
                                  type="date" 
                                  ref="hiddenDate" 
                                  class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                  v-model="selectedDate" 
                                  @change="fetchPayments(selectedDate)"
                                />
                              </div>
                                    <a href="clinic-schedule-cards.html" class="btn btn-link"><i data-feather="layers"
                                        class="me-0 me-md-1"></i> <span class="d-none d-xl-inline-block">Cards</span>
                                </a><a href="clinic-schedule-staff.html" class="btn btn-link"><i
                                        data-feather="user-check" class="me-0 me-md-1"></i> <span
                                        class="d-none d-xl-inline-block">Staff</span></a></div>
                        </div>
                        <div class="col-auto py-1"><a href="clinic-add-appointment.html" class="btn btn-theme"><i
                                    data-feather="plus" class="me-0 me-md-1"></i> <span
                                    class="d-none d-md-inline-block">Appointment</span></a></div>
                        <div class="col-auto py-1 ms-auto ms-sm-0"><button class="btn btn-link btn-square btn-icon"
                                data-bs-toggle="collapse" data-bs-target="#filterschedule" aria-expanded="false"
                                aria-controls="filterschedule"><i data-feather="filter"></i></button></div>
      </div>
    </div>

    <br />

    <div class="row">
      
      <div class="col-12">
        <div class="card adminuiux-card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <p class="h6 mb-0">Détails des Paiements</p>
              <small class="text-muted" v-if="selectedDate">
                Paiements du {{ formatDate(selectedDate) }}
              </small>
            </div>
            <span class="badge bg-primary" v-if="selectedDate">
              {{ payments.length }} paiement(s) trouvé(s)
            </span>
          </div>
          <div class="card-body px-2">
            <div class="table-responsive">
              <table class="table table-hover table-sm" id="myTable">
                <thead class="table-light">
                  <tr>
                    <th>#</th>
                    <th>Code</th>
                    <th>Montant</th>
                    <th>Patient</th>
                    <th>Personnel</th>
                    <th>Service</th>
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
                      <span class="badge bg-secondary small">{{ pay.code }}</span>
                    </td>
                    <td class="fw-bold text-success">{{ formatAmount(pay.verser) }}</td>
                    <td>
                      <div v-if="pay.patient">
                        <strong class="small">{{ pay.patient.first_name }} {{ pay.patient.last_name }}</strong>
                        <br>
                        <small class="text-muted">{{ pay.patient.phone }}</small>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div v-if="pay.user">
                        <strong class="small">{{ pay.user.first_name }} {{ pay.user.last_name }}</strong>
                        <br>
                        <small class="text-muted">{{ pay.user.role_id === 1 ? 'Admin' : 'User' }}</small>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span class="badge bg-info text-dark small">{{ pay.motif || pay.service?.libelle || '-' }}</span>
                    </td>
                    <td>
                      <small>{{ formatDateTime(pay.created_at) }}</small>
                    </td>
                    <td>
                      <span class="badge small" :class="getStatusBadgeClass(pay.etatCaisse)">
                        {{ getStatusText(pay.etatCaisse) }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="payments.length === 0">
                    <td colspan="8" class="text-center py-4">
                      <div class="text-muted">
                        <i class="bi bi-calendar-x fs-3"></i>
                        <p class="mt-2">Aucun paiement trouvé</p>
                        <small>Sélectionnez une date</small>
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
 
let table = new DataTable('#myTable', {
    responsive: true
});

export default {
  name: "ProfilePage",
  setup() {
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
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements:", error);
        payments.value = [];
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatAmount = (amount) => {
      return new Intl.NumberFormat("fr-FR").format(amount);
    };

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case "attente":
          return "bg-warning";
        case "validé":
          return "bg-success";
        case "annulé":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case "attente":
          return "En attente";
        case "validé":
          return "Validé";
        case "annulé":
          return "Annulé";
        default:
          return status;
      }
    };

    const showPaymentDetails = (payment) => {
      console.log("Détails du paiement:", payment);
    };

    const totalAmount = computed(() =>
      payments.value.reduce(
        (sum, pay) => sum + Number(pay.verser || pay.amount || pay.total || 0),
        0
      )
    );

   onMounted(async () => {
  const today = new Date().toISOString().split("T")[0];
  selectedDate.value = today;
  await fetchPayments(today);

  // Attendre que le DOM soit mis à jour
  await nextTick();

  new DataTable("#myTable", {
    responsive: true,
    pageLength: 5,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json"
    }
  });
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
      showPaymentDetails,
      fetchPayments,
    };
  },
};
</script>
