<template>
  <div class="container mt-4">
    <h3>Formulaire de paiement</h3>
    
    <form @submit.prevent="submitPayment">
      <div class="mb-3">
        <label>Patient</label>
        <input type="text" class="form-control" :value="patientName" disabled />
      </div>

      <div class="mb-3">
        <label>Motif (Service)</label>
        <select class="form-control" v-model="payment.motif" @change="updatePrice">
          <option value="" disabled>Choisir un service</option>
          <option v-for="service in services" :key="service.id" :value="service.name">
            {{ service.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label>Total</label>
        <input type="number" class="form-control" v-model="payment.total" readonly />
      </div>

      <div class="mb-3">
        <label>Versé</label>
        <input type="number" class="form-control" v-model="payment.verser" @input="calculateReste" />
      </div>

      <div class="mb-3">
        <label>Reste</label>
        <input type="number" class="form-control" v-model="payment.reste" readonly />
      </div>

      <button type="submit" class="btn btn-theme">Valider</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      patient: {},
      patientName: "",
      services: [],
      payment: {
        motif: "",
        total: 0,
        verser: 0,
        reste: 0,
        patient_id: this.$route.params.patientId,
        id_per: 1 // l'utilisateur connecté
      }
    };
  },
  mounted() {
    this.loadPatient();
    this.loadServices();
  },
  methods: {
    async loadPatient() {
      const token = localStorage.getItem("current_token");
      const id = this.$route.params.patientId;
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.patient = response.data.data;
      this.patientName = this.patient.first_name + " " + this.patient.last_name;
    },
    async loadServices() {
      const token = localStorage.getItem("current_token");
      const response = await axios.get(`http://127.0.0.1:8000/api/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.services = response.data.data.services;
    },
    updatePrice() {
      const service = this.services.find(s => s.name === this.payment.motif);
      if (service) {
        this.payment.total = parseFloat(service.price);
        this.calculateReste();
      }
    },
    calculateReste() {
      this.payment.reste = this.payment.total - this.payment.verser;
    },
    async submitPayment() {
      try {
        const token = localStorage.getItem("current_token");
        const response = await axios.post("http://127.0.0.1:8000/api/caisses", this.payment, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          this.$swal.fire({
            icon: "success",
            title: "Paiement enregistré !",
            timer: 1500,
            showConfirmButton: false
          });
          this.$router.push({ name: 'dashboard' }); // retour au tableau
        }
      } catch (error) {
        console.error(error);
        this.$swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible d'enregistrer le paiement."
        });
      }
    }
  }
};
</script>
