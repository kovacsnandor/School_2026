import { defineStore } from "pinia";
// import { useToastStore } from "@/stores/toastStore";
import { useSearchStore } from "./searchStore";
import { useToastStore } from "./toastStore";
import service from "@/api/userService";

//változtatás
class Item {
  constructor(id = 0, name = "", email = "", role = 3) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

export const useUserStore = defineStore("user", {
  state: () => ({
    item: new Item(),
    items: [new Item()],
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
    clearItem() {
      this.item = new Item();
    },
    // READ - Összes adat lekérése

    async getAllSortSearch(column = "id", direction = null) {
      console.log("sort user");

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

    // READ - Egy adat lekérése
    async getById(id) {
      this.loading = true;
      this.error = null;
      //   const toast = useToastStore();
      
      try {
        const response = await service.getById(id);
        this.item = response.data;
        console.log("user adatmódosítás", response.data);
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

    // CREATE - Új elem hozzáadása
    async createUser(data) {
      this.loading = true;
      this.error = null;
      try {
        const newItem = await service.create(data);
        const toast = useToastStore();
        toast.messages.push("User sikeresen létrehozva!");
        toast.show("Success");
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
        const response = await service.getAll();
        // const response = await service.getAllSortSearch(
        //   this.sortColumn,
        //   this.sortDirection,
        //   this.searchStore.searchWord,
        // );
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
        const response = await service.getAll();
        // const response = await service.getAllSortSearch(
        //   this.sortColumn,
        //   this.sortDirection,
        //   this.searchStore.searchWord,
        // );
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
