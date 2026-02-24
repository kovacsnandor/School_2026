<template>
  <div>
    <button type="button" class="btn btn-outline-danger btn-sm"
        @click="onClickButton()"
    >
        <i class="bi bi-key"></i>
    </button>
  </div>
</template>

<script>
export default {
    name: 'ButtonsCrudPassword',
    props: {
        id : {type: Number, required: true}
     },
    methods: {
        onClickButton(){
            this.$emit('passwordChange', this.id);
        }
    }

}
</script>

<style>

</style>