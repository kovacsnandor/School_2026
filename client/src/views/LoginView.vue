<template>
  <div>
    <UserLogin
    @logIn="loginHandler"
    />

  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useUserLoginLogoutStore } from "@/stores/userLoginLogoutStore";
import UserLogin from "@/components/User/UserLogin.vue";
export default {
  name: "LoginView",
  components:{
    UserLogin,
  },
  
  methods: {
    ...mapActions(useUserLoginLogoutStore,['login']),
    async loginHandler(user){

      try {
        await this.login(user);
        this.$router.push('/')
      } catch (error) {
        console.log('Bejelentkezési hiba!');
        
      }
    },
    
  },
};
</script>

<style></style>
