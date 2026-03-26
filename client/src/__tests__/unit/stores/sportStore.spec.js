import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSportStore } from "@/stores/sporsStore";
import { useToastStore } from "@/stores/toastStore"; // Importáljuk a Toast store-t is
import apiClient from "@/api/axiosClient";

// 1. Az API kliens szimulálása (Mockolás)
vi.mock("@/api/axiosClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

//CRUD ellenőr
describe("SportStore CRUD műveletek", () => {
  beforeEach(() => {
    setActivePinia(createPinia()); // Minden teszt előtt tiszta Pinia kell
    vi.clearAllMocks(); // Töröljük az előző teszt hívásait
  });

  // READ teszt
  it("getAll - sikeresen lekéri a sportokat", async () => {
    const store = useSportStore();
    const mockSports = { data: [{ id: 1, sportNev: "Kosárlabda" }] };
    apiClient.get.mockResolvedValue(mockSports);

    await store.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/sports");
    expect(store.items).toHaveLength(1);
    expect(store.items[0].sportNev).toBe("Kosárlabda");
    expect(store.loading).toBe(false);
  });

  //GetById
  it("getById - betölt egy konkrét sportot az id alapján", async () => {
    const store = useSportStore();
    const mockSport = { data: { id: 5, sportNev: "Vívás" } };

    apiClient.get.mockResolvedValue(mockSport);

    await store.getById(5);

    expect(apiClient.get).toHaveBeenCalledWith("/sports/5");
    expect(store.item.sportNev).toBe("Vívás");
    expect(store.loading).toBe(false);
  });

  // CREATE teszt
  it("create - új sportot ad hozzá és frissíti a listát", async () => {
    const store = useSportStore();
    const newSport = { sportNev: "Tenisz" };

    // Szimuláljuk a sikeres mentést, majd a lista újratöltését
    apiClient.post.mockResolvedValue({ data: { id: 2, ...newSport } });
    apiClient.get.mockResolvedValue({ data: [{ id: 2, ...newSport }] });

    const success = await store.create(newSport);

    expect(success).toBe(true);
    expect(apiClient.post).toHaveBeenCalled();
    expect(store.items[0].sportNev).toBe("Tenisz");
  });

  //UPDATE
  it("update - módosítja a sportot és frissíti a listát", async () => {
    const store = useSportStore();
    const updatedData = { sportNev: "Úszás (módosított)" };

    // Első hívás: a PATCH művelet (sikeres)
    apiClient.patch.mockResolvedValue({ data: { id: 1, ...updatedData } });
    // Második hívás: a getAllSortSearch hívja a GET-et a friss listáért
    apiClient.get.mockResolvedValue({ data: [{ id: 1, ...updatedData }] });

    const result = await store.update(1, updatedData);

    expect(result).toBe(true);
    expect(apiClient.patch).toHaveBeenCalledWith("/sports/1", updatedData);
    // Ellenőrizzük, hogy a store-ban már az új név szerepel-e a listában
    expect(store.items[0].sportNev).toBe("Úszás (módosított)");
  });

  //Delete
  it('delete - törli a sportot és újratölti a listát', async () => {
  const store = useSportStore();
  
  // Törlés sikeres (axios gyakran üres választ ad vagy 204-et)
  apiClient.delete.mockResolvedValue({});
  // Újratöltés utáni üres lista szimulálása
  apiClient.get.mockResolvedValue({ data: [] });

  const result = await store.delete(1);

  expect(result).toBe(true);
  expect(apiClient.delete).toHaveBeenCalledWith('/sports/1');
  expect(store.items).toHaveLength(0); // Kiürült a lista
});
});

describe("SportStore hibaág tesztek", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  // DELETE teszt speciális hibaágra (MySQL 1451)
  it("delete - kezeli a kényszerfeltétel hibát (1451)", async () => {
    const store = useSportStore();
    const errorResponse = {
      response: {
        status: 500,
        data: { message: "1451-es hiba üzenete" },
      },
    };

    apiClient.delete.mockRejectedValue(errorResponse);

    try {
      await store.delete(1);
    } catch (e) {
      // Az interceptorod dobja tovább, itt elkapjuk
    }

    expect(store.error).toBeDefined();
    expect(store.loading).toBe(false);
  });

  //Szerver hiba dobásának ellenőrzése
  //A sotre error és loaded viselkedésének elenőrzése
  it("delete - kezeli a kényszerfeltétel hibát (MySQL 1451)", async () => {
    const store = useSportStore();

    // Szimulálunk egy 500-as hibát, aminek a szövegében benne van az 1451
    const errorResponse = {
      response: {
        status: 500,
        data: {
          message: "SQLSTATE[23000]: Integrity constraint violation: 1451...",
        },
      },
    };

    // Megmondjuk a kamu API-nak, hogy dobjon hibát (rejected)
    apiClient.delete.mockRejectedValue(errorResponse);

    try {
      await store.delete(1);
    } catch (err) {
      // Itt elkapjuk, mert a store-ban "throw err" van
    }

    // Ellenőrizzük, hogy a store elmentette-e a hibát a state-be
    expect(store.error).toBeDefined();
    expect(store.loading).toBe(false);
  });

  //422-es ellenőrzés
  //A hiba feljut-e a store-ból, valamint error és loaded ellenőrzés
  it("create - kezeli a 422-es validációs hibát", async () => {
    const store = useSportStore();

    // 1. ELŐKÉSZÍTÉS (Mock)
    // Szimulálunk egy Laravel validációs hiba választ
    const error422 = {
      response: {
        status: 422,
        data: {
          message: "A megadott adatok érvénytelenek.",
          errors: {
            sportNev: ["A sport neve már foglalt."],
          },
        },
      },
    };

    // Beállítjuk, hogy a következő post hívás dobja ezt a hibát
    apiClient.post.mockRejectedValue(error422);

    // 2. VÉGREHAJTÁS ÉS ELLENŐRZÉS
    // Mivel a store "throw err"-t használ, a tesztben el kell kapnunk,
    // hogy ne álljon meg a tesztfutás hibával.
    let caughtError;
    try {
      await store.create({ sportNev: "Foci" });
    } catch (err) {
      caughtError = err;
    }

    // 3. AZ ÍTÉLET (Expect)
    // Ellenőrizzük, hogy a hiba visszajutott-e a hívóhoz
    expect(caughtError.response.status).toBe(422);

    // Ellenőrizzük, hogy a store elmentette-e a hibát a saját state-jébe
    expect(store.error).toBeDefined();

    // Ellenőrizzük, hogy a loading false lett-e a végén (finally ág)
    expect(store.loading).toBe(false);
  });

  it("422-es hiba esetén NEM hívódik meg a Toast", async () => {
    const sportStore = useSportStore();
    const toastStore = useToastStore();

    // SPY (Kém): Ráállítunk egy figyelőt a toastStore "show" metódusára
    const toastSpy = vi.spyOn(toastStore, "show");

    // Szimulálunk egy 422-es választ
    apiClient.post.mockRejectedValue({
      response: { status: 422, data: { message: "Validation error" } },
    });

    try {
      await sportStore.create({ sportNev: "" });
    } catch (err) {
      // Itt elkapjuk a hibát, hogy a teszt továbbmenjen
    }

    // AZ ELLENŐRZÉS:
    // Elvárjuk, hogy a toastStore.show() fv. EGYSZER SEM lett meghívva
    expect(toastSpy).not.toHaveBeenCalled();

    // Biztonság kedvéért ellenőrizzük, hogy a hiba azért megérkezett a store-ba
    expect(sportStore.error).toBeDefined();
  });
});
