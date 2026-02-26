import { defineStore } from "pinia";
// import { useToastStore } from "@/stores/toastStore";
import { useSearchStore } from "./searchStore";
import service from "@/api/sportService";

// const toast = useToastStore();

//változtatás
class Item {
  constructor(id = 0, sportNev = "") {
    this.id = id;
    this.sportNev = sportNev;
  }
}

class Pagination {
  constructor(current_page = 1, last_page = 1, total = 10) {
    this.current_page = current_page;
    this.last_page = last_page;
    this.total = total;
  }
}

export const useSportStore = defineStore("sports", {
  state: () => ({
    item: new Item(),
    items: [new Item()],
    pagination: new Pagination(),
    selectedPerPage: 10,
    selectedPerPageList: [10, 30, 50, 100],
    loading: false,
    error: null,
    sortColumn: "id",
    sortDirection: "asc",
    searchStore: useSearchStore(),
  }),
  getters: {
    getItemsLength() {
      return this.items.length;
    },
  },
  actions: {
    async setSelectedPerPage(value) {
      this.selectedPerPage = value;
      this.loading = true;
      await this.getPaging();
      this.loading = false;
    },
    setColumn(column) {
      this.sortColumn = column;
      const direction =
        this.sortColumn === column && this.sortDirection === "asc"
          ? "desc"
          : "asc";
      this.sortDirection = direction;
      this.getPaging();
    },

    clearItem() {
      this.item = new Item();
    },
    // READ - Összes adat lekérése
    async getAllAbc() {
      //   const toast = useToastStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await service.getAllAbc();
        this.items = response.data;
      } catch (err) {
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    //Ha a direction meg van aadva, akkor ez lesz a sorrend
    //Ha nincs megadva, akkor ellentettjére vált
    async getAllSortSearch(column = "id", direction = null) {
      //   const toast = useToastStore();
      this.loading = true;
      this.error = null;
      this.sortColumn = column;
      if (!direction) {
        direction =
          this.sortColumn === column && this.sortDirection === "asc"
            ? "desc"
            : "asc";
      }
      this.sortDirection = direction;
      try {
        const response = await service.getAllSortSearch(
          this.sortColumn,
          this.sortDirection,
          this.searchStore.searchWord,
        );
        this.items = response.data;
      } catch (err) {
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async getAll() {
      //   const toast = useToastStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await service.getAll();
        // this.searchStore.reset();
        this.items = response.data;
      } catch (err) {
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getPaging(page = null) {
      this.loading = true;
      this.error = null;
      //Ha nincs megadva oldal, menj az aktuálisra
      if (!page) {
        page = this.pagination.current_page;
      }
      try {
        const response = await service.getPaging(
          page,
          this.selectedPerPage,
          this.sortColumn,
          this.sortDirection,
          this.searchStore.searchWord,
        );
        this.items = response.data;
        this.pagination = response.meta;
        return true;
      } catch (err) {
        this.error = err;
        // toast.messages.push(`Az adatok nem töltődtek be`);
        // toast.show("Error");
        throw err;
        return false;
      } finally {
        this.loading = false;
      }
    },

    // READ - Egy adat lekérése
    async getById(id) {
      this.loading = true;
      this.error = null;
      //   const toast = useToastStore();
      try {
        const response = await service.getById(id);
        this.item = response.data;
      } catch (err) {
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // CREATE - Új elem hozzáadása
    async create(data) {
      this.loading = true;
      this.error = null;
      try {
        const newItem = await service.create(data);
        const response = await service.getAllSortSearch(
          this.sortColumn,
          this.sortDirection,
          this.searchStore.searchWord,
        );
        this.items = response.data;
        // toast.messages.push("Sikeresen létrehozva!");
        // toast.show("Success");
        return true;
      } catch (err) {
        this.error = err;
        throw err;
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 3. UPDATE - Módosítás (Helyi frissítéssel, újraolvasás nélkül)
    async update(id, updateData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedItem = await service.update(id, updateData);
        // const response = await service.getAll();
        const response = await service.getAllSortSearch(
          this.sortColumn,
          this.sortDirection,
          this.searchStore.searchWord,
        );
        this.items = response.data;
        // toast.messages.push(`Sikeresen módosítva`);
        // toast.show("Success");
        return true;
      } catch (err) {
        this.error = err;
        throw err;
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 4. DELETE - Törlés
    async delete(id) {
      this.loading = true;
      this.error = null;
      try {
        await service.delete(id);
        // const response = await service.getAll();
        const response = await service.getAllSortSearch(
          this.sortColumn,
          this.sortDirection,
          this.searchStore.searchWord,
        );
        this.items = response.data;
        // toast.messages.push(`Sikeresen törölve`);
        // toast.show("Success");
        return true;
      } catch (err) {
        this.error = err;
        throw err;
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
