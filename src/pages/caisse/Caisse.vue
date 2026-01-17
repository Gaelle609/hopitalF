<template>
  <div class="container-fluid mt-3">
    <div class="bg-theme-1-subtle rounded px-3 py-3">
      <div class="row gx-3 align-items-center">
        <div class="col-12 col-md mb-2 mb-sm-0">
          <p class="h5">Paiement de service</p>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item bi">
                <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
              </li>
              <li class="breadcrumb-item active bi" aria-current="page">Caisse</li>
            </ol>
          </nav>
        </div>

        <div class="col-md text-end">
          <button class="btn btn-theme" @click="$router.push({ name: 'PaidMedoc' })">
            <i class="bi bi-plus-lg me-1"></i>  <i class="bi bi-printer"></i>Imprimer
          </button>
        </div>

        <div class="col-md text-end">
          <div class="dropdown">
  <button
    class="btn btn-theme dropdown-toggle"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    <i class="bi bi-plus-lg me-1"></i> Nouveau Paiement
  </button>

  <ul class="dropdown-menu">
    <li>
      <a class="dropdown-item" @click="$router.push({ name: 'PayExam' })">
        Paiement Examen
      </a>
    </li>

    <li>
      <a class="dropdown-item" @click="$router.push({ name: 'PayMedoc' })">
        Paiement Médicament
      </a>
    </li>
  </ul>
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
                <div class="avatar avatar-50 text-center rounded bg-success-subtle text-success-emphasis">
                  <i class="bi bi-cash-stack fs-4"></i>
                </div>
              </div>
              <div class="col px-0">
                <p class="h4 mb-0">{{ recette }}</p>
                <router-link :to="{ name: 'ListPay' }">Voir</router-link>
                <p class="text-secondary small">
                  Caisse des soins :
                  <span class="text-success">
                    {{ recettel }}
                    <i class="bi bi-arrow-up"></i>
                  </span>
                </p>
              </div>
            </div>

            <div class="progress height-dynamic mb-3" style="--h-dynamic: 5px">
              <div
                class="progress-bar bg-success"
                role="progressbar"
                :style="{ width: `${progressSoins}%` }"
              ></div>
            </div>

            <p class="text-secondary small">
              {{ progressSoins.toFixed(1) }}% de l’objectif atteint.
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6 col-xxl-3 mb-4">
        <div class="card adminuiux-card">
          <div class="card-body">
            <div class="row gx-3 align-items-center mb-3">
              <div class="col-auto">
                <div class="avatar avatar-50 text-center rounded bg-info-subtle text-info-emphasis">
                  <i class="bi bi-hospital fs-4"></i>
                </div>
              </div>
              <div class="col">
                <p class="h4 mb-0">{{ recettemed }}</p>
                <router-link :to="{ name: 'ListPayMed' }">Voir</router-link>
                <p class="text-secondary small">
                  Caisse des médicaments
                  <span class="text-success">
                    {{ recettelmed }}
                    <i class="bi bi-arrow-up"></i>
                  </span>
                </p>
              </div>
            </div>

            <div class="progress height-dynamic mb-3" style="--h-dynamic: 5px">
              <div
                class="progress-bar bg-info"
                role="progressbar"
                :style="{ width: `${progressMed}%` }"
              ></div>
            </div>

            <p class="text-secondary small">
              {{ progressMed.toFixed(1) }}% de l’objectif atteint.
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6 col-xxl-3 mb-4"> 
        <div class="card adminuiux-card h-100"> 
            <div class="card-body"> 
                <div class="row gx-3 align-items-center mb-3"> 
                    <div class="col-auto"> 
                        <div class="avatar avatar-50 text-center rounded bg-warning-subtle text-warning-emphasis"> 
                            <i class="bi bi-bank fs-4"></i>
                        </div> 
                    </div> 
                    <div class="col"> 
                         <p class="h4 mb-0">{{ recettexam }}</p>
                <router-link :to="{ name: 'ListPayExam' }">Voir</router-link>
                        <p class="text-secondary small">Caisse Des Examens

                          <span class="text-success">
                    {{ recettelexam }}
                    <i class="bi bi-arrow-up"></i>
                  </span>
                        </p> 
                        
                    </div> 
                </div> 
                    <div class="progress height-dynamic mb-3" style="--h-dynamic: 5px">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                :style="{ width: `${progressExam}%` }"
              ></div>
            </div>

            <p class="text-secondary small">
              {{ progressSoins.toFixed(1) }}% de l’objectif atteint.
            </p>
                    </div> 
                </div> 
            </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recette: 0,
      recettemed: 0,
      recettexam: 0,
      recettel: "",
      recettelmed: "",
      recettelexam: "",
      objectifSoins: 100000, 
      objectifMed: 100000, 
      objectifExam: 100000, 
    };
  },
 computed: {
  progressSoins() {
    const montant =
      typeof this.recette === "string"
        ? parseFloat(this.recette.replace(/[^\d]/g, "")) || 0
        : Number(this.recette) || 0;

    return Math.min((montant / this.objectifSoins) * 100, 100);
  },

  progressMed() {
    const montant =
      typeof this.recettemed === "string"
        ? parseFloat(this.recettemed.replace(/[^\d]/g, "")) || 0
        : Number(this.recettemed) || 0;

    return Math.min((montant / this.objectifMed) * 100, 100);
  },

  progressExam() {
    const montant =
      typeof this.recettexam === "string"
        ? parseFloat(this.recettexam.replace(/[^\d]/g, "")) || 0
        : Number(this.recettexam) || 0;

    return Math.min((montant / this.objectifExam) * 100, 100);
  },
},

  mounted() {
    this.loadRecette();
    this.loadRecetteMed();
    this.loadRecetteExam();
  },
  methods: {
    async loadRecette() {
      const token = localStorage.getItem("current_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/caisses/recette`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const montant = response.data.data.recette;
      this.recette = `${Number(montant.montant).toLocaleString("fr-FR")} FCFA`;
      this.recettel = montant.montant_lettre;
    },

    async loadRecetteExam() {
      const token = localStorage.getItem("current_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/recettexam`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const montant = response.data.data.recette;
      this.recettexam = `${Number(montant.montant).toLocaleString("fr-FR")} FCFA`;
      this.recettelexam = montant.montant_lettre;
    },

    async loadRecetteMed() {
      const token = localStorage.getItem("current_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/recette`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const montant = response.data.data.recette;
      this.recettemed = `${Number(montant.montant).toLocaleString("fr-FR")} FCFA`;
      this.recettelmed = montant.montant_lettre;
    },
  },
};
</script>
