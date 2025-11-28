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
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'Caisse' }">Caisse</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">
                Paiements Journalier
              </li>
            </ol>
          </nav>
        </div>

        <div class="col-auto py-1">
          <div
            class="btn btn-link active d-flex align-items-center position-relative"
            @click="$refs.hiddenDate.click()"
          >
            <i data-feather="calendar" class="me-1"></i>
            <span>{{ selectedDate || 'Choisir une date' }}</span>
            <input
              type="date"
              ref="hiddenDate"
              class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
              v-model="selectedDate"
              @change="fetchPayments(selectedDate)"
            />
          </div>
        </div>
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
              <table class="table table-hover table-sm" id="">
                <thead class="table-light">
                  <tr>
                    <th>#</th>
                    <th>Code</th>
                    <th>Montant total</th>
                    <th  data-breakpoints="xs">Patient</th>
                    <th>Personnel</th>
                    <th>Produits</th>
                    <th>Verser</th>
                    <th>reste</th>
                    <th>État</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(pay, index) in payments"
                    :key="pay.code"
                    class="clickable-row"
                    @click="showPaymentDetails(pay)"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>
                      <span class="badge bg-secondary small">{{ pay.code }}</span>
                    </td>
                    <td class="fw-bold text-success">
                      {{ formatAmount(pay.total) }} FCFA
                    </td>
                    <td>
                      <strong class="small">{{ pay.patient?.nom || '-' }}</strong>
                    </td>
                    <td>
                      <strong class="small">{{ pay.personnel || '-' }}</strong>
                    </td>
                   <td>
                      <ul v-if="pay.details && pay.details.length" class="mb-0 ps-3">
                        <li
                          v-for="(m, i) in pay.details"
                          :key="i"
                          class="small"
                        >
                          {{ m.medicament }} - {{ m.quantite }}
                        </li>
                      </ul>
                      <div v-else>-</div>
                    </td>
                    <td class="fw-bold text-success">
                      {{ formatAmount(pay.verser) }} FCFA
                    </td>
                    <td class="fw-bold text-success">
                      {{ formatAmount(pay.reste) }} FCFA
                    </td>
                    <td>
                      <span class="badge small" :class="getStatusBadgeClass(pay.status)">
                        {{ getStatusText(pay.status) }}
                      </span>
                    </td>
                    <td>
                      <small>{{ formatDateTime(pay.created_at) }}</small>
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
import { ref, computed, onMounted, nextTick } from "vue";
import axios from "axios";
import DataTable from "datatables.net-dt";
import "datatables.net-responsive-dt";

export default {
  name: "ListPayMed",
  setup() {
    const payments = ref([]);
    const selectedDate = ref("");

    const fetchPayments = async (date) => {
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/pay/date?date=${date}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Correction : accès direct au tableau
        payments.value = response.data.data.payment?.original?.data || [];
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
      return new Date(dateString).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
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
          return status || "-";
      }
    };

    const formatAmount = (amount) => {
      return new Intl.NumberFormat("fr-FR").format(amount);
    };

    const showPaymentDetails = (payment) => {
      console.log("Détails du paiement:", payment);
    };

    const totalAmount = computed(() =>
      payments.value.reduce((sum, pay) => sum + Number(pay.total || 0), 0)
    );

    onMounted(async () => {
      const today = new Date().toISOString().split("T")[0];
      selectedDate.value = today;
      await fetchPayments(today);
      await nextTick();

      new DataTable("#myTable", {
        responsive: true,
        pageLength: 5,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json",
        },
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
