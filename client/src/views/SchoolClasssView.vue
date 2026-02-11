<template>
  <div>
    <!-- oldal fejléc -->
    <!-- oldal címe -->
    <div class="d-flex align-items-center m-0 mb-2">
      <h1>{{ pageTitle }}</h1>
      <!-- homokóra -->
      <i
        v-if="loading"
        class="bi bi-hourglass-split fs-3 col-auto p-0 pe-1"
      ></i>
      <!-- új rekord ikon -->
    </div>

    <!-- táblázat -->
    <GenericTable
      :items="items"
      :columns="tableColumns"
      :useCollectionStore="useCollectionStore"
      @delete="deleteHandler"
      @update="updateHandler"
      @create="createHandler"
      @sort="sortHandler"
      v-if="items.length > 0"
    />
    <div v-else style="width: 100px" class="m-auto">Nincs találat</div>

    <!-- Confirm modal -->
    <ConfirmModal
      :isOpenConfirmModal="isOpenConfirmModal"
      @cancel="cancelHandler"
      @confirm="confirmHandler"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
//módosít
import { useSchoolclassStore } from "@/stores/schoolclassStore";
import { useSearchStore } from "@/stores/searchStore";
import GenericTable from "@/components/Table/GenericTable.vue";
import ConfirmModal from "@/components/Confirm/ConfirmModal.vue";
export default {
  //módosít
  name: "SchooClassView",
  components: {
    GenericTable,
    ConfirmModal,
  },
  watch: {
    searchWord() {
      this.getAllSortSearch(this.sortColumn, this.sortDirection);
    },
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
      isOpenConfirmModal: false,
      toDeleteId: null,
    };
  },
  computed: {
    //módosít
    ...mapState(useSchoolclassStore, [
      "item",
      "items",
      "loading",
      "sortColumn",
      "sortDirection",
    ]),
    ...mapState(useSearchStore, ["searchWord"]),
  },
  methods: {
    //módosít
    ...mapActions(useSchoolclassStore, [
      "getAll",
      "getAllSortSearch",
      "getById",
      "create",
      "update",
      "delete",
    ]),
    deleteHandler(id) {
      this.isOpenConfirmModal = true;
      this.toDeleteId = id;
    },
    updateHandler(id) {
      console.log("update:", id);
    },
    createHandler() {
      console.log("update:");
    },
    sortHandler(column) {
      console.log(column);
      this.getAllSortSearch(column);
    },
    cancelHandler() {
      console.log("mégsem törlök");
      this.isOpenConfirmModal = false;
    },
    confirmHandler() {
      console.log("delete:", this.toDeleteId);
      this.isOpenConfirmModal = false;
    },
  },
  async mounted() {
    await this.getAll();
  },
};
</script>

<style></style>
