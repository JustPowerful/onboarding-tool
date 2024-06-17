<script setup lang="ts">
import type { ChecklistData } from "@/types";
import draggable from "vuedraggable";
import { Ellipsis, Pencil, Plus, Save, Trash, X } from "lucide-vue-next";
import { defineProps, onMounted, onUnmounted, ref } from "vue";
import Task from "./Task.vue";
import { AxiosPrivate } from "@/api";
import BaseInput from "../form/BaseInput.vue";
const props = defineProps<{
  checklist: ChecklistData;
  updateorder: () => void;
  fetchChecklists: () => Promise<void>;
  disableDragging: () => void;
  enableDragging: () => void;
}>();

const toggleAddTask = ref(false);
const createTaskLoading = ref(false);
const taskName = ref("");

async function createTask() {
  try {
    createTaskLoading.value = true;
    await AxiosPrivate.post(`/task/create`, {
      name: taskName.value,
      checklistId: props.checklist.id,
    });
    await props.fetchChecklists();
  } catch (error) {
    throw error;
  } finally {
    createTaskLoading.value = false;
    toggleAddTask.value = false;
  }
}

const disabledDraggable = ref(false);

const menuButtonRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);
const toggleMenu = ref(false);

const toggleDelete = ref(false);
const deleteLoading = ref(false);

const toggleEdit = ref(false);
const checklistName = ref(props.checklist.name);
const editLoading = ref(false);

async function saveChange() {
  try {
    editLoading.value = true;
    await AxiosPrivate.patch(`/checklist/update`, {
      id: props.checklist.id,
      name: checklistName.value,
    });
    await props.fetchChecklists();
  } catch (error) {
    throw error;
  } finally {
    editLoading.value = false;
    toggleEdit.value = false;
    props.enableDragging();
  }
}

async function deleteChecklist() {
  try {
    deleteLoading.value = true;
    await AxiosPrivate.delete(`/checklist/delete/${props.checklist.id}`);
    await props.fetchChecklists();
  } catch (error) {
    throw error;
  } finally {
    deleteLoading.value = false;
    props.enableDragging();
    toggleDelete.value = false;
  }
}

function onToggleMenu(event: MouseEvent) {
  event.preventDefault();
  toggleMenu.value = !toggleMenu.value;
}

function onClickOutside(event: MouseEvent) {
  if (
    menuRef.value &&
    !menuRef.value.contains(event.target as Node) &&
    menuButtonRef.value &&
    !menuButtonRef.value.contains(event.target as Node)
  ) {
    toggleMenu.value = false;
  }
}

onMounted(() => {
  menuButtonRef.value?.addEventListener("click", onToggleMenu);
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  menuButtonRef.value?.removeEventListener("click", onToggleMenu);
  document.removeEventListener("click", onClickOutside);
});
</script>
<template>
  <div>
    <!-- start: interactive menus -->

    <div
      v-if="toggleEdit"
      class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <div
        class="bg-white w-full max-w-[250px] p-4 flex flex-col gap-2 rounded-md"
      >
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">Edit Checklist</div>
          <button
            @click="
              toggleEdit = false;
              enableDragging();
            "
            class="text-red-500"
          >
            <X :size="20" />
          </button>
        </div>
        <BaseInput
          label="Checklist Name"
          v-model="checklistName"
          placeholder="Checklist Name"
          class="w-full"
        />
        <button
          @click="saveChange"
          :disabled="editLoading"
          class="bg-red-500 text-white p-2 rounded-md disabled:bg-zinc-400 flex items-start justify-center"
        >
          <span v-if="!editLoading" class="flex items-center gap-1">
            <Save :size="16" /> Save
          </span>
          <span v-else>
            <v-progress-circular
              indeterminate
              size="24"
              color="white"
            ></v-progress-circular>
          </span>
        </button>
      </div>
    </div>

    <div
      v-if="toggleDelete"
      class="fixed top-0 left-0 z-50 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="relative bg-white p-4 rounded-md w-[300px]">
        <button
          @click="
            toggleDelete = false;
            enableDragging();
          "
          class="absolute top-4 right-4 text-red-500"
        >
          <X :size="20" />
        </button>
        <div class="text-lg font-semibold mb-4">Delete Checklist</div>
        <div class="mb-4">Are you sure you want to delete this checklist?</div>

        <button
          @click="deleteChecklist"
          class="bg-red-500 text-white p-2 rounded-md w-full"
        >
          <span v-if="deleteLoading">
            <v-progress-circular
              indeterminate
              size="20"
              color="white"
            ></v-progress-circular>
          </span>
          <span v-else class="flex items-center justify-center gap-1"
            ><Trash :size="16" /> Delete</span
          >
        </button>
      </div>
    </div>
    <!--end: interactive menus -->
    <div
      class="relative bg-white border-2 min-w-[240px] min-h-[120px] h-fit p-2 border-zinc-200 rounded-md flex flex-col gap-3"
    >
      <div class="flex justify-between items-center">
        <div>
          {{ props.checklist.name }}
        </div>
        <button ref="menuButtonRef" class="text-red-400">
          <Ellipsis :size="24" />
        </button>
      </div>

      <div
        ref="menuRef"
        v-if="toggleMenu"
        id="toggledMenu"
        class="absolute bg-white top-10 -right-10 flex flex-col w-[150px] shadow-md shadow-zinc-300 rounded-md overflow-hidden"
      >
        <button
          @click="
            toggleDelete = true;
            disableDragging();
          "
          class="py-1 text-sm pl-5 flex gap-1 items-center hover:bg-red-500 hover:text-white"
        >
          <span>
            <Trash :size="12" />
          </span>
          <span>Delete</span>
        </button>
        <button
          @click="
            toggleEdit = true;
            disableDragging();
          "
          class="py-1 text-sm pl-5 flex gap-1 items-center hover:bg-red-500 hover:text-white"
        >
          <span>
            <Pencil :size="12" />
          </span>
          <span>Edit</span>
        </button>
      </div>

      <draggable
        v-model="props.checklist.tasks"
        :group="{ name: 'tasks' }"
        item-key="id"
        tag="div"
        @end="updateorder"
        class="rounded-md flex-grow flex flex-col gap-2"
        ghost-class="drag-task"
        :disabled="disabledDraggable"
      >
        <template #item="{ element: task }">
          <Task
            :fetch-checklists="fetchChecklists"
            :enable-dragging="
              () => {
                disabledDraggable = false;
              }
            "
            :disable-dragging="
              () => {
                disabledDraggable = true;
              }
            "
            :task="task"
          />
        </template>
      </draggable>

      <button
        v-if="!toggleAddTask"
        @click="toggleAddTask = true"
        class="px-4 py-1 rounded-md flex items-center gap-2 text-zinc-500 hover:bg-zinc-400 hover:text-zinc-900"
      >
        <Plus :size="16" /> add a card
      </button>
      <div v-else>
        <BaseInput label="" v-model="taskName" placeholder="Task name" />
        <div class="grid grid-cols-[9fr_2fr] gap-2 mt-1">
          <button
            @click="createTask"
            class="bg-red-500 text-white p-1 rounded-md"
          >
            <span v-if="!createTaskLoading">Add</span>
            <span v-else>
              <v-progress-circular
                indeterminate
                size="24"
                color="white"
              ></v-progress-circular>
            </span>
          </button>
          <button
            class="text-zinc-700 hover:bg-zinc-200 rounded-md flex justify-center items-center"
          >
            <X :size="20" @click="toggleAddTask = false" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.drag-task {
  @apply shadow-md;
}
</style>
