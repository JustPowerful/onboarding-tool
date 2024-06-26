<script setup lang="ts">
// import the library that can help me get the URL params
import { AxiosPrivate } from "@/api";
import BaseInput from "@/components/form/BaseInput.vue";
import ProposalCard from "@/components/proposal/ProposalCard.vue";
import type { Proposal, TaskData, UserData, WorkspaceData } from "@/types";
import { ChevronRight, Table2, X } from "lucide-vue-next";
import Editor from "primevue/editor";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ProposalModal from "./ProposalModal.vue";
import Paginator from "primevue/paginator";
const params = useRoute().params;
const workspace = ref<WorkspaceData | null>(null);
const taskId = params.id;
const task = ref<TaskData | null>(null);
const proposals = ref<Proposal[]>([]);
const toggleCreateModal = ref(false); // toggle the create modal

const name = ref("");
const description = ref("");
const stack = ref("");

async function fetchTask() {
  try {
    const { data } = await AxiosPrivate.get(`/task/gettaskbyid/${taskId}`);
    console.log(data);
    const { data: workspaceData } = await AxiosPrivate.get(
      "/workspace/get/" + data.task.checklist.workspaceId
    );
    workspace.value = workspaceData.workspace;
    // set the task data
    task.value = data.task;
  } catch (error) {
    throw error;
  }
}

const first = ref(0);
const rowsPerPage = ref(5);
const totalRecords = ref(0);
async function fetchProposals() {
  try {
    const { data } = await AxiosPrivate.get(
      `/proposal/paginate?taskId=${taskId}&page=${Math.floor(
        first.value / rowsPerPage.value
      )}`
    );
    // set the proposals data
    proposals.value = data.proposals;
    totalRecords.value = data.totalProposals;
    rowsPerPage.value = data.rowsPerPage;
  } catch (error) {
    throw error;
  }
}

watch(
  () => first.value,
  () => {
    fetchProposals();
  }
);

const user = ref<UserData | null>(null);
async function fetchCurrentUser() {
  try {
    const { data } = await AxiosPrivate.get("/auth/me");
    user.value = data;
  } catch (error) {}
}

async function createProposal() {
  try {
    await AxiosPrivate.post("/proposal/create", {
      name: name.value,
      description: description.value,
      stack: stack.value,
      taskId: taskId,
    });
    fetchProposals();
    toggleCreateModal.value = false;
  } catch (error) {}
}

onMounted(() => {
  fetchTask();
  fetchProposals();
  fetchCurrentUser();
});
</script>
<template>
  <!-- the proposition creation modal -->
  <div
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center"
    v-if="toggleCreateModal"
  >
    <div class="relative bg-white p-6 w-full max-w-[800px] rounded-md">
      <div class="flex justify-end">
        <button
          @click.prevent="toggleCreateModal = !toggleCreateModal"
          class="absolute top-2 right-2 text-red-500 p-2 rounded-full hover:bg-zinc-300"
        >
          <X />
        </button>
      </div>
      <div class="text-lg font-bold">Create a new solution proposal</div>
      <div class="mt-4">
        <BaseInput
          v-model="name"
          placeholder="Title of the solution proposal"
          label="Title of the solution proposal"
        />
      </div>
      <div class="mt-4">
        <label class="text-sm text-black font-semibold">Description</label>
        <Editor
          v-model="description"
          editorStyle="height: 100px"
          placeholder="The solution's description goes here..."
        />
      </div>
      <div class="mt-4">
        <BaseInput
          v-model="stack"
          placeholder="Stack"
          label="Stack (optional)"
        />
      </div>

      <div class="mt-4">
        <button
          @click="createProposal"
          class="w-full bg-red-500 text-white p-2 rounded-md"
        >
          Create
        </button>
      </div>
    </div>
  </div>
  <!-- the page -->

  <div class="p-4">
    <div class="text-2xl flex items-center gap-2">
      <div class="border-2 border-zinc-300 p-2 rounded-md">
        <Table2 :size="24" />
      </div>
      <div class="flex items-center" v-if="workspace">
        <div>
          <RouterLink
            class="text-zinc-800 block font-semibold hover:text-red-500"
            to="/workspaces"
            >Workspaces</RouterLink
          >
        </div>
        <ChevronRight :size="26" />
        <div>
          <RouterLink
            class="text-zinc-800 block font-semibold hover:text-red-500"
            :to="`/workspace/${workspace.id}`"
            >{{ workspace.name }}</RouterLink
          >
        </div>
        <ChevronRight :size="26" />
        <div>
          {{ task.name }}
        </div>
      </div>
    </div>
    <div class="flex justify-end my-2">
      <!-- create modal  button place -->
      <ProposalModal
        v-if="task && user"
        :user="user"
        :task="task"
        :class="`bg-red-500 text-white p-2 rounded-md cursor-pointer`"
        :editMode="false"
        :fetchProposals="fetchProposals"
      >
        Create a new solution proposal
      </ProposalModal>
    </div>
    <div class="mt-4 flex flex-col items-center gap-4">
      <ProposalCard
        v-if="user && task"
        v-for="proposal in proposals"
        :key="proposal.id"
        :proposal="proposal"
        :user="user"
        :task="task"
        :fetchProposals="fetchProposals"
      />
    </div>
  </div>
  <Paginator
    v-model:first="first"
    :totalRecords="totalRecords"
    :rows="rowsPerPage"
  />
</template>
