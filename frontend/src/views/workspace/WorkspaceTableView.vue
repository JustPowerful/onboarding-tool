<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import TabButton from "@/components/workspace/TabButton.vue";
import type { WorkspaceData, WorkspaceTab } from "@/types";
import { Settings, Table2, User } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

const workspaceId = Number(route.params.id);
const tab = ref<WorkspaceTab>("BOARD");

// data
const workspace = ref<WorkspaceData | null>(null);

async function getWorkspace() {
  try {
    const { data } = await AxiosPrivate.get(`/workspace/get/${workspaceId}`);
    workspace.value = data.workspace;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await getWorkspace();
});
</script>
<template>
  <!-- make the div take the height of (screen - 14 of tailwinds mesurement) -->
  <div class="h-[calc(100vh-3.5rem)] grid grid-rows-[1fr_9fr]">
    <div class="text-2xl font-semibold flex gap-4 items-center p-6 border-2">
      <div class="border-2 border-zinc-300 p-2 rounded-md">
        <Table2 :size="24" />
      </div>
      <div v-if="workspace">{{ workspace.name }}</div>
    </div>
    <div class="grid grid-cols-[1.5fr_9fr]">
      <div class="bg-white border-r-2 border-r-zinc-300">
        <div class="w-full flex flex-col">
          <TabButton
            :icon="Table2"
            :tab="tab"
            targetTab="BOARD"
            :set-tab="() => (tab = 'BOARD')"
          />
          <TabButton
            :icon="User"
            :tab="tab"
            targetTab="CLIENTS"
            :set-tab="() => (tab = 'CLIENTS')"
          />
          <TabButton
            :icon="Settings"
            :tab="tab"
            targetTab="SETTINGS"
            :set-tab="() => (tab = 'SETTINGS')"
          />
        </div>
        <div class="w-full"></div>
      </div>
      <div class="bg-zinc-200"></div>
    </div>
  </div>
</template>
