<template>

    <div class="container-fluid mt-3">
                <div class="bg-theme-1-subtle rounded px-3 py-3">
                    <div class="row gx-3 align-items-center">
                        <div class="col-12 col-md mb-2 mb-sm-0">
                            <p class="h5">Paiement de service</p>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb mb-0">
                                    <li class="breadcrumb-item bi"><router-link :to="{ name: 'HomePage' }">Accueil</router-link></li>
                                    <li class="breadcrumb-item active bi" aria-current="page">Caisse</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <br>
     <div class="row">
                    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
                        <div class="card adminuiux-card">
                            <div class="card-body">
                                <div class="row align-items-center mb-3">
                                    <div class="col-auto">
                                        <div
                                            class="avatar avatar-50 text-center rounded bg-success-subtle text-success-emphasis">
                                            <i class="bi bi-cash-stack fs-4"></i></div>
                                    </div>
                                    <div class="col px-0">
                                        <p class="h4 mb-0">{{recette}}</p>
                                        <p class="text-secondary small">Caisse Des soins: <span class="text-success">{{recettel}}
                                                <i class="bi bi-arrow-up"></i></span></p>
                                    </div>
                                </div>
                                <div class="progress height-dynamic mb-3" role="progressbar"
                                    aria-label="Success example" aria-valuenow="25" aria-valuemin="0"
                                    aria-valuemax="100" style="--h-dynamic: 5px">
                                    <div class="progress-bar bg-success" style="width: 68%"></div>
                                </div>
                                <p class="text-secondary small"> Voici le total de paiement journalier pour les soins.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
                        <div class="card adminuiux-card">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center mb-3">
                                    <div class="col-auto">
                                        <div
                                            class="avatar avatar-50 text-center rounded bg-info-subtle text-info-emphasis">
                                            <i class="bi bi-hospital fs-4"></i></div>
                                    </div>
                                    <div class="col">
                                        <p class="h4 mb-0">$ 980.00</p>
                                        <p class="text-secondary small">Caisse Des Medicaments</p>
                                    </div>
                                </div>
                                <div class="progress height-dynamic mb-3" role="progressbar"
                                    aria-label="Success example" aria-valuenow="25" aria-valuemin="0"
                                    aria-valuemax="100" style="--h-dynamic: 5px">
                                    <div class="progress-bar bg-info" style="width: 90%"></div>
                                </div>
                                <p class="text-secondary small">Rental and Cleaning Expense<br><span
                                        class="text-danger">$ 358.00 </span>overdue</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
                        <div class="card adminuiux-card h-100">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center mb-3">
                                    <div class="col-auto">
                                        <div
                                            class="avatar avatar-50 text-center rounded bg-warning-subtle text-warning-emphasis">
                                            <i class="bi bi-bank fs-4"></i></div>
                                    </div>
                                    <div class="col">
                                        <p class="h4 mb-0">$ 645.00</p>
                                        <p class="text-secondary small">Caisse Des Examens</p>
                                    </div>
                                </div>
                                <div class="row gx-3 align-items-center mb-3">
                                    <div class="col">
                                        <div class="progress height-dynamic" role="progressbar"
                                            aria-label="Success example" aria-valuenow="25" aria-valuemin="0"
                                            aria-valuemax="100" style="--h-dynamic: 5px">
                                            <div class="progress-bar bg-warning" style="width: 30%"></div>
                                        </div>
                                    </div>
                                    <div class="col-6 text-end">
                                        <p class="text-secondary small">30% Approved</p>
                                    </div>
                                </div>
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <div class="progress height-dynamic" role="progressbar"
                                            aria-label="Success example" aria-valuenow="25" aria-valuemin="0"
                                            aria-valuemax="100" style="--h-dynamic: 5px">
                                            <div class="progress-bar bg-warning" style="width: 60%"></div>
                                        </div>
                                    </div>
                                    <div class="col-6 text-end">
                                        <p class="text-secondary small">60% Released</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 col-xxl-3 mb-4">
                        <div class="card adminuiux-card">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center mb-3">
                                    <div class="col-auto">
                                        <div
                                            class="avatar avatar-50 text-center rounded bg-primary-subtle text-primary-emphasis">
                                            <i class="bi bi-calendar-week fs-4"></i></div>
                                    </div>
                                    <div class="col">
                                        <p class="h4 mb-0">$ 820.00</p>
                                        <p class="text-secondary small">Paid Invoices</p>
                                    </div>
                                </div>
                                <div class="progress height-dynamic mb-3" role="progressbar"
                                    aria-label="Success example" aria-valuenow="25" aria-valuemin="0"
                                    aria-valuemax="100" style="--h-dynamic: 5px">
                                    <div class="progress-bar bg-primary" style="width: 90%"></div>
                                </div>
                                <p class="text-secondary small">Patient Invoices amount<br><span class="text-primary">$
                                        418.00</span> Pending</p>
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
      recette: 0,
      recettel: "",
    };
  },
  mounted() {
    this.loadRecette();
     
  },
  methods: {

   async loadRecette() {
      const token = localStorage.getItem("current_token");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/caisses/recette`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const montant = response.data.data.recette;
    console.log("Montant brut reçu:", montant.montant_lettre);
    // formatage en nombre français + ajout FCFA
    this.recette = `${Number(montant.montant).toLocaleString('fr-FR')} FCFA`;
    this.recettel = montant.montant_lettre;

      console.log("Détails du paiement:", this.recette);
    },


  }
};
</script>