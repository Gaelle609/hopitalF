<template>
  <div class="col-lg-5 d-flex justify-content-center">
    <form class="w-100" @submit.prevent="login">
      <div class="card border-0 shadow text-center p-4" style="max-width: 350px;">
        <div class="border-0 adminuiux-content">
          <div class="d-flex justify-content-center mb-3">
            <img id="img" src="../../assets/img/wecare.png" alt="Logo">
          </div>
          <h4 id="log"><b>Connexion</b></h4>
        </div>
        <div class="card-body">
          <input type="text" v-model="matricule" :class="{'input-error': error_matricule}" class="form-control mb-3" placeholder="Matricule">
          <span v-if="error_matricule" class="text-danger err">{{ error_matricule.toLowerCase() }}</span>

          <input type="password" v-model="password" :class="{'input-error': error_password}" class="form-control mb-3" placeholder="Mot de passe">
          <span v-if="error_password" class="text-danger err">{{ error_password.toLowerCase() }}</span>

          <input id="btn" type="submit" class="btn btn-primary w-100" value="CONNECT">
        </div>
        <div class="adminuiux-content border-0">
          <small class="text-secondary">
            <a href="#">Mot de passe oublié ?</a>
          </small>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginForm",
  data() {
    return {
      matricule: "",
      password: "",
      rawErrors: {}, // pour stocker les erreurs du backend
    };
  },
  computed: {
    error_matricule() {
      return this.rawErrors.matricule ? this.rawErrors.matricule[0] : "";
    },
    error_password() {
      return this.rawErrors.password ? this.rawErrors.password[0] : "";
    }
  },
  methods: {
    async login() {
      this.rawErrors = {}; // Réinitialiser les erreurs
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/login", {
          matricule: this.matricule,
          password: this.password
        });

        if (res.data.success) {
          const userData = res.data.data;

          // Stocker toutes les données pour réutilisation
          localStorage.setItem("current_user", JSON.stringify(userData.user));
          localStorage.setItem("current_token", userData.token);
          const roles = userData.user.roles || [];
          localStorage.setItem("current_role", JSON.stringify(roles));
          console.log('Roles stockés :', roles);
          // Redirection
          location.href = "/home";
        }
      } catch (error) {
        if (error.response) {
          const data = error.response.data;
          if (data.errors) {
            this.rawErrors = data.errors; // validation
          } else if (data.message) {
            this.rawErrors = { matricule: [data.message] }; // message global
          } else {
            this.rawErrors = { matricule: ["erreur inconnue"] };
          }
        } else {
          this.rawErrors = { matricule: ["impossible de se connecter au serveur"] };
        }
      }
    }
  }
};
</script>

<style scoped>
#img {
  height: 80px;
  width: 80px;
  border-radius: 70rem;
  background-color: blanchedalmond;
}
#btn:hover {
  box-shadow: 3px 3px 3px rgb(59, 105, 255);
}
#log {
  color: rgb(59, 105, 255);
}

/* Tremblement pour input en erreur */
.input-error {
  animation: shake 0.3s;
  border-color: red;
} 

.err {
  font-size: 0.700em;
  margin-top: -10px;
  display: block;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
</style>
