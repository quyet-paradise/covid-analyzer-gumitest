import { mount } from '@vue/test-utils'
import LineChart from '@/components/LineChart.vue'

describe('LineChart', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(LineChart)
    expect(wrapper.vm).toBeTruthy()
  })
})
