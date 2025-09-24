<template>
  <div>
    <transition name="page-transition" mode="out-in">
      <router-view :key="routerKey" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      routerKey: 0,
      navigationTimeout: null
    }
  },
  watch: {
    '$route'() {
      // Nettoyer le timeout précédent s'il existe
      if (this.navigationTimeout) {
        clearTimeout(this.navigationTimeout);
      }
       window.location.reload();
      // Attendre 0.2 seconde avant de forcer le re-render
      this.navigationTimeout = setTimeout(() => {
        this.routerKey += 1;
       
      }, 200);
    }
  },
  
  beforeUnmount() {
    // Nettoyer le timeout si le composant est détruit
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
    }
  }
}
</script>

<style scoped>

</style>