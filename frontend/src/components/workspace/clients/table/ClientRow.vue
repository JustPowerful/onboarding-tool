<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import Modal from "@/components/templates/Modal.vue";
import type { Client } from "@/types";
import { ChevronDown, Minus, Trash } from "lucide-vue-next";
import { ref } from "vue";

const props = defineProps<{
  client: Client;
  workspaceId: number;
  fetchClients: () => Promise<void>;
}>();
const toggleDelete = ref(false);
async function deleteClient() {
  try {
    await AxiosPrivate.delete(`/client/removeclientfromworkspace`, {
      data: {
        workspaceId: props.workspaceId,
        clientId: props.client.id,
      }
    })
    await props.fetchClients();
    toggleDelete.value = false;
  } catch (error) {
    
  }
}
const toggleStatus = ref(false);
async function updateStatus(status: "DEVELOPMENT" | "REVIEW" | "APPROVED" | "REJECTED") {
  try {
    await AxiosPrivate.patch(`/client/updateclientstatus`, {
      workspaceId: props.workspaceId,
      clientId: props.client.id,
      status
    })
    await props.fetchClients();
    toggleStatus.value = false;
  } catch (error) {
    
  }
}
</script>
<template>
    <Modal :width="400" :show="toggleDelete" @close="toggleDelete = false">
        <div>
            <p class="text-lg font-semibold">Remove client from workspace</p>
            <p class="text-sm">Are you sure you want to remove this client from this workspace?</p>
            <div class="flex justify-end gap-2 mt-4">
                <button class="text-white bg-zinc-500 px-4 py-2 rounded-md" @click="toggleDelete = false">Cancel</button>
                <button class="text-white bg-red-500 px-4 py-2 rounded-md" @click="deleteClient">Delete</button>
            </div>
        </div>
    </Modal>
    <div class="grid grid-cols-3 border-b-2 border-zinc-300 p-2 relative" >
        <button class="text-white bg-red-500 w-6 h-6 flex items-center justify-center rounded-md  absolute top-4 right-4"  @click="toggleDelete = true">
            <Minus  :width="14" />
        </button>
        <div>
          <p class="font-semibold">{{ client.name }}</p>
          <p class="text-sm">{{ client.email }}</p>
        </div>
        <div>
          <p
            class="my-1 flex items-center gap-1"
            v-for="workspace in client.workspaces"
            :key="workspace.id"
          >
            <div class="w-2 h-2 bg-red-500 rounded-full"></div> {{ workspace.workspace.name }}
          </p>
        </div>
        <div @click="toggleStatus = !toggleStatus" class="relative flex items-center   w-fit gap-1 text-zinc-700 select-none cursor-pointer">{{ client.workspaces.filter(workspace => (
          workspace.workspace.id === workspaceId  
        ))[0].status.toLowerCase() }}
        <ChevronDown :width="18"/>  
        <div v-if="toggleStatus" class="absolute top-10 bg-white border-2 border-zinc-400 rounded-md overflow-hidden z-40">
          <button @click.stop="updateStatus('DEVELOPMENT')" class="p-1 w-full hover:bg-red-500 hover:text-white">Development</button>
          <button @click.stop="updateStatus('REVIEW')" class="p-1 w-full hover:bg-red-500 hover:text-white">Review</button>
          <button @click.stop="updateStatus('APPROVED')" class="p-1 w-full hover:bg-red-500 hover:text-white">Approved</button>
          <button @click.stop="updateStatus('REJECTED')" class="p-1 w-full hover:bg-red-500 hover:text-white">Rejected</button>
        </div>
      </div>
    </div>
</template>
