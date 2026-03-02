<template>
    <div class="pageloader">
        <div class="container h-100">
            <div class="row justify-content-center align-items-center text-center h-100">
                <div class="col-12 mb-auto pt-4"></div>
                <div class="col-auto">
                    <img src="../../assets/img/wecare.png" alt="" class="height-200 mb-3">
                    <div class="loaderplus mb-2"></div>
                </div>
                <div class="col-12 mt-auto pb-4">
                    <p class="text-secondary">Veuillier patienter quelque minute...</p>
                </div>
            </div>
        </div>
    </div>

  <div class="login-layout">
    <div class="container-fluid min-vh-100">
      <div class="row min-vh-100 justify-content-center align-items-center">

        <!-- Col Formulaire : occupe tout sur mobile/tablet, demi-écran sur lg+ -->
        <router-view></router-view>

        <!-- Col Image : masquée sous lg -->
        <div class="col-lg-5 d-none d-lg-flex justify-content-center align-items-center">
          <img
            class="img-fluid illustration"
            src="../../assets/img/slider-img-removebg-preview.png"
            alt="Illustration"
          >
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Illustration : ne dépasse pas la hauteur de la fenêtre */
.illustration {
  max-height: 80vh;
  object-fit: contain;
}

/* Sur tablette paysage (md) : on peut afficher l'image à mi-chemin */
@media (min-width: 768px) and (max-width: 991px) {
  /* L'image reste masquée (d-none d-lg-flex), 
     mais le formulaire occupe tout l'espace disponible */
}

/* Assurer que le fond couvre bien l'écran sur mobile */
.login-layout {
  background-color: var(--bs-body-bg, #fff);
}
</style>