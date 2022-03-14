import { mount } from '@vue/test-utils'
import API from '@/pages/api.vue'

describe('API', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(API)
    expect(wrapper.vm).toBeTruthy()
  })
})
