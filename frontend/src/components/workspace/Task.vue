<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import type { TaskData } from "@/types";
import { Ellipsis, LayoutList, Save, X } from "lucide-vue-next";
import { defineProps, ref } from "vue";
import BaseInput from "../form/BaseInput.vue";

const props = defineProps<{
  task: TaskData;
  fetchChecklists: () => Promise<void>;
  disableDragging: () => void;
  enableDragging: () => void;
}>();

const toggleTaskMenu = ref(false);

const name = ref(props.task.name);
const description = ref(props.task.description);

async function deleteTask() {
  try {
    await AxiosPrivate.delete(`/task/delete/${props.task.id}`);
    await props.fetchChecklists();
  } catch (error) {
    throw error;
  }
}
</script>
<template>
  <div>
    <!-- task menu  -->
    <div
      v-if="toggleTaskMenu"
      class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div class="relative w-full max-w-[300px] bg-white rounded-md p-4">
        <button
          @click="
            toggleTaskMenu = false;
            enableDragging();
          "
          class="absolute top-3 right-3 text-red-500"
        >
          <X :size="21" />
        </button>
        <div class="flex gap-1 items-center text-xl mb-3">
          <span>
            <LayoutList :size="18" />
          </span>
          <span>{{ task.name }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <BaseInput
            label="Task name"
            placeholder="Give the task a name..."
            v-model="name"
          />
          <div>
            <label for=""></label>
            <textarea
              v-model="description"
              placeholder="Give the task a description..."
              class="w-full p-2 border border-zinc-400 rounded-md focus:outline-red-400"
            ></textarea>
          </div>
          <button
            class="flex items-center justify-center gap-1 text-white bg-red-500 p-2 rounded-md"
          >
            <span>
              <Save :size="18" />
            </span>
            <span>Update</span>
          </button>
        </div>
      </div>
    </div>

    <!-- task -->
    <div
      @click="
        toggleTaskMenu = true;
        disableDragging();
      "
      class="bg-white p-2 border-2 border-zinc-200 rounded-md flex justify-between"
    >
      <div>{{ props.task.name }}</div>
      <div class="text-zinc-500">
        <Ellipsis :size="21" />
      </div>
    </div>
  </div>
</template>
