<script setup lang="ts">
import type { WorkspaceData } from "@/types";
import { Ellipsis, Save, Table2, X } from "lucide-vue-next";
import { defineProps, ref, toRef } from "vue";
import BaseInput from "../form/BaseInput.vue";
import { AxiosPrivate } from "@/api";

const props = defineProps<{
  workspace: WorkspaceData;
  refresh: () => void;
}>();

const toggle = ref(false);
const loading = ref(false);

// create a ref assign the workspace.name to it from the prop
const name = ref(props.workspace.name);

async function saveData() {
  try {
    loading.value = true;
    await AxiosPrivate.patch("/workspace/update", {
      id: props.workspace.id,
      name: name.value,
    });
    props.refresh();
    toggle.value = false;
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div
    v-if="toggle"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div class="w-[300px] bg-white p-4 rounded-md relative">
      <button class="absolute top-2 right-2 text-red-500">
        <X :size="20" @click="toggle = !toggle" />
      </button>
      <div class="flex gap-2 items-center">
        <span class="text-red-500"><Table2 :size="24" /></span>
        <span class="font-semibold"> Edit: {{ workspace.name }}</span>
      </div>
      <div class="mt-4 mb-2">
        <BaseInput label="name" placeholder="Workspace's name" v-model="name" />
      </div>
      <button
        @click="saveData"
        class="text-white bg-red-500 p-2 w-full rounded-md hover:bg-red-700 flex items-center justify-center gap-1"
      >
        <span v-if="loading">
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="20"
            color="red"
          />
        </span>
        <span class="flex gap-1 items-center" v-else
          ><Save :size="20" /> Save</span
        >
      </button>
    </div>
  </div>
  <RouterLink :to="`/workspace/${workspace.id}`">
    <div class="relative border-2 border-zinc-200 rounded-md p-4">
      <button
        @click.prevent="toggle = !toggle"
        class="absolute text-zinc-600 top-3 right-4"
      >
        <span><Ellipsis :size="20" /></span>
      </button>
      <!-- <h2 class="text-lg font-semibold">{{ workspace.name }}</h2> -->
      <div class="flex items-center gap-4 mb-2">
        <span class="text-red-500"><Table2 :size="24" /></span>
        <span class="font-semibold">{{ workspace.name }}</span>
      </div>
      <div class="text-zinc-500">22 Clients</div>
      <!-- this needs to be changed later to display dynamically -->
    </div>
  </RouterLink>
</template>
