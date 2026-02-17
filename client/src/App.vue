<template>
  <div class="container-fluid my-container my-border mt-2">
    <!-- Head -->
    <Header/>

    <!-- Menü -->
    <Menu class="my-border"/>
    <Breadcrumb class="my-border"/>

    <!-- Ide töltődnek be az oldalak -->
    <RouterView class="my-border my-content-height"/>


    <Footer  class="my-border"
      :content="footerContent"
    />
    <ToastContanier/>
  </div>
</template>

<script>
import Menu from './components/Layout/Menu.vue';
import Header from './components/Layout/Header.vue';
import Footer from './components/Layout/Footer.vue';
import Breadcrumb from './components/Layout/Breadcrumb.vue';
import ToastContanier from './components/Message/ToastContanier.vue';
export default {
  components:{
    Menu,
    Header,
    Footer,
    Breadcrumb,
    ToastContanier,
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
