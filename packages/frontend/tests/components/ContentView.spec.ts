import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ContentView from '../../components/ContentView.vue'
import type { FsContentNode } from '../../types/index'

// Mock UIcon component
const UIcon = {
  props: ['name', 'class'],
  template: '<i :class="[name, $attrs.class]"></i>'
}

const global = {
  components: {
    UIcon
  }
}

describe('ContentView.vue', () => {
  it('displays "empty" message when no nodes are provided', () => {
    const wrapper = mount(ContentView, {
      props: { nodes: [] },
      global
    })
    
    expect(wrapper.text()).toContain('This folder is empty.')
  })

  it('renders folders and files correctly', () => {
    const mockNodes: FsContentNode[] = [
      { id: 1, name: 'Docs', type: 'folder', parentId: null },
      { id: 2, name: 'img.jpg', type: 'file', parentId: null }
    ]

    const wrapper = mount(ContentView, {
      props: { nodes: mockNodes },
      global
    })

    // Check if both items are rendered
    expect(wrapper.findAll('.flex-col').length).toBe(2)
    
    // Check text content
    expect(wrapper.text()).toContain('Docs')
    expect(wrapper.text()).toContain('img.jpg')

    // Check icons
    const icons = wrapper.findAll('i')
    expect(icons.some(i => i.classes().includes('i-mdi-folder'))).toBe(true)
    expect(icons.some(i => i.classes().includes('i-mdi-file-document-outline'))).toBe(true)
  })
})
