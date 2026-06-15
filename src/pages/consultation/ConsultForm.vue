<template>
  <div>
    <!-- Main Content -->
    <div class="container-fluid mt-3">
      <div class="bg-theme-1-subtle rounded px-3 py-3">
        <div class="row gx-3 align-items-center">
          <div class="col-12 col-md mb-2 mb-sm-0">
            <p class="h5">Consultation du Patient</p>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'HomePage' }">Accueil</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'ListConsultations' }">Liste Consultations</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Consultation
                </li>
              </ol>
            </nav>
          </div>
          <div class="col-md text-end">
            <router-link
              :to="{ name: 'ListConsultations' }"
              class="btn btn-secondary"
            >
              <i class="bi bi-arrow-left me-1"></i> Retour
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <br />

    <!-- Loader -->
    <div v-if="loading" class="container-fluid">
      <div class="text-center py-5">
        <div class="spinner-border text-theme" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div v-else-if="!loading && patient" class="container-fluid">
      <!-- Stepper Navigation -->
      <div class="stepper-wrapper mb-4">
        <div class="stepper">
          <div
            v-for="(step, index) in steps"
            :key="index"
            :class="['step', { 'active': currentStep === index, 'completed': currentStep > index }]"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-title">{{ step.title }}</div>
            <div class="step-description">{{ step.description }}</div>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="row">
        <!-- Informations du Patient (toujours visible) -->
        <div class="col-md-4">
          <div class="card adminuiux-card mb-4 sticky-top" style="top: 20px;">
            <div class="card-header">
              <p class="h6 mb-0">
                <i class="bi bi-person me-2"></i>Informations du Patient
              </p>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-12">
                  <p class="text-muted small mb-1">Nom Complet</p>
                  <p class="fw-medium">{{ patient.first_name || 'N/A' }} {{ patient.last_name || 'N/A' }}</p>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12">
                  <p class="text-muted small mb-1">Code Patient</p>
                  <p class="fw-medium">
                    <span class="badge bg-theme">{{ patient.slug || 'N/A' }}</span>
                  </p>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12">
                  <p class="text-muted small mb-1">Sexe</p>
                  <p class="fw-medium">
                    <span
                      :class="[
                        'badge',
                        patient.gender === 'Masculin'
                          ? 'bg-primary'
                          : 'bg-pink',
                      ]"
                    >
                      {{ patient.gender === 'Masculin' ? 'Masculin' : 'Féminin' }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12">
                  <p class="text-muted small mb-1">Téléphone</p>
                  <p class="fw-medium">{{ patient.phone || 'N/A' }}</p>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <p class="text-muted small mb-1">Date d'inscription</p>
                  <p class="fw-medium">
                    {{ formatDate(patient.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Signes Vitaux du Patient -->
          <div class="card adminuiux-card mb-4">
            <div class="card-header">
              <p class="h6 mb-0">
                <i class="bi bi-heart-pulse me-2"></i>Signes Vitaux
              </p>
              <small class="text-muted" v-if="lastConsultation">
                Dernière consultation: {{ formatDate(lastConsultation.created_at) }}
              </small>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-6">
                  <p class="text-muted small mb-1">Température</p>
                  <p class="fw-medium">
                    <span class="badge bg-info">{{ patient.temperature || 'N/A' }} °C</span>
                  </p>
                </div>
                <div class="col-6">
                  <p class="text-muted small mb-1">Poids</p>
                  <p class="fw-medium">
                    <span class="badge bg-success">{{ patient.weight || patient.poids || 'N/A' }} kg</span>
                  </p>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12">
                  <p class="text-muted small mb-1">Tension</p>
                  <p class="fw-medium">
                    <span class="badge bg-warning">{{ patient.tension || 'N/A' }}</span>
                  </p>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12">
                  <p class="text-muted small mb-1">Signes Vitaux</p>
                  <p class="fw-medium">{{ patient.signe || 'Aucun signe particulier' }}</p>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <p class="text-muted small mb-1">Personnel Responsable</p>
                  <p class="fw-medium">
                    <span class="badge bg-primary">{{ getPersonnelName() || 'Non assigné' }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dernière Consultation -->
          <div v-if="lastConsultation" class="card adminuiux-card mb-4">
            <div class="card-header">
              <p class="h6 mb-0">
                <i class="bi bi-clock-history me-2"></i>Dernière Consultation
              </p>
            </div>
            <div class="card-body">
              <div class="row mb-2">
                <div class="col-12">
                  <p class="text-muted small mb-1">Diagnostic</p>
                  <p class="fw-medium small">{{ lastConsultation.diagnostique || 'Non spécifié' }}</p>
                </div>
              </div>

              <div class="row mb-2">
                <div class="col-12">
                  <p class="text-muted small mb-1">Symptômes</p>
                  <p class="fw-medium small">{{ lastConsultation.symptome || 'Non spécifié' }}</p>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <p class="text-muted small mb-1">Statut</p>
                  <p class="fw-medium">
                    <span :class="['badge', lastConsultation.statut === 'Activer' ? 'bg-success' : 'bg-secondary']">
                      {{ lastConsultation.statut === 'Activer' ? 'Active' : 'Inactive' }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire en Étapes -->
        <div class="col-md-8">
          <!-- Étape 1: Symptômes et Diagnostic -->
          <div v-if="currentStep === 0" class="card adminuiux-card mb-4">
            <div class="card-header">
              <p class="h6 mb-0">
                <i class="bi bi-clipboard-check me-2"></i>Symptômes et Diagnostic
              </p>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">Symptômes <span class="text-danger">*</span></label>
                  <textarea
                    v-model="consultation.symptome"
                    class="form-control"
                    rows="4"
                    placeholder="Décrivez les symptômes du patient..."
                    :class="{ 'is-invalid': errors.symptome }"
                  ></textarea>
                  <div class="invalid-feedback" v-if="errors.symptome">
                    {{ errors.symptome }}
                  </div>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">Motif de Consultation</label>
                  <textarea
                    v-model="consultation.motif"
                    class="form-control"
                    rows="3"
                    placeholder="Motif de la consultation..."
                  ></textarea>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">Diagnostic</label>
                  <textarea
                    v-model="consultation.diagnostique"
                    class="form-control"
                    rows="3"
                    placeholder="Diagnostic préliminaire..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 2: Antécédents Médicaux -->
          <div v-if="currentStep === 1" class="card adminuiux-card mb-4">
            <div class="card-header">
              <p class="h6 mb-0">
                <i class="bi bi-file-medical me-2"></i>Antécédents Médicaux
              </p>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">Antécédents Médicaux</label>
                  <textarea
                    v-model="consultation.antecedant"
                    class="form-control"
                    rows="4"
                    placeholder="Antécédents médicaux, chirurgicaux, familiaux..."
                  ></textarea>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">Automédication</label>
                  <textarea
                    v-model="consultation.authomedication"
                    class="form-control"
                    rows="3"
                    placeholder="Médicaments pris par le patient sans prescription..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 3: Informations Obstétriques -->
          <div v-if="currentStep === 2" class="card adminuiux-card mb-4">
            <div class="card-header">
              <p class="h6 mb-0">
                <i class="bi bi-person-heart me-2"></i>Informations Obstétriques
              </p>
              <small class="text-muted">À remplir uniquement si applicable</small>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Date de Grossesse</label>
                  <input
                    v-model="consultation.dategross"
                    type="date"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Règles</label>
                  <input
                    v-model="consultation.regle"
                    type="text"
                    class="form-control"
                    placeholder="Dernières règles"
                  />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Date d'Accouchement</label>
                  <input
                    v-model="consultation.dateAcouch"
                    type="date"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Lieu d'Accouchement</label>
                  <input
                    v-model="consultation.lieuAcouch"
                    type="text"
                    class="form-control"
                    placeholder="Hôpital, domicile..."
                  />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">État de l'Accouchement</label>
                  <select v-model="consultation.etatAcouch" class="form-select">
                    <option value="">Sélectionner</option>
                    <option value="Normal">Normal</option>
                    <option value="Césarienne">Césarienne</option>
                    <option value="Complications">Complications</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Test VIH</label>
                  <select v-model="consultation.testVih" class="form-select">
                    <option value="">Sélectionner</option>
                    <option value="Positif">Positif</option>
                    <option value="Négatif">Négatif</option>
                    <option value="Non testé">Non testé</option>
                  </select>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Vaccins Reçus</label>
                  <input
                    v-model="consultation.vaccinRecu"
                    type="text"
                    class="form-control"
                    placeholder="Liste des vaccins"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Hémoglobine</label>
                  <input
                    v-model="consultation.haemo"
                    type="text"
                    class="form-control"
                    placeholder="Taux d'hémoglobine"
                  />
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">TPI</label>
                  <input
                    v-model="consultation.tpi"
                    type="text"
                    class="form-control"
                    placeholder="Traitement Préventif Intermittent"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Parité d'Accouchement</label>
                  <input
                    v-model="consultation.paccouche"
                    type="text"
                    class="form-control"
                    placeholder="Gesta/Para"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 4: Examens et Rendez-vous -->
          <div v-if="currentStep === 3" class="card adminuiux-card mb-4">
            <div class="card-header">
              <p class="h6 mb-0">
                <i class="bi bi-calendar-check me-2"></i>Examens et Rendez-vous
              </p>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">Examens Recommandés</label>
                  <textarea
                    v-model="consultation.examenRecom"
                    class="form-control"
                    rows="3"
                    placeholder="Examens biologiques, radiologiques, etc..."
                  ></textarea>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">Date de Rendez-vous</label>
                  <input
                    v-model="consultation.dateRDV"
                    type="datetime-local"
                    class="form-control"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Nombre de Jours d'Hospitalisation</label>
                  <input
                    v-model="consultation.nombreJourHosp"
                    type="number"
                    class="form-control"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <!-- <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">Statut</label>
                  <select v-model="consultation.statut" class="form-select">
                    <option value="Activer">Activer</option>
                    <option value="Desactiver">Désactiver</option>
                  </select>
                </div>
              </div> -->
            </div>
          </div>

          <!-- Navigation des Étapes -->
          <div class="card adminuiux-card">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <button
                  @click="previousStep"
                  :disabled="currentStep === 0"
                  class="btn btn-outline-secondary"
                >
                  <i class="bi bi-arrow-left me-1"></i> Précédent
                </button>

                <div class="step-indicator">
                  Étape {{ currentStep + 1 }} sur {{ steps.length }}
                </div>

                <button
                  v-if="currentStep < steps.length - 1"
                  @click="nextStep"
                  class="btn btn-theme"
                >
                  Suivant <i class="bi bi-arrow-right ms-1"></i>
                </button>

                <button
                  v-else
                  @click="submitConsultation"
                  :disabled="submitting"
                  class="btn btn-success"
                >
                  <i
                    v-if="submitting"
                    class="bi bi-hourglass-split me-2"
                  ></i>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ submitting ? 'Enregistrement...' : 'Terminer la Consultation' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Vide -->
    <div v-else class="container-fluid">
      <div class="alert alert-warning" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Patient non trouvé. Veuillez sélectionner un patient valide.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ConsultForm',

  data() {
    return {
      baseUrl: 'http://127.0.0.1:8000/',
      patient: null,
      lastConsultation: null,
      loading: false,
      submitting: false,
      currentStep: 0,
      errors: {},
      steps: [
        {
          title: 'Symptômes',
          description: 'Diagnostic et symptômes'
        },
        {
          title: 'Antécédents',
          description: 'Historique médical'
        },
        {
          title: 'Obstétrique',
          description: 'Informations grossesse'
        },
        {
          title: 'Examens',
          description: 'Rendez-vous et examens'
        }
      ],
      consultation: {
        patient_id: '',
        symptome: '',
        diagnostique: '',
        motif: '',
        antecedant: '',
        authomedication: '',
        examenRecom: '',
        dateAcouch: '',
        lieuAcouch: '',
        testVih: '',
        etatAcouch: '',
        signe: '',
        vaccinRecu: '',
        dategross: '',
        regle: '',
        paccouche: '',
        haemo: '',
        tpi: '',
        dateRDV: '',
        nombreJourHosp: ''
      }
    };
  },

  computed: {
    patientId() {
      return this.$route.params.patientId;
    },
  },

  mounted() {
    this.loadPatient();
  },

  methods: {
   async loadPatient() {
  this.loading = true;

  try {
    const token = localStorage.getItem("current_token");
    const patientId = this.$route.params.patientId; // ← utiliser le param de route

    if (!patientId) {
      this.$swal.fire({
        icon: "warning",
        title: "Patient non trouvé",
        text: "Aucun patient sélectionné. Veuillez recommencer."
      });
      this.$router.push("/patient/parameter");
      return;
    }

    // Même endpoint que ConsultationPatient
    const response = await axios.get(
      `${this.baseUrl}api/pat/${patientId}/params`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = response.data.data.patient;

    // Remplir les infos patient
    this.patient = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      gender: data.gender,
      slug: data.slug,
      created_at: data.created_at,
      temperature: data.parametre?.[0]?.temperature ?? null,
      poids: data.parametre?.[0]?.poids ?? null,
      tension: data.parametre?.[0]?.tension ?? null,
      signe: data.parametre?.[0]?.autre ?? null,
    };

    // Pré-remplir le formulaire avec l'id patient
    this.consultation.patient_id = data.id;

    // Récupérer la dernière consultation si elle existe
    if (data.consultation && data.consultation.length > 0) {
      this.lastConsultation = data.consultation[0];
    }

  } catch (error) {
    console.error(error);
    this.$swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Impossible de charger les données du patient."
    });
  } finally {
    this.loading = false;
  }
},

    async loadPersonnel() {
      try {
        const token = localStorage.getItem('current_token');
        const response = await axios.get(
          `${this.baseUrl}api/personnels`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.personnelList = response.data.data || [];
      } catch (error) {
        console.error('Erreur lors du chargement du personnel:', error);
      }
    },

    nextStep() {
      if (this.validateCurrentStep()) {
        if (this.currentStep < this.steps.length - 1) {
          this.currentStep++;
        }
      }
    },

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },

    validateCurrentStep() {
      this.errors = {};
      let isValid = true;

      switch (this.currentStep) {
        case 0: // Symptômes et Diagnostic
          if (!this.consultation.symptome) {
            this.errors.symptome = 'Les symptômes sont requis';
            isValid = false;
          }
          break;
      }

      if (!isValid) {
        this.$swal.fire({
          icon: 'warning',
          title: 'Validation',
          text: 'Veuillez remplir tous les champs requis avant de continuer.',
        });
      }

      return isValid;
    },

    validateForm() {
      this.errors = {};
      let isValid = true;

      // Validation de base
      if (!this.consultation.patient_id) {
        this.errors.patient_id = 'Le patient est requis';
        isValid = false;
      }

      if (!this.consultation.symptome) {
        this.errors.symptome = 'Les symptômes sont requis';
        isValid = false;
      }

      return isValid;
    },

    async submitConsultation() {
  if (!this.validateForm()) {
    this.$swal.fire({
      icon: 'warning',
      title: 'Validation',
      text: 'Veuillez remplir tous les champs requis.',
    });
    return;
  }

  this.submitting = true;
  try {
    const token = localStorage.getItem('current_token');

    const payload = { ...this.consultation };

    Object.keys(payload).forEach(key => {
      if (payload[key] === '') payload[key] = null;
    });

    // POST pour créer une nouvelle consultation
    await axios.post(
      `${this.baseUrl}api/consultations`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    this.$swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Consultation enregistrée avec succès!'
    });

    this.$router.push('/consultation/list');

  } catch (error) {
    console.error(error);
    this.$swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.response?.data?.message || 'Erreur lors de l\'enregistrement.'
    });
  } finally {
    this.submitting = false;
  }
},

    formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },

    getPersonnelName() {
      // Chercher le nom du personnel depuis la dernière consultation
      if (this.lastConsultation && this.lastConsultation.personnel) {
        return this.lastConsultation.personnel.name ||
               `${this.lastConsultation.personnel.first_name} ${this.lastConsultation.personnel.last_name}`;
      }

      // Ou depuis les données du patient
      if (this.patient && this.patient.personnel) {
        return this.patient.personnel.name ||
               `${this.patient.personnel.first_name} ${this.patient.personnel.last_name}`;
      }

      return null;
    },
  },
};
</script>

