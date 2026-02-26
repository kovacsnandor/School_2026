<template>
  <div>
    <h1>Regisztráció</h1>
    <UserRegistration
      ref="form"
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
    async handlerCreateUser({data, done}){
      console.log(data);
      try {
        await this.createUser(data);
        done(true);
      } catch (err) {
        if (err.response && err.response.status === 422) {
          // Átadjuk a formnak a konkrét hibaüzeneteket (pl. "min 2 karakter")
          console.log("422:", err.response.data.errors);
          
          this.$refs.form.setServerErrors(err.response.data.errors);
          done(false); // Nyitva tartja a modalt
        } else {
          // Minden más hiba (500, 401) esetén is értesítjük a modalt, hogy ne záródjon be
          done(false);
        }
      }
      
    }

  }
}
</script>

<style>

</style>