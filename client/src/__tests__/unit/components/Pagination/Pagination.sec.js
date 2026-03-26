import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '@/components/Pagination/Pagination.vue';
import { createTestingPinia } from '@pinia/testing';
import { useSportStore } from '@/stores/sporsStore';

describe('Pagination.vue tesztek', () => {
  it('megjeleníti a helyes oldalszámokat a store adatai alapján', async () => {
    const wrapper = mount(Pagination, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            sport: { // Fontos: Ez legyen a store-od ID-ja (id: 'sport' vagy 'sportStore')
              pagination: {
                current_page: 1,
                last_page: 3 // Itt állítjuk be, hogy legyen 3 oldal
              }
            }
          }
        })]
      },
      props: {
        useCollectionStore: useSportStore
      }
    });

    // Most már a pagination.last_page > 1, tehát meg kell jelenniük a gomboknak
    const buttons = wrapper.findAll('.page-link');
    
    // 3 oldalszám + 2 előre/hátra + 2 első/utolsó = 7 gomb összesen
    expect(buttons.length).toBe(7); 
    expect(wrapper.text()).toContain('2'); // A második oldal száma látható?
  });

  it('kattintáskor meghívja a store getPaging metódusát', async () => {
    const wrapper = mount(Pagination, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            sport: {
              pagination: { current_page: 1, last_page: 5 }
            }
          }
        })]
      },
      props: { useCollectionStore: useSportStore }
    });

    const store = useSportStore();
    
    // Megkeressük a "2"-es számú gombot és rákattintunk
    const secondPageBtn = wrapper.findAll('.page-link').find(b => b.text() === '2');
    await secondPageBtn.trigger('click');

    // Ellenőrizzük, hogy a store getPaging action-je lefutott-e a 2-es számmal
    expect(store.getPaging).toHaveBeenCalledWith(2);
  });
});