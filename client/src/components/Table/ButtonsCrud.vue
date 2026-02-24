<template>
  <div class="d-flex">
    <ButtonsCrudDelete
      class="ms-2"
      :id="id"
      @delete="$emit('delete', $event)"
      v-if="dButtonVisible"
    />
    <ButtonsCrudUpdate
      class="ms-2"
      :id="id"
      @update="$emit('update', $event)"
      v-if="uButtonVisible"
    />
    <ButtonsCrudCreate
      class="ms-2"
      @create="$emit('create', $event)"
      v-if="cButtonVisible"
    />
    <ButtonsCrudPassword
      :id="id"
      class="ms-2"
      @passwordChange="$emit('passwordChange', $event)"
      v-if="pButtonVisible"
    />
  </div>
</template>

<script>
import ButtonsCrudCreate from "./ButtonsCrudCreate.vue";
import ButtonsCrudDelete from "./ButtonsCrudDelete.vue";
import ButtonsCrudUpdate from "./ButtonsCrudUpdate.vue";
import ButtonsCrudPassword from "./ButtonsCrudPassword.vue";
export default {
  name: "ButtonsCrud",
  components: {
    ButtonsCrudCreate,
    ButtonsCrudDelete,
    ButtonsCrudUpdate,
    ButtonsCrudPassword,
  },
  props: {
    id: { type: Number, required: true },
    cButtonVisible: { type: Boolean, default: true },
    uButtonVisible: { type: Boolean, default: true },
    dButtonVisible: { type: Boolean, default: true },
    pButtonVisible: { type: Boolean, default: false },
  },
};
</script>

<style></style>
