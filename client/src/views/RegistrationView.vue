<template>
  <div>
    <h1>Regisztráció</h1>
    <UserRegistration
      @createUser="handlerCreateUser"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/stores/userStore";
import UserRegistration from '@/components/User/UserRegistration.vue';

export default {
  name: 'RegistrationView',
  components: {
    UserRegistration
  },
  methods: {
    ...mapActions(useUserStore,['createUser']),
    async handlerCreateUser(data){
      console.log(data);
      await this.createUser(data);
      this.$router.push("/login");
    }

  }
}
</script>

<style>

</style>