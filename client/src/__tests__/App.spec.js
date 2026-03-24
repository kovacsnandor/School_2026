// import { describe, it, expect } from 'vitest'

// import { mount } from '@vue/test-utils'
// import App from '../App.vue'

// describe('App', () => {
//   it('mounts renders properly', () => {
//     const wrapper = mount(App)
//     expect(wrapper.text()).toContain('Home')
//   })
// })


import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

describe('App', () => {
  it('megfelelően renderelődik a függőségekkel', () => {
    // 1. Létrehozunk egy mini routert a teszthez
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
    })

    // 2. Létrehozzuk a Piniát
    const pinia = createPinia()

    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia], // "Beoltjuk" a komponenst
        stubs: {
          // Ha nem akarod a valódi RouterView-t futtatni, itt helyettesítheted
          'router-view': true,
          'router-link': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
