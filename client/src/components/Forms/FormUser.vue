<template>
  <div>
    <Modal ref="modal" :title="title" @yesEvent="yesEventHandler">
      <!-- vezérlőelemek -->
      <!-- user név -->
      <div class="mb-4 row pt-2">
        <label for="name" class="col-form-label col-auto pt-1 pe-0"
          >User név:</label
        >
        <div class="col">
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="formItem.name"
            @input="clearError('name')"
            required
          />
          <div
            v-if="!serverErrors.name"
            class="invalid-feedback position-absolute"
          >
            A user név kötelező
          </div>
          <div
            v-if="serverErrors.name"
            class="invalid-feedback position-absolute d-block"
          >
            {{ serverErrors.name[0] }}
          </div>
        </div>
      </div>

      <!-- email -->
      <div class="mb-4 row pt-2">
        <label for="email" class="col-form-label col-auto pt-1 pe-0"
          >Email:</label
        >
        <div class="col">
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="formItem.email"
            @input="clearError('email')"
            required
          />
          <div
            v-if="!serverErrors.email"
            class="invalid-feedback position-absolute"
          >
            Az email kötelező
          </div>
          <div
            v-if="serverErrors.email"
            class="invalid-feedback position-absolute d-block"
          >
            {{ serverErrors.email[0] }}
          </div>
        </div>
      </div>

      <!-- role -->
      <div class="mb-4 row pt-2">
        <label for="role" class="col-form-label col-auto pt-1 pe-0"
          >Hatáskör:</label
        >
        <div class="col">
          <!-- <input
            type="number"
            class="form-control"
            id="role"
            v-model="formItem.role"
            @input="clearError('role')"
            required
          /> -->

          <select
            class="form-select"
            style="width: 100px"
            id="role"
            aria-label="Default select example"
            v-model="formItem.role"
          >
            <option value="1">Admin</option>
            <option value="2">Tanár</option>
            <option value="3">Diák</option>
          </select>
          <div
            v-if="!serverErrors.role"
            class="invalid-feedback position-absolute"
          >
            A role kötelező
          </div>
          <div
            v-if="serverErrors.role"
            class="invalid-feedback position-absolute d-block"
          >
            {{ serverErrors.role[0] }}
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal/Modal.vue";
// import Modal from "../Modal/Modal.vue";
export default {
  emits: ["yesEventForm"],
  name: "FormSport",
  components: {
    Modal,
  },
  props: {
    title: { type: String, default: "Új rekord felvitele" },
    item: { type: Object },
  },
  data() {
    return {
      formItem: { ...this.item },
      serverErrors: {},
    };
  },
  watch: {
    //Fontos!!! frissülhessen a szülő által küldött item
    item(value) {
      this.formItem = { ...value };
    },
  },
  methods: {
    //metódus továbbítás
    show() {
      this.serverErrors = {};
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    setServerErrors(errors) {
      this.serverErrors = errors;
    },
    clearError(field) {
      if (this.serverErrors[field]) {
        delete this.serverErrors[field];
      }
    },
    yesEventHandler(done) {
      this.$emit("yesEventForm", { item: this.formItem, done });
    },
  },
};
</script>

<style></style>
