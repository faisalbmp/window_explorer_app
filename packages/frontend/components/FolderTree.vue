<template>
    <ul class="space-y-1">
      <li v-for="node in nodes" :key="node.id">
        <div @click.stop="toggleFolder(node)" class="flex items-center p-2 rounded-md cursor-pointer" :class="{ 'bg-blue-100 dark:bg-blue-900': selectedFolderId === node.id }">
          <UIcon v-if="node.children.length > 0" name="i-heroicons-chevron-right-20-solid" class="w-5 h-5 mr-1" :class="{ 'rotate-90': node.isOpen }" />
          <div v-else class="w-5 h-5 mr-1"></div>
          <UIcon :name="node.isOpen ? 'i-heroicons-folder-open-solid' : 'i-heroicons-folder-solid'" class="w-5 h-5 mr-2" />
          <span>{{ node.name }}</span>
        </div>
        <div v-if="node.isOpen && node.children.length > 0" class="ml-4 border-l-2">
          <FolderTree :nodes="node.children" :selected-folder-id="selectedFolderId" @folder-select="emitSelect" />
        </div>
      </li>
    </ul>
  </template>
  <script setup lang="ts">
  import type { FsTreeNode } from '~/types';
  const props = defineProps<{ nodes: FsTreeNode[]; selectedFolderId: number | null; }>();
  const emit = defineEmits<{ (e: 'folder-select', id: number): void }>();
  function toggleFolder(node: FsTreeNode) { if (node.children.length > 0) node.isOpen = !node.isOpen; emitSelect(node.id); }
  function emitSelect(id: number) { emit('folder-select', id); }
  </script>