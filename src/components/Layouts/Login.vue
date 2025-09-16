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
  <div class="login-layout">
    <div class="container-fluid vh-100">
      <div class="row h-100 justify-content-center align-items-center">
        
        <!-- Col Formulaire -->
        
        <router-view></router-view>
        <!-- Col Image -->
        <div class="col-lg-5 d-none d-lg-flex justify-content-center">
          <img class="img-fluid" src="../../assets/img/slider-img-removebg-preview.png" alt="Illustration">
        </div>

      </div>
    </div>
  </div>
</template>

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
</style>
