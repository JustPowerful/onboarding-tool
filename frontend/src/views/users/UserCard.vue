<script setup lang="ts">
import type { UserData } from "@/types";
import { Contact, Crown, Handshake, Trash } from "lucide-vue-next";
import { ref } from "vue";

const props = defineProps<{
  member: UserData;
}>();
const toggleDelete = ref(false);
async function deleteUser() {}
</script>
<template>
  <!-- delete modal -->
  <div
    v-if="toggleDelete"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div class="relative w-full max-w-[700px] p-6 bg-white rounded-md">
      <button
        @click="toggleDelete = false"
        class="absolute top-3 right-3 text-red-500 p-2 hover:bg-zinc-300 rounded-full"
      >
        <XIcon size="24" />
      </button>
      <h1 class="text-2xl font-semibold text-zinc-700">Delete user</h1>
      <p class="text-zinc-600">Are you sure you want to delete this user?</p>
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="deleteUser"
          class="bg-red-500 text-white p-2 rounded-md"
        >
          Delete
        </button>
        <button
          @click="toggleDelete = false"
          class="bg-zinc-500 text-white p-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div
    class="bg-white shadow-md shadow-zinc-200 p-2 rounded-md flex justify-between"
  >
    <div class="flex items-center gap-2">
      <div>
        <div
          v-if="member.role === 'MANAGER'"
          class="bg-yellow-500 text-white w-fit p-1 rounded-md text-sm flex items-center gap-1"
        >
          <Crown :size="16" /> Manager
        </div>
        <div
          v-if="member.role === 'CLIENT'"
          class="bg-zinc-600 text-white w-fit p-1 rounded-md text-sm flex items-center gap-1"
        >
          <Handshake :size="16" /> CLIENT
        </div>
        <div
          v-if="member.role === 'EMPLOYEE'"
          class="bg-red-400 text-white w-fit p-1 rounded-md text-sm flex items-center gap-1"
        >
          <Contact :size="16" /> EMPLOYEE
        </div>
      </div>
      {{ member.firstname }} {{ member.lastname }}
    </div>
    <div>
      <button
        @click="toggleDelete = !toggleDelete"
        class="bg-red-500 text-white p-1 rounded-md"
      >
        <Trash :size="18" />
      </button>
    </div>
  </div>
</template>
