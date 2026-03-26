import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import SportView from "@/views/SportView.vue";
import { useSportStore } from "@/stores/sporsStore";

// Mockoljuk a Bootstrap Modalt, mert a FormSport használja
vi.mock("bootstrap", () => {
  return {
    Modal: vi.fn().mockImplementation(function () {
      return {
        show: vi.fn(),
        hide: vi.fn(),
      };
    }),
  };
});
describe("SportView.vue Integrációs Teszt", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    // Pinia tesztkörnyezet létrehozása
    wrapper = mount(SportView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn, // Automatikusan mockolja az összes action-t
            initialState: {
              sports: {
                // Feltételezzük, hogy a store neve 'sports'
                items: [{ id: 1, sportNev: "Foci" }],
                loading: false,
                item: {},
                getItemsLength: 1
              },
            },
          }),
        ],
        stubs: {
          // A bonyolult gyerekkomponenseket leegyszerűsítjük,
          // de a slotokat meghagyjuk, hogy lássuk a tartalmukat
          GenericTable: true,
          Pagination: true,
          SetSelectedPerPage: true,
          ButtonsCrudCreate: {
            template:
              '<button id="create-btn" @click="$emit(\'create\')"></button>',
          },
        },
      },
    });

    store = useSportStore();
  });

  it("megjeleníti a főcímet és az elemszámot", () => {
    expect(wrapper.find("h1").text()).toBe("Sportok");
    expect(wrapper.text()).toContain("(1)");
  });

  it("megnyitja a Formot új adat felviteléhez", async () => {
    const createBtn = wrapper.find("#create-btn");
    await createBtn.trigger("click");

    // Ellenőrizzük, hogy a state 'c' (create) lett-e
    expect(wrapper.vm.state).toBe("c");
    expect(wrapper.vm.title).toBe("Új adatbevitel");

    // Ellenőrizzük, hogy a store clearItem metódusa lefutott-e
    expect(store.clearItem).toHaveBeenCalled();
  });

  it("törlési folyamat: megnyitja a ConfirmModalt, majd hívja a törlést", async () => {
    // Szimuláljuk, hogy a táblázat delete eseményt küld
    await wrapper.vm.deleteHandler(1);

    expect(wrapper.vm.isOpenConfirmModal).toBe(true);
    expect(wrapper.vm.toDeleteId).toBe(1);

    // Szimuláljuk a megerősítést
    await wrapper.vm.confirmHandler();

    // Ellenőrizzük, hogy a store delete action-je a jó ID-val futott-e le
    expect(store.delete).toHaveBeenCalledWith(1);
    expect(wrapper.vm.isOpenConfirmModal).toBe(false);
  });

  it("sikeres mentés után lezárja a formot", async () => {
    // Elindítunk egy "create" folyamatot
    wrapper.vm.state = "c";
    const fakeDone = vi.fn();
    const testItem = { sportNev: "Tenisz" };

    // Szimuláljuk a FormSport @yesEventForm eseményét
    await wrapper.vm.yesEventFormHandler({ item: testItem, done: fakeDone });

    // Ellenőrizzük, hogy a store create-je lefutott-e az adattal
    expect(store.create).toHaveBeenCalledWith(testItem);

    // Mivel a store action-je (async) sikeres volt, a done(true)-nak le kell futnia
    expect(fakeDone).toHaveBeenCalledWith(true);
    expect(wrapper.vm.state).toBe("r"); // Visszaáll 'read' módba
  });

  it("szerver hiba (422) esetén nem zárja le a formot és átadja a hibákat", async () => {
    // Beállítjuk, hogy a store.create hibát dobjon
    store.create.mockRejectedValueOnce({
      response: {
        status: 422,
        data: { errors: { sportNev: ["Túl rövid"] } },
      },
    });

    wrapper.vm.state = "c";
    const fakeDone = vi.fn();

    // Ezúttal egy ref-et is mockolnunk kell a setServerErrors miatt
    wrapper.vm.$refs.form.setServerErrors = vi.fn();

    await wrapper.vm.yesEventFormHandler({
      item: { sportNev: "A" },
      done: fakeDone,
    });

    expect(fakeDone).toHaveBeenCalledWith(false); // Nem záródhat be!
    expect(wrapper.vm.$refs.form.setServerErrors).toHaveBeenCalled();
  });
});
