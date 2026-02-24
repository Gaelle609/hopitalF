import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/Layouts/Main.vue';
import HomePage from '../pages/HomePage.vue'; 
import LoginLayout from '../components/Layouts/Login.vue';
import LoginForm from '../pages/LoginForm.vue';
import Profile from '../pages/Profile.vue';
import PayService from '../pages/patient/PayService.vue';
import Caisse from '../pages/caisse/Caisse.vue';
import ListPay from '../pages/caisse/ListPay.vue';
import ListPayMed from '../pages/caisse/ListPayMed.vue';
import ListPayExam from '../pages/laboratoire/ListPayExam.vue';
import Parameter from '../pages/patient/Parameter.vue';
import IndexPersonnel from '../pages/personnel/Index.vue';
import Service from '../pages/service/Service.vue';
import Product from '../pages/pharmacie/Product.vue';
import Category from '../pages/pharmacie/Category.vue';
import ViewProduct from '../pages/pharmacie/ViewProduct.vue';
import PayMedoc from '../pages/pharmacie/PayMedicament.vue';
import PayExam from '../pages/laboratoire/PayExam.vue';
import PaidMedoc from '../pages/caisse/UnprintedPayments.vue';
import Labo from '../pages/laboratoire/Exam.vue';
import ViewPersonnel from '../pages/personnel/ViewPersonnel.vue';

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
        path: 'listpayMed/',
        name: 'ListPayMed',
        component: ListPayMed,
      },
      {
        path: 'param/',
        name: 'Parameter',
        component: Parameter,
      },
      {
        path: 'personnel/',
        name: 'IndexPersonnel',
        component: IndexPersonnel,
      },
      {
        path: 'persoDetail/',
        name: 'ViewPersonnel',
        component: ViewPersonnel,
      },
      {
        path: 'service/',
        name: 'Service',
        component: Service,
      },
      {
        path: 'category/',
        name: 'Category',
        component: Category,
      },
      {
        path: 'product/',
        name: 'Product',
        component: Product,
      },
      {
        path: 'details/',
        name: 'ViewProduct',
        component: ViewProduct,
      },
      {
        path: 'paymed/',
        name: 'PayMedoc',
        component: PayMedoc,
      },
      {
        path: "/paiements/non-imprimes",
        name: "PaidMedoc",
        component: PaidMedoc,
      },
      {
        path: "/exam",
        name: "Labo",
        component: Labo,
      },
      {
        path: 'payexam/',
        name: 'PayExam',
        component: PayExam,
      },
      {
        path: 'listpayExam/',
        name: 'ListPayExam',
        component: ListPayExam,
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
