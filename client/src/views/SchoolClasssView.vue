<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <GenericTable 
    :items="items"
    :columns="tableColumns"
    :useCollectionStore="useCollectionStore" 
    @delete="deleteHandler"
    @update="updateHandler"
    @create="createHandler"
    @sort="sortHandler"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
//módosít
import { useSchoolclassStore } from "@/stores/schoolclassStore";
import GenericTable from "@/components/Table/GenericTable.vue";
export default {
  //módosít
  name: "SchooClassView",
  components: {
    GenericTable,
  },
  data() {
    return {
      //módosít
      pageTitle: "Osztályok",
      //módosít
      tableColumns: [
        { key: "id", label: "ID", debug: import.meta.env.VITE_DEBUG_MODE },
        { key: "osztalyNev", label: "Osztálynév", debug: 2 },
      ],
      //módosít
      useCollectionStore: useSchoolclassStore,
    };
  },
  computed: {
    //módosít
    ...mapState(useSchoolclassStore,['item', 'items','loading'])
  },
  methods: {
    //módosít
    ...mapActions(useSchoolclassStore,['getAll', 'getById', 'create', 'update', 'delete']),
    deleteHandler(id){
      console.log("delete:", id);
    },
    updateHandler(id){
      console.log("update:", id);
    },
    createHandler(){
      console.log("update:");
    },
    sortHandler(column){
      console.log(column);
      
    }
  },
  async mounted(){
   await this.getAll()
  }
};
</script>

<style></style>
