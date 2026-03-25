import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomModal from '@/components/Modal/Modal.vue'; // Ellenőrizd az utat!

// 1. LÉPÉS: A Bootstrap mockolása
// A Bootstrap mockolása valódi függvényként/osztályként
vi.mock('bootstrap', () => {
  return {
    Modal: vi.fn().mockImplementation(function() {
      return {
        show: vi.fn(),
        hide: vi.fn()
      };
    })
  };
});

describe('Modal.vue tesztek', () => {
  
  // 2. LÉPÉS: A natív form-validation mockolása (Node-ban nincs checkValidity)
  const mountModal = (props = {}) => {
    return mount(CustomModal, {
      props: {
        title: 'Teszt Modal',
        yes: 'Mentés',
        no: 'Mégsem',
        ...props
      },
      global: {
        // Segítünk a Vue-nak, hogy ne akadjon fent a natív form metódusokon
        config: {
          globalProperties: {
            checkValidity: () => true
          }
        }
      }
    });
  };

  it('megjeleníti a helyes szövegeket (title, yes, no)', () => {
    const wrapper = mountModal();
    
    expect(wrapper.find('.modal-title').text()).toBe('Teszt Modal');
    expect(wrapper.find('button.btn-danger').text()).toBe('Mentés');
    expect(wrapper.find('button.btn-primary').text()).toBe('Mégsem');
  });

  it('alkalmazza a megfelelő méret osztályt', () => {
    const wrapper = mountModal({ modalSize: 'lg' });
    const dialog = wrapper.find('.modal-dialog');
    
    expect(dialog.classes()).toContain('modal-lg');
  });

  it('nem küld eseményt, ha a form validáció elbukik', async () => {
    const wrapper = mountModal();
    
    // Szimuláljuk a checkValidity-t: hibás az űrlap
    const mockEvent = {
      target: { checkValidity: () => false },
      preventDefault: vi.fn()
    };

    await wrapper.vm.onClickYes(mockEvent);

    expect(wrapper.emitted('yesEvent')).toBeUndefined();
    expect(wrapper.vm.validated).toBe(true);
  });

  it('kiváltja a yesEvent-et, ha az űrlap érvényes', async () => {
    const wrapper = mountModal();
    
    // Szimuláljuk a sikeres validációt
    const mockEvent = {
      target: { checkValidity: () => true },
      preventDefault: vi.fn()
    };

    await wrapper.vm.onClickYes(mockEvent);

    expect(wrapper.emitted()).toHaveProperty('yesEvent');
    // Ellenőrizzük, hogy kaptunk-e callback függvényt (a (success) => { ... } rész)
    expect(typeof wrapper.emitted().yesEvent[0][0]).toBe('function');
  });

  it('bezáródik, ha a callback sikeres (success: true)', async () => {
    const wrapper = mountModal();
    
    // Elérjük a belső modal példányt, amit mockoltunk
    const hideSpy = vi.spyOn(wrapper.vm.modal, 'hide');

    const mockEvent = {
      target: { checkValidity: () => true },
      preventDefault: vi.fn()
    };

    await wrapper.vm.onClickYes(mockEvent);

    // Meghívjuk az emitált callbacket true-val (mintha a szülő sikeresen mentett volna)
    const callback = wrapper.emitted().yesEvent[0][0];
    callback(true);

    expect(hideSpy).toHaveBeenCalled();
  });
});