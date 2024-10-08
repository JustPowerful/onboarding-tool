<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import WorkspaceMemberManager from "@/components/workspace/WorkspaceMemberManager.vue";
import TabButton from "@/components/workspace/TabButton.vue";
import BoardTab from "@/components/workspace/tabs/BoardTab.vue";
import type { WorkspaceData, WorkspaceTab } from "@/types";
import {
  ChevronRight,
  Settings,
  Table2,
  User,
  UserPlus,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SettingsTab from "@/components/workspace/tabs/SettingsTab.vue";
import ClientsTab from "@/components/workspace/tabs/ClientsTab.vue";
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
    <div
      class="text-2xl font-medium flex gap-4 items-center justify-between p-6 border-2"
    >
      <div class="flex items-center justify-center gap-2">
        <div class="border-2 border-zinc-300 p-2 rounded-md">
          <Table2 :size="24" />
        </div>
        <div class="flex items-center" v-if="workspace">
          <div>
            <RouterLink
              class="text-zinc-800 block font-semibold hover:text-red-500"
              to="/workspaces"
              >Workspaces</RouterLink
            >
          </div>
          <ChevronRight :size="26" />
          <div class="font-normal">{{ workspace.name }}</div>
        </div>
      </div>
      <!-- member manager menu -->
      <WorkspaceMemberManager :workspace-id="workspaceId" />
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
      <div class="relative">
        <div v-if="tab === 'BOARD'">
          <BoardTab v-if="workspace" :workspaceId="workspaceId" />
        </div>
        <div v-if="tab === 'SETTINGS'">
          <SettingsTab
            :workspace-id="workspaceId"
            :refresh-workspace="getWorkspace"
          />
        </div>
        <div v-if="tab === 'CLIENTS'">
          <ClientsTab
            :workspace-id="workspaceId"
            :refresh-workspace="getWorkspace"
          />
        </div>
      </div>
    </div>
  </div>
</template>
