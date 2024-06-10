<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AxiosPrivate } from "@/api";
import type { UserData, WorkspaceData } from "@/types";
import { Plus } from "lucide-vue-next";
import WorkspaceButton from "@/components/workspace/WorkspaceButton.vue";

const user = ref<UserData | null>(null);
const workspaces = ref<WorkspaceData[]>([]);

async function fetchUser() {
  try {
    const { data } = await AxiosPrivate.get("/auth/me");
    user.value = data;
  } catch (error) {
    throw error;
  }
}

async function fetchWorkspaces() {
  try {
    const { data } = await AxiosPrivate.get("/workspace/getall");
    workspaces.value = data.workspaces;
  } catch (error) {
    throw error;
  }
}

onMounted(async () => {
  await fetchUser();
  await fetchWorkspaces();
});
</script>
<template>
  <div class="p-14">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold mb-1">
          Welcome {{ user?.firstname }}, Consult your workspaces
        </h1>
        <span class="text-zinc-500"
          >Start with choosing the table you are working on</span
        >
      </div>
      <div>
        <button
          class="bg-red-500 text-white flex items-center gap-1 p-2 rounded-md"
        >
          New workspace <Plus :size="18" />
        </button>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-3 gap-4 mt-8">
        <WorkspaceButton
          :refresh="fetchWorkspaces"
          v-for="workspace in workspaces"
          :key="workspace.id"
          :workspace="workspace"
        />
      </div>
    </div>
  </div>
</template>
