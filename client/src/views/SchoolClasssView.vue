<template>
  <div>
    <!-- oldal fejléc -->
    <!-- oldal címe -->
    <div class="d-flex align-items-center m-0 mb-2">
      <h1>{{ pageTitle }}</h1>
      <div class="d-flex align-items-center m-0 ms-2">
        <!-- homokóra -->
        <i
          v-if="loading"
          class="bi bi-hourglass-split fs-3 col-auto p-0 pe-1"
        ></i>
        <!-- új rekord ikon -->
        <ButtonsCrudCreate v-if="!loading" @create="createHandler" />
        <p class="m-0 ms-2">({{ getItemsLength }})</p>
      </div>
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

    <!-- Form -->
    <FormSchoolClass
      ref="form"
      :title="title"
      :item="item"
      @yesEventForm="yesEventFormHandler"
    />

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
import ButtonsCrudCreate from "@/components/Table/ButtonsCrudCreate.vue";
import FormSchoolClass from "@/components/Forms/FormSchoolClass.vue";
export default {
  //módosít
  name: "SchooClassView",
  components: {
    GenericTable,
    ConfirmModal,
    ButtonsCrudCreate,
    FormSchoolClass,
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
      state: "r", //crud
      title: "",
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
      "getItemsLength",
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
      "clearItem",
    ]),
    ...mapActions(useSearchStore, ["resetSearchWord"]),
    deleteHandler(id) {
      this.state = "d";
      this.isOpenConfirmModal = true;
      this.toDeleteId = id;
    },
    //módosítani akarok
    updateHandler(id) {
      this.state = "u";
      this.title = "Adatmódosítás";
      this.getById(id);
      this.$refs.form.show();
      console.log("update:", id);
    },
    //újat akarok
    createHandler() {
      this.state = "c";
      this.title = "Új adatbevitel";
      this.clearItem();
      this.$refs.form.show();
      console.log("Create:");
    },
    sortHandler(column) {
      console.log(column);
      this.getAllSortSearch(column);
    },
    //nem akarok törölni
    cancelHandler() {
      console.log("mégsem törlök");
      this.isOpenConfirmModal = false;
      this.state = "r";
    },
    //mehet a torlés
    async confirmHandler() {
      try {
        await this.delete(this.toDeleteId);
      } catch (error) {
      }
      this.isOpenConfirmModal = false;
      this.state = "r";
    },

    async yesEventFormHandler({ item, done }) {
      //vagy create, vagy update
      try {
        if (this.state == "c") {
          //create
          await this.create(item);
        } else {
          //update
          await this.update(item.id, item);
        }
        //nem volt hiba
        this.state = "r";
        done(true);
      } catch (err) {
        //hiba volt
        //nem csukódik le az ablak
        if (err.response && err.response.status === 422) {
          // Átadjuk a formnak a konkrét hibaüzeneteket (pl. "min 2 karakter")
          this.$refs.form.setServerErrors(err.response.data.errors);
          done(false); // Nyitva tartja a modalt
        } else {
          // Minden más hiba (500, 401) esetén is értesítjük a modalt, hogy ne záródjon be
          done(false);
        }
        //átadom a hibát
      }
    },
  },
  async mounted() {
    this.resetSearchWord();
    await this.getAll();
  },
};
</script>

<style></style>