<style scoped>
/* ===== GLOBAL ===== */

.container-fluid {
  max-width: 1400px;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.card-header {
  background: #f9fafc;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
}

.card-body {
  padding: 1.5rem;
}

/* ===== BADGES ===== */

.badge {
  font-size: 0.8rem;
  padding: 6px 10px;
  border-radius: 6px;
}

.bg-theme {
  background: rgb(59,105,255);
}

.bg-pink {
  background: #e83e8c;
}

/* ===== FORM ===== */

.form-label {
  font-weight: 500;
  color: #444;
}

.form-control,
.form-select {
  border-radius: 6px;
  border: 1px solid #ddd;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: rgb(59,105,255);
  box-shadow: 0 0 4px rgba(59,105,255,0.3);
}

textarea.form-control {
  resize: vertical;
}

/* ===== BUTTON ===== */

.btn-theme {
  background: rgb(59,105,255);
  color: white;
  border-radius: 6px;
}

.btn-theme:hover {
  background: rgb(45,90,240);
}

.btn-success {
  border-radius: 6px;
}

/* ===== STEPPER ===== */

.stepper-wrapper {
  margin-bottom: 35px;
}

.stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.stepper::before {
  content: "";
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 3px;
  background: #e5e7eb;
  z-index: 1;
}

.step {
  text-align: center;
  position: relative;
  flex: 1;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  font-weight: 600;
  color: #555;
  transition: 0.3s;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 6px;
}

.step-description {
  font-size: 0.75rem;
  color: #777;
}

/* STEP ACTIVE */

.step.active .step-number {
  background: rgb(59,105,255);
  color: white;
}

.step.active .step-title {
  color: rgb(59,105,255);
}

/* STEP COMPLETED */

.step.completed .step-number {
  background: #28a745;
  color: white;
}

.step.completed .step-number::after {
  content: "✓";
}

/* ===== STEP INDICATOR ===== */

.step-indicator {
  font-size: 14px;
  background: #f1f3f7;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  color: rgb(59,105,255);
}

/* ===== PATIENT CARD ===== */

.sticky-top {
  position: sticky;
  top: 20px;
}

/* ===== LOADER ===== */

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* ===== RESPONSIVE ===== */

@media (max-width: 992px) {

  .stepper {
    flex-direction: column;
    gap: 15px;
  }

  .stepper::before {
    display: none;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
  }

  .step-number {
    margin: 0;
  }
}
</style>
