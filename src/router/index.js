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
import ListPatient from '../pages/patient/Index.vue';
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
import ListConsultation from '../pages/consultation/ListConsultation.vue';
import ConsultForm from '../pages/consultation/ConsultForm.vue';
import ViewParam from '../pages/patient/ViewParams.vue';

// Fonction pour vérifier si l'utilisateur est authentifié
// const isAuthenticated = () => {
//   const token = localStorage.getItem('current_token');
//   const user = localStorage.getItem('current_user');
//   return token && user;
// };


const isAuthenticated = () => {
  const token = localStorage.getItem('current_token');

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;

    if (payload.exp < now) {
      localStorage.removeItem('current_token');
      localStorage.removeItem('current_user');
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}; 
const routes = [
  // Route de login
  {
    path: '/',
    component: LoginLayout,
    name: 'Login',
    children: [
      {
        path: '',
        name: 'LoginForm',
        component: LoginForm,
      },
    ],
  },
  
  // Routes protégées (nécessitent une authentification)
  {
    path: '/home',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '', 
        name: 'HomePage',
        component: HomePage,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
      },
      {
        path: 'payment/:patientId',
        name: 'PayService',
        component: PayService,
      },
      {
        path: 'listpatient/',
        name: 'ListPatient',
        component: ListPatient,
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
        path: '/paiements/non-imprimes',
        name: 'PaidMedoc',
        component: PaidMedoc,
      },
      {
        path: '/exam',
        name: 'Labo',
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
      {
        path: 'listconsultations/',
        name: 'ListConsultations',
        component: ListConsultation,
      },
      {
        path: 'con/:patientId',
        name: 'Consultation',
        component: ConsultForm,
      }, {
        path: 'vparem/:patientId',
        name: 'ViewParams',
        component: ViewParam,
      },
    ],
  },

  // Redirection du chemin racine
  {
    path: '/',
    redirect: () => {
      return isAuthenticated() ? '/home' : '/';
    },
  },

  // Redirection pour les routes non trouvées
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global pour vérifier l'authentification
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated();

  // Si l'utilisateur essaie d'accéder à une route protégée sans être connecté
  if (to.meta.requiresAuth && !authenticated) {
    next('/');
  }
  // Si l'utilisateur est connecté et essaie d'accéder à la page de login, le rediriger vers la home
  else if (to.name === 'LoginForm' && authenticated) {
    next('/home');
  }
  // Sinon, continuer vers la route
  else {
    next();
  }
});

export default router;
