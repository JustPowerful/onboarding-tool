<script setup lang="ts">
import type { WorkspaceData } from "@/types";
import { Ellipsis, Pencil, Save, Table2, Trash, X } from "lucide-vue-next";
import { defineProps, onMounted, onUnmounted, ref } from "vue";
import BaseInput from "../form/BaseInput.vue";
import { AxiosPrivate } from "@/api";
import Modal from "../templates/Modal.vue";

const props = defineProps<{
  workspace: WorkspaceData;
  refresh: () => void;
}>();

const name = ref(props.workspace.name);

const toggleMenu = ref(false);

// menu reference
const menuButtonRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);

const toggleEdit = ref(false);
const toggleDelete = ref(false);

const loading = ref(false);

function onToggleMenu(event: MouseEvent) {
  event.preventDefault();
  toggleMenu.value = !toggleMenu.value;
}

async function onDeleteWorkspace() {
  try {
    loading.value = true;
    await AxiosPrivate.delete(`/workspace/delete/${props.workspace.id}`);
    props.refresh();
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
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

async function saveData() {
  try {
    loading.value = true;
    await AxiosPrivate.patch("/workspace/update", {
      id: props.workspace.id,
      name: name.value,
    });
    props.refresh();
    toggleEdit.value = false;
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <Modal :width="400" :show="toggleEdit" @close="toggleEdit = !toggleEdit">
    <div>
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
  </Modal>
  <Modal
    :width="400"
    :show="toggleDelete"
    @close="toggleDelete = !toggleDelete"
  >
    <div>
      <div class="flex gap-2 items-center">
        <span class="text-red-500"><Trash :size="24" /></span>
        <span class="font-semibold"> Delete: {{ workspace.name }}</span>
      </div>
      <div class="mt-4 mb-2">
        <p>Are you sure you want to delete this workspace?</p>
      </div>
      <button
        @click="onDeleteWorkspace"
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
          ><Trash :size="20" /> Delete</span
        >
      </button>
    </div>
  </Modal>
  <RouterLink :to="`/workspace/${workspace.id}`">
    <div class="relative border-2 border-zinc-200 bg-white rounded-md p-4">
      <div class="absolute top-3 right-4">
        <button ref="menuButtonRef" class="text-zinc-600">
          <span><Ellipsis :size="20" /></span>
        </button>
        <div
          id="menu"
          v-if="toggleMenu"
          ref="menuRef"
          class="absolute w-[150px] left-1/2 -translate-x-1/2 bg-white shadow-md shadow-zinc-300 rounded-md overflow-hidden z-40"
        >
          <button
            @click.prevent="toggleEdit = !toggleEdit"
            class="hover:bg-red-500 hover:text-white w-full text-sm py-1 px-4 flex items-center gap-1"
          >
            <span>
              <Pencil :size="12" />
            </span>
            <span class="">Edit</span>
          </button>
          <button
            @click.prevent="toggleDelete = !toggleDelete"
            class="hover:bg-red-500 hover:text-white w-full text-sm py-1 px-4 flex items-center gap-1"
          >
            <span>
              <Trash :size="12" />
            </span>
            <span class="">Delete</span>
          </button>
        </div>
      </div>
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
