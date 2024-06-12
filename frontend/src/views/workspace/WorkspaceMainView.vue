<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AxiosPrivate } from "@/api";
import type { UserData, WorkspaceData } from "@/types";
import { Plus, X } from "lucide-vue-next";
import WorkspaceButton from "@/components/workspace/WorkspaceButton.vue";
import BaseInput from "@/components/form/BaseInput.vue";

const user = ref<UserData | null>(null);
const workspaces = ref<WorkspaceData[]>([]);

const toggleCreate = ref(false);
const name = ref("");
const loading = ref(false);

async function createWorkspace() {
  try {
    loading.value = true;
    await AxiosPrivate.post("/workspace/create", { name: name.value });
    toggleCreate.value = false;
    await fetchWorkspaces();
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
}

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
  <div
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center"
    v-if="toggleCreate"
  >
    <div class="relative bg-white p-8 rounded-md w-96">
      <button class="absolute top-4 right-4 text-red-500">
        <X :size="20" @click="toggleCreate = !toggleCreate" />
      </button>
      <h1 class="text-2xl font-semibold mb-4">Create a new workspace</h1>
      <div class="flex flex-col gap-4">
        <BaseInput
          label="Workspace name"
          v-model="name"
          placeholder="Workspace's name"
        />
        <button
          @click="createWorkspace"
          class="bg-red-500 text-white p-2 rounded-md"
        >
          <span v-if="loading">
            <v-progress-circular indeterminate color="white" size="20" />
          </span>
          <span v-else>Create</span>
        </button>
      </div>
    </div>
  </div>
  <div class="p-14">
    <div class="flex justify-between items-center">
      <div>
        <h1 v-if="user" class="text-2xl font-semibold mb-1">
          Welcome {{ user?.firstname }}, Consult your workspaces
        </h1>
        <span class="text-zinc-500"
          >Start with choosing the table you are working on</span
        >
      </div>
      <div>
        <button
          @click="toggleCreate = !toggleCreate"
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
