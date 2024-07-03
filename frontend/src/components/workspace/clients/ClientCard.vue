<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import Modal from "@/components/templates/Modal.vue";
import type { Client } from "@/types";
import { Info, PlusIcon, Trash } from "lucide-vue-next";
import { ref } from "vue";

const props = defineProps<{
  client: Client;
  fetchClients: () => Promise<void>;
  workspaceId: number;
}>();
const toggleDelete = ref(false);
const toggleInfo = ref(false);
async function deleteClient() {
  try {
    const { data } = await AxiosPrivate.delete(
      `/client/delete/${props.client.id}`
    );
    await props.fetchClients();
    toggleDelete.value = false;
  } catch (error) {}
}

async function addClientToWorkspace() {
  try {
    const {} = await AxiosPrivate.post("/client/addclienttoworkspace", {
      clientId: props.client.id,
      workspaceId: props.workspaceId,
    });
    await props.fetchClients();
  } catch (error) {}
}
</script>
<template>
  <Modal
    :width="400"
    :show="toggleDelete"
    @close="toggleDelete = !toggleDelete"
  >
    <div>
      <h1 class="text-2xl font-semibold">Delete Client</h1>
      <p class="mt-2">Are you sure you want to delete this client?</p>
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="toggleDelete = !toggleDelete"
          class="bg-gray-300 text-gray-800 p-2 rounded-md"
        >
          Cancel
        </button>
        <button
          @click="deleteClient"
          class="bg-red-500 text-white p-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  </Modal>
  <Modal :width="400" :show="toggleInfo" @close="toggleInfo = false">
    <div>
      <h2 class="text-2xl font-semibold">Client Information</h2>
      <div class="mt-4">
        <p class="font-semibold">Name:</p>
        <p>{{ client.name }}</p>
      </div>
      <div class="mt-4">
        <p class="font-semibold">Email:</p>
        <p>{{ client.email }}</p>
      </div>
      <div class="mt-4">
        <p class="font-semibold">Phone:</p>
        <p>{{ client.phone }}</p>
      </div>
    </div>
  </Modal>

  <div
    class="font-normal p-4 rounded-md shadow-md flex items-center justify-between"
  >
    <div>
      <p class="font-bold">{{ client.name }}</p>
      <p v-if="client.email" class="text-sm text-zinc-600">
        {{ client.email }}
      </p>
    </div>
    <div class="flex items-center gap-1">
      <button
        @click="addClientToWorkspace"
        class="bg-green-600 text-white p-1 rounded-md"
      >
        <PlusIcon :size="18" />
      </button>
      <button
        @click="toggleInfo = true"
        class="bg-blue-500 text-white p-1 rounded-md"
      >
        <Info :size="18" />
      </button>
      <button
        @click="toggleDelete = true"
        class="bg-red-500 text-white p-1 rounded-md"
      >
        <Trash :size="18" />
      </button>
    </div>
  </div>
</template>
