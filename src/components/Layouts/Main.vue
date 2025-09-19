<template>
<div class="pageloader">
        <div class="container h-100">
            <div class="row justify-content-center align-items-center text-center h-100">
                <div class="col-12 mb-auto pt-4"></div>
                <div class="col-auto"><img src="../../assets/img/wecare.png" alt="" class="height-200 mb-3">
                    <!-- <p class="h6 mb-0">AdminUIUX</p>
                    <p class="h3 mb-4">Digi Clinic</p> -->
                    <div class="loaderplus mb-2"></div>
                </div>
                <div class="col-12 mt-auto pb-4">
                    <p class="text-secondary">Veuillier patienter quelque minute...</p>
                </div>
            </div>
        </div>
    </div>
    <Header/>
     <div class="adminuiux-wrap">
      <Menu/>
       <main class="adminuiux-content has-sidebar" onclick="contentClick()">
         <div class="container mt-4" id="main-content">
             <router-view :key="$route.fullPath"></router-view>
         </div>
      </main>
    </div>
      <Footer/>
      <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

</template>
  
  <script setup>
  import Footer from '@/components/Layouts/Footer.vue';
  import Header from '@/components/Layouts/Header.vue'
  import Menu from '@/components/Layouts/Side.vue';

  </script>
  
  <style>
  /* @import '../../../public/assets/css/style.css';  */
  /* @import '/assets/css/style.css';  */

  </style>
