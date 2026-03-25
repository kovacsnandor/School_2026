import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ConfirmModal from '@/components/Confirm/ConfirmModal.vue'; // Ellenőrizd az útvonalat!

describe('ConfirmModal.vue', () => {

  it('kiváltja a confirm eseményt az Igen gombra kattintva', async () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        isOpenConfirmModal: true, // KRITIKUS: enélkül üres a HTML a v-if miatt
        confirm: 'Igen'
      }
    });

    // A piros gombot keressük (btn-danger)
    const confirmButton = wrapper.find('.btn-danger');
    
    // Ellenőrizzük, hogy megtaláltuk-e
    expect(confirmButton.exists()).toBe(true);
    
    // Kattintás
    await confirmButton.trigger('click');

    // Itt a Confirm eseményt várjuk!
    expect(wrapper.emitted()).toHaveProperty('confirm');
  });

  it('kiváltja a cancel eseményt a Nem gombra kattintva', async () => {
    const wrapper = mount(ConfirmModal, {
      props: {
        isOpenConfirmModal: true,
        cancel: 'Nem'
      }
    });

    const cancelButton = wrapper.find('.btn-secondary');
    await cancelButton.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('cancel');
  });
});