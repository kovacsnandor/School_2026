<template>
  <div class="container-fluid my-container my-border mt-2">
    <!-- Head -->
    <Header/>

    <!-- Menü -->
    <Menu class="my-border"/>

    <!-- Ide töltődnek be az oldalak -->
    <RouterView class="my-border my-content-height"/>


    <Footer  class="my-border"
      :content="footerContent"
    />
  </div>
</template>

<script>
import Menu from './components/Layout/Menu.vue';
import Header from './components/Layout/Header.vue';
import Footer from './components/Layout/Footer.vue';
export default {
  components:{
    Menu,
    Header,
    Footer,
  },
  data() {
    return {
      footerContent: "Ez egy másik lábléc szöveg",
    }
  }
};
</script>

<style>

</style>
