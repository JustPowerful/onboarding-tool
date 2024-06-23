<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import type { UserData } from "@/types";
import { UserCheck, X } from "lucide-vue-next";
import { ref, defineProps, watch, type Component } from "vue";
import AssignementCard from "./AssignementCard.vue";
import Paginator from "primevue/paginator";

const props = defineProps<{
  workspaceId: number;
  taskId: number;
  fetchChecklists: () => Promise<void>;
  refreshMemberPreview: () => void;
}>();

const toggle = ref(false);
const first = ref(0);
const rows = ref(1);
const search = ref("");
const members = ref<UserData[]>([]);
const totalUsers = ref(1);

async function fetchUnassigned() {
  try {
    props.refreshMemberPreview();
    const { data } = await AxiosPrivate.get(
      `/task/getunassignedmembers?search=${search.value}&page=${Math.floor(
        first.value / rows.value
      )}&workspaceId=${props.workspaceId}&taskId=${props.taskId}`
    );
    members.value = data.members;
    rows.value = data.rowsPerPage;
    totalUsers.value = data.totalUsers;
  } catch (error) {}
}

async function fetchAssignedMembers() {
  try {
    props.refreshMemberPreview();
    const { data } = await AxiosPrivate.get(
      `/task/getassignements?search=${search.value}&page=${Math.floor(
        first.value / rows.value
      )}&workspaceId=${props.workspaceId}&taskId=${props.taskId}`
    );
    members.value = data.members;
    rows.value = data.rowsPerPage;
    totalUsers.value = data.totalUsers;
  } catch (error) {}
}

watch(
  () => toggle.value,
  () => {
    if (toggle.value === true) {
      tab.value = 0;
    }
    fetchUnassigned();
  }
);

const tab = ref(0);
watch(
  () => tab.value,
  () => {
    first.value = 0;
    if (tab.value === 0) {
      fetchUnassigned();
    } else {
      fetchAssignedMembers();
    }
  }
);

watch(
  () => first.value,
  () => {
    if (tab.value === 0) {
      fetchUnassigned();
    } else {
      fetchAssignedMembers();
    }
  }
);
</script>
<template>
  <button v-bind="$attrs" @click="toggle = !toggle"><slot /></button>
  <div
    v-if="toggle"
    class="fixed top-0 left-0 bg-black bg-opacity-50 w-full h-screen z-50 flex justify-center items-center"
  >
    <div
      class="relative w-full max-w-[400px] bg-white p-3 rounded-md flex flex-col"
    >
      <!-- close buton -->
      <button
        @click="toggle = !toggle"
        class="absolute top-2 right-2 p-2 hover:bg-zinc-300 text-red-500 rounded-full"
      >
        <X :size="18" />
      </button>
      <div class="text-lg font-bold flex items-center gap-1">
        <UserCheck :size="18" />
        Assignments
      </div>
      <div class="flex gap-1">
        <button
          @click="tab = 0"
          :class="`border-b w-full py-2 text-left ${
            tab === 0 ? 'border-red-500 text-red-500' : ''
          }`"
        >
          All users
        </button>
        <button
          @click="tab = 1"
          :class="`border-b w-full py-2 text-left ${
            tab === 1 ? 'border-red-500 text-red-500' : ''
          }`"
        >
          Assigned Members
        </button>
      </div>
      <div v-if="tab === 0">
        <!-- All users -->
        <div v-for="member in members">
          <AssignementCard
            :fetch-checklists="fetchChecklists"
            :task-id="taskId"
            :fetch-unassigned="fetchUnassigned"
            :fetch-assigned-members="fetchAssignedMembers"
            :is-assigned="false"
            :member="member"
          />
        </div>
      </div>
      <div v-else>
        <!-- Assigned Members -->
        <div v-for="member in members">
          <AssignementCard
            :fetch-checklists="fetchChecklists"
            :task-id="taskId"
            :fetch-unassigned="fetchUnassigned"
            :fetch-assigned-members="fetchAssignedMembers"
            :is-assigned="true"
            :member="member"
          />
        </div>
      </div>
      <Paginator
        v-model:first="first"
        :totalRecords="totalUsers"
        :rows="rows"
      />
      <!-- <Paginator v-model:rows="rows" v-model:first="first" /> -->
    </div>
  </div>
</template>
