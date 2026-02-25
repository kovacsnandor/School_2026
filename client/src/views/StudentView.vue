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

        <select
          class="form-select ms-2"
          aria-label="Default select example"
          v-model="selectedSchoolclassId"
        >
          <option
            v-for="sItem in schoolClassItems"
            :key="sItem.id"
            :value="sItem.id"
          >
            {{ sItem.osztalyNev }}
          </option>
        </select>
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
    <FormStudent
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
import { useStudentStore } from "@/stores/studentStore";
import { useSearchStore } from "@/stores/searchStore";
import GenericTable from "@/components/Table/GenericTable.vue";
import ConfirmModal from "@/components/Confirm/ConfirmModal.vue";
import ButtonsCrudCreate from "@/components/Table/ButtonsCrudCreate.vue";
import FormStudent from "@/components/Forms/FormStudent.vue";
export default {
  //módosít
  name: "StudentView",
  components: {
    GenericTable,
    ConfirmModal,
    ButtonsCrudCreate,
    FormStudent,
  },
  watch: {
    searchWord() {
      this.getStudentsBySchoolclassId(
        this.selectedSchoolclassId,
        this.sortColumn,
        this.sortDirection,
      );
    },
    selectedSchoolclassId(value) {
      this.getStudentsBySchoolclassId(
        value,
        this.sortColumn,
        this.sortDirection,
      );
    },
  },
  data() {
    return {
      //módosít
      pageTitle: "Diákok",
      selectedSchoolclassId: null,
      //módosít
      tableColumns: [
        { key: "id", label: "ID", debug: import.meta.env.VITE_DEBUG_MODE },
        { key: "diakNev", label: "---Diáknév---", debug: 2 },
        {
          key: "schoolclassId",
          label: "Osztály ID",
          debug: import.meta.env.VITE_DEBUG_MODE,
        },
        { key: "nemeString", label: "Neme", debug: 2 },
        { key: "iranyitoszam", label: "Irsz.", debug: 2 },
        { key: "lakHelyseg", label: "Település", debug: 2 },
        { key: "lakCim", label: "------Cím------", debug: 2 },
        { key: "szulHelyseg", label: "Szül. hely", debug: 2 },
        { key: "szulDatum", label: "Szül. dátum", debug: 2 },
        { key: "igazolvanyszam", label: "Igazolványszám", debug: 2 },
        { key: "atlag", label: "Átlag", debug: 2 },
        { key: "osztondij", label: "Ösztöndíj", debug: 2 },
        { key: "eletkor", label: "Életkor", debug: 2 },
      ],
      //módosít
      useCollectionStore: useStudentStore,
      isOpenConfirmModal: false,
      toDeleteId: null,
      state: "r", //crud
      title: "",
    };
  },
  computed: {
    //módosít
    ...mapState(useSchoolclassStore, {
      schoolClassItems: "items",
    }),
    ...mapState(useStudentStore, [
      "item",
      "items",
      "loading",
      "getItemsLength",
      "sortColumn",
      "sortDirection",
    ]),
    ...mapState(useSearchStore, ["searchWord"]),
  },
  methods: {
    //módosít
    ...mapActions(useSchoolclassStore, ["getAllAbc"]),
    ...mapActions(useSearchStore, ["resetSearchWord"]),
    ...mapActions(useStudentStore, [
      "getStudentsBySchoolclassId",
      "clearItem",
      "getById",
      "create",
      "update",
      "delete",
    ]),
    deleteHandler(id) {
      this.state = "d";
      this.isOpenConfirmModal = true;
      this.toDeleteId = id;
    },
    updateHandler(id) {
      this.state = "u";
      this.title = "Adatmódosítás";
      this.getById(id);
      this.$refs.form.show();
      // console.log("update:", id);
    },
    createHandler() {
      this.state = "c";
      this.title = "Új adatbevitel";
      this.clearItem();
      this.$refs.form.show();
      // console.log("Create:");
    },
    sortHandler(column) {
      console.log(column);
      this.getStudentsBySchoolclassId(this.selectedSchoolclassId, column);
    },
    cancelHandler() {
      console.log("mégsem törlök");
      this.isOpenConfirmModal = false;
      this.state = "r";
    },
    async confirmHandler() {
      try {
        await this.delete(this.toDeleteId, this.selectedSchoolclassId);
      } catch (error) {}
      this.isOpenConfirmModal = false;
      this.state = "r";
    },
    async yesEventFormHandler({ item, done }) {
      //vagy create, vagy update
      try {
        if (this.state == "c") {
          //create
          await this.create(item, this.selectedSchoolclassId);
        } else {
          //update
          console.log("módosítás előtt");
          
          await this.update(item.id, item, this.selectedSchoolclassId);
          console.log("módsítás után");
          
        }
        //nem volt hiba
        this.state = "r";
        done(true);
      } catch (err) {
        console.log("valami hiba");
        
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
    //Osztályok betöltése
    await this.getAllAbc();
    //az első osztály jelenjen meg
    this.selectedSchoolclassId = this.schoolClassItems[0].id;
    //tanulók betöltése
    await this.getStudentsBySchoolclassId(this.selectedSchoolclassId);
  },
};
</script>

<style></style>
