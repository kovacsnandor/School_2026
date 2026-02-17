<template>
  <div>
    <h1>Login</h1>
    <button @click="onClickButtonAdmin" type="button" class="btn btn-primary">
      Admin
    </button>
    <button @click="onClickButtonTanar" type="button" class="btn btn-secondary">
      Tanár
    </button>
    <button @click="onClickButtonDiak" type="button" class="btn btn-success">
      Diák
    </button>
   <h2>Item</h2>
   <p>{{ item }}</p>
       <button @click="onClickLogout" type="button" class="btn btn-danger">
      Logout
    </button>

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
    onClickButtonAdmin() {
      const data = {
        email: "adminx@example.com",
        password: "123",
      };
      this.login(data);
    },
    onClickButtonTanar() {
      const data = {
        email: "tanar@example.com",
        password: "123",
      };
      this.login(data);
    },
    onClickButtonDiak() {
      const data = {
        email: "diak1@example.com",
        password: "123",
      };
      this.login(data);
    },
    onClickLogout(){
      this.logout();
    }
  },
};
</script>

<style></style>
