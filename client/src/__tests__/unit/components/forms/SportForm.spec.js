import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import FormSport from '@/components/Forms/FormSport.vue';

// Definiálunk egy közös Modal utánzatot, ami átengedi a tartalmat
const ModalStub = {
  template: '<div><slot></slot></div>',
  methods: {
    show: vi.fn(),
    hide: vi.fn()
  }
};

describe('FormSport.vue komponens tesztek', () => {

  it('megjeleníti a címet és az alapértelmezett adatokat', () => {
    const wrapper = mount(FormSport, {
      props: {
        title: 'Sport szerkesztése',
        item: { sportNev: 'Tenisz' }
      },
      global: { stubs: { Modal: ModalStub } }
    });

    expect(wrapper.find('label').text()).toContain('Sportnév:');
    expect(wrapper.find('input').element.value).toBe('Tenisz');
  });

  it('frissíti a formItem-et, ha a szülő megváltoztatja az item prop-ot', async () => {
    const wrapper = mount(FormSport, {
      props: { item: { sportNev: 'Eredeti' } },
      global: { stubs: { Modal: ModalStub } }
    });

    await wrapper.setProps({ item: { sportNev: 'Frissített' } });
    expect(wrapper.find('input').element.value).toBe('Frissített');
  });

  it('eltávolítja a hibaüzenetet, ha a felhasználó gépelni kezd', async () => {
    const wrapper = mount(FormSport, {
      props: { item: { sportNev: 'Foci' } },
      global: { stubs: { Modal: ModalStub } }
    });

    // Beállítjuk a hibát
    await wrapper.setData({
      serverErrors: { sportNev: ['Hiba'] }
    });

    // Ellenőrizzük, hogy látszik-e (mivel serverErrors.sportNev már létezik)
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);

    // Gépelés szimulálása
    await wrapper.find('input').trigger('input');

    // A clearError miatt a serverErrors-ból törlődnie kell a kulcsnak
    expect(wrapper.vm.serverErrors.sportNev).toBeUndefined();
  });
});