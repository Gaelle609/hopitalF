import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/Layouts/Main.vue';
import HomePage from '../pages/HomePage.vue'; 
import LoginLayout from '../components/Layouts/Login.vue';
import LoginForm from '../pages/LoginForm.vue';
import Profile from '../pages/Profile.vue';
import PayService from '../pages/patient/PayService.vue';
import Caisse from '../pages/caisse/Caisse.vue';
import ListPay from '../pages/caisse/ListPay.vue';
import Parameter from '../pages/patient/Parameter.vue';
import Personnel from '../pages/users/CreatePersonnel.vue';



const routes = [
 
  {
    path: "/home",
    component: MainLayout,
    children: [

      {
        path: "", 
        name: "HomePage",
        component: HomePage,
      },
      {
        path: "profile",
        name: "Profile",
        component: Profile,
      },
      {
        path: 'payment/:patientId',
        name: 'PayService',
        component: PayService,
      },
       {
        path: 'caisse/',
        name: 'Caisse',
        component: Caisse,
      },
      {
        path: 'listpay/',
        name: 'ListPay',
        component: ListPay,
      },
      {
        path: 'param/',
        name: 'Parameter',
        component: Parameter,
      },
      {
        path: 'personnel/',
        name: 'Personnel',
        component: Personnel,
      },

    ],
  },
  {
    path: "/",
    component: LoginLayout,
    children: [
      {
        path: "",
        name: "LoginForm",
        component: LoginForm,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
