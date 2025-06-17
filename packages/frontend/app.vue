<template>
    <div class="h-screen w-screen flex flex-col p-4 gap-4">
      <header class="flex-shrink-0">
        <h1 class="text-2xl font-bold">File Explorer</h1>
      </header>
      <main class="flex-grow flex gap-4 overflow-hidden">
        <div class="w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto p-4">
          <p v-if="isLoadingTree">Loading Tree...</p>
          <FolderTree v-else :nodes="folderTree" :selected-folder-id="selectedFolderId" @folder-select="handleFolderSelect" />
        </div>
        <div class="w-2/3 lg:w-3/4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto p-4">
          <p v-if="!selectedFolderId" class="text-gray-500">Select a folder to see its contents.</p>
          <p v-else-if="isLoadingContents">Loading Contents...</p>
          <ContentView v-else :nodes="folderContents" />
        </div>
      </main>
    </div>
  </template>
  <script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import type { FsTreeNode, FsContentNode } from '~/types';
    import { ApiService } from '~/services/api';
    const config = useRuntimeConfig();
    const api = new ApiService(config.public.backendUrl);
    const folderTree = ref<FsTreeNode[]>([]);
    const isLoadingTree = ref(true);
    const folderContents = ref<FsContentNode[]>([]);
    const isLoadingContents = ref(false);
    const selectedFolderId = ref<number | null>(null);
    function addUiStateToTree(nodes: any[]): FsTreeNode[] { return nodes.map(node => ({ ...node, isOpen: false, children: node.children ? addUiStateToTree(node.children) : [] })); }
    async function fetchFolderContents(folderId: number) { isLoadingContents.value = true; folderContents.value = await api.getFolderContents(folderId); isLoadingContents.value = false; }
    function handleFolderSelect(folderId: number) { if (selectedFolderId.value !== folderId) { selectedFolderId.value = folderId; fetchFolderContents(folderId); } }
    onMounted(async () => { const treeData = await api.getFolderTree(); folderTree.value = addUiStateToTree(treeData); isLoadingTree.value = false; });
  </script>