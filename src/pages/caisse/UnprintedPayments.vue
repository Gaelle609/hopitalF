<template>
  <div class="container mt-3">
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
              <li class="breadcrumb-item bi">Paiements non imprimés</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
    <br>
    
    <div class="card shadow-sm" v-if="paiements.length > 0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table id="dataTable" class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-3">Code</th>
                <th>Patient</th>
                <th>Médicaments</th>
                <th>Total</th>
                <th>Date</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in paiements" :key="p.id">
                <td class="px-3 fw-bold text-primary">{{ p.code }}</td>
                <td>{{ p.patient.nom || '-' }}</td>
                <td>
                  <ul class="mb-0 ps-3">
                    <li v-for="m in p.details" :key="m.medicament" class="small">
                      {{ m.medicament }} <span class="text-muted">({{ m.total }} FCFA)</span>
                    </li>
                  </ul>
                </td>
                <td class="fw-bold">{{ p.total }} FCFA</td>
                <td class="small">{{ new Date(p.created_at).toLocaleString('fr-FR') }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-success" @click="imprimer(p)">
                     <i class="bi bi-printer"></i> Imprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="paiements.length === 0" class="alert alert-info text-center">
      <i class="bi bi-info-circle me-2"></i>Aucun paiement à imprimer.
    </div>

    <!-- TEMPLATE DU REÇU -->
    <div id="receipt" class="card border-0 p-3" v-if="selectedPaiement" style="display: none;">
      <!-- En-tête compact -->
      <div class="d-flex justify-content-between align-items-start mb-5">
        <div class="d-flex align-items-center receipt-content">
          <img id="logo" src="../../assets/img/logo2-removebg-preview.png" alt="Logo" />
          <div class="ms-2">
            <p class="mb-0 fw-bold receipt-text">Centre de santé La Patience</p>
            <p class="mb-0 receipt-text-xs">Situé près de la mosquée au carrefour caisse</p>
            <p class="mb-0 receipt-text-xs">Contact: +237699637173</p>
          </div>
        </div>

        <div class="text-end">
          <p class="mb-0 receipt-text"><b>Reçu N° :</b> {{ selectedPaiement.code }}</p>
          <p class="mb-0 receipt-text-xs">{{ new Date(selectedPaiement.created_at).toLocaleString('fr-FR') }}</p>
        </div>
      </div>

      <div class="text-center bg-light py-1 mb-2">
        <h4 class="mb-0 fw-bold text-decoration-underline text-muted">REÇU DE PAIEMENT</h4>
      </div>

      <div class="receipt-body text-muted">
        <!-- Infos patient en ligne -->
        <div class="d-flex justify-content-between mb-2 receipt-info">
          <div>
            <span class="fw-bold">Patient:</span> {{ selectedPaiement.patient?.nom }}
          </div>
            <div>
              <span class="fw-bold">Mode:</span> Espèces 
          </div>
          <div>
           <span class="fw-bold" :class="{ 'text-danger': selectedPaiement.reste > 0 }">Reste:</span> 
            <span :class="{ 'text-danger fw-bold': selectedPaiement.reste > 0 }">
              {{ selectedPaiement.reste || 0 }} FCFA
            </span>
          </div>
        </div>

        <!-- Tableau des médicaments optimisé -->
        <div class="table-wrapper">
          <table class="table table-bordered table-sm mb-2">
            <thead class="table-light">
              <tr>
                <th class="text-muted text-center" style="width: 5%;">N°</th>
                <th class="text-muted" style="width: 50%;">Médicament</th>
                <th class="text-muted text-center" style="width: 12%;">Qté</th>
                <th class="text-muted text-end" style="width: 16%;">P.U.</th>
                <th class="text-muted text-end" style="width: 17%;">Total</th>
              </tr>
            </thead>
            <tbody class="receipt-table-body">
              <tr v-for="(m, index) in selectedPaiement.details" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="receipt-med-name">{{ m.medicament }}</td>
                <td class="text-center">{{ m.quantite || 1 }}</td>
                <td class="text-end">{{ m.prix_unitaire || m.total }}</td>
                <td class="text-end fw-bold">{{ m.total }}</td>
              </tr>
            </tbody>
            <tfoot class="table-light">
              <tr>
                <td colspan="4" class="text-end fw-bold text-muted">TOTAL GÉNÉRAL</td>
                <td class="text-end fw-bold fs-6">{{ selectedPaiement.total }} FCFA</td>
              </tr>
              <tr v-if="selectedPaiement.verser">
                <td colspan="4" class="text-end text-muted">Montant versé</td>
                <td class="text-end">{{ selectedPaiement.verser }} FCFA</td>
              </tr>
              <tr v-if="selectedPaiement.reste > 0">
                <td colspan="4" class="text-end fw-bold text-danger">Reste à payer</td>
                <td class="text-end fw-bold text-danger">{{ selectedPaiement.reste }} FCFA</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-end mt-2">
          <div class="receipt-text-xs">
            <p class="mb-0">Merci pour votre confiance</p>
            <p class="mb-0 fst-italic">Centre de santé La Patience</p>
          </div>
          <div class="text-end">
            <p class="mb-0 receipt-text-xs">Signature personnel</p>
            <p class="fw-bold mb-0">{{ personnelName }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import html2pdf from "html2pdf.js";

export default {
  data() {
    return {
      paiements: [],
      selectedPaiement: null,
      personnelName: "",
    };
  },
  async created() {
    await this.loadPaiements();
    await this.loadPersonnel();
  },
  methods: {
    async loadPaiements() {
      const token = localStorage.getItem("current_token");
      const res = await axios.get("http://127.0.0.1:8000/api/non-imprimes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.paiements = res.data.data;
    },

    async loadPersonnel() {
      const user = JSON.parse(localStorage.getItem("current_user"));
      if (!user?.id) return;
      const token = localStorage.getItem("current_token");
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const personnel = res.data.data.user;
        this.personnelName = personnel.first_name + " " + personnel.last_name;
      } catch (e) {
        console.error("Erreur chargement personnel", e);
      }
    },

    async imprimer(paiement) {
      this.selectedPaiement = paiement;

      // délai pour que le DOM du reçu se charge
      await this.$nextTick();

      const element = document.getElementById("receipt");
      element.style.display = "block";

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `recu_${paiement.code}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: "mm", format: "a5", orientation: "landscape" },
      };

      await html2pdf().set(opt).from(element).save();

      element.style.display = "none";

      // ✅ Marquer comme imprimé
      const token = localStorage.getItem("current_token");
      await axios.post(
        `http://127.0.0.1:8000/api/imprimer/${paiement.code}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Supprimer localement
      this.paiements = this.paiements.filter((p) => p.id !== paiement.id);
      this.selectedPaiement = null;
    },
  },
};
</script>

<style scoped>
#logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-right: -20px;
}

.receipt-content {
  font-size: 0.9rem;
  margin-left: -30px;
  margin-bottom: -50px;
}

#receipt {
  width: 210mm;
  min-height: 148mm;
  background: #fff;
  color: #000;
  font-family: 'Courier New', monospace;
}

#receipt .table {
  font-size: 0.9rem;
  color: #000;
}

#receipt .table th,
#receipt .table td {
  padding: 0.5rem;
  border-color: #999;
}

.receipt-body p {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

@media print {
  body * {
    visibility: hidden;
  }
  #receipt,
  #receipt * {
    visibility: visible;
  }
  #receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    display: block !important;
  }
}
</style>