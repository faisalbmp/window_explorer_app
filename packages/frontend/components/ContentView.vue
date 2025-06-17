<template>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-if="!nodes.length" class="col-span-full text-center text-gray-500 py-10">This folder is empty.</div>
      <div v-for="node in nodes" :key="node.id" class="flex flex-col items-center p-4 rounded-lg">
        <UIcon :name="getIconName(node.type)" class="w-12 h-12 mb-2" :class="node.type === 'folder' ? 'text-yellow-500' : 'text-gray-400'" />
        <span class="text-sm text-center break-all">{{ node.name }}</span>
      </div>
    </div>
  </template>
  <script setup lang="ts">
    import type { FsContentNode } from '~/types';
    defineProps<{ nodes: FsContentNode[] }>();
    const getIconName = (type: string) => type === 'folder' ? 'i-mdi-folder' : 'i-mdi-file-document-outline';
  </script>