<template>
  <div>
    <h1>Login</h1>
    

  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useUserLoginLogoutStore } from "@/stores/userLoginLogoutStore";
export default {
  name: "LoginView",
  computed:{
    ...mapState(useUserLoginLogoutStore,['item'])
  },
  methods: {
    ...mapActions(useUserLoginLogoutStore,['login','logout']),
    
  },
};
</script>

<style></style>
