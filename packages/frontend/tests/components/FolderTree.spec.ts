import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import FolderTree from '~/components/FolderTree.vue'
import type { FsTreeNode } from '~/types/index'

const UIcon = { props: ['name'], template: '<i :class="[name, $attrs.class]"></i>' }
const global = { components: { UIcon, FolderTree } }

describe('FolderTree.vue', () => {
    const mockTree: FsTreeNode[] = [
        { id: 1, name: 'Documents', parentId: null, isOpen: false, children: [
            { id: 2, name: 'Work', parentId: 1, isOpen: false, children: [] }
        ]},
        { id: 3, name: 'Pictures', parentId: null, isOpen: false, children: [] }
    ];

    it('renders the root nodes', () => {
        const wrapper = mount(FolderTree, { props: { nodes: mockTree, selectedFolderId: null }, global });
        expect(wrapper.text()).toContain('Documents');
        expect(wrapper.text()).toContain('Pictures');
        // Child should not be visible initially
        expect(wrapper.text()).not.toContain('Work');
    });

    it('expands a folder and shows children on click', async () => {
        const wrapper = mount(FolderTree, { props: { nodes: mockTree, selectedFolderId: null }, global });
        const documentsFolder = wrapper.findAll('li').find(li => li.text().includes('Documents'));
        
        await documentsFolder?.find('.flex.items-center').trigger('click');

        // Now the child "Work" should be visible
        expect(wrapper.text()).toContain('Work');
    });

    it('emits a folder-select event with the correct ID on click', async () => {
        const wrapper = mount(FolderTree, { props: { nodes: mockTree, selectedFolderId: null }, global });
        const picturesFolder = wrapper.findAll('li').find(li => li.text().includes('Pictures'));

        await picturesFolder?.find('.flex.items-center').trigger('click');

        // Check emitted event
        const selectEvents = wrapper.emitted('folder-select');
        expect(selectEvents).toHaveLength(1);
        expect(selectEvents?.[0]).toEqual([3]); // ID of Pictures folder
    });
});