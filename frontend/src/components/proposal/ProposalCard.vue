<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import type { Proposal, TaskData, UserData } from "@/types";
import ProposalModal from "@/views/proposals/ProposalModal.vue";
import { Edit, Trash, X } from "lucide-vue-next";
import { ref } from "vue";
import { defineProps } from "vue";
const props = defineProps<{
  proposal: Proposal;
  user: UserData;
  fetchProposals: () => Promise<void>;
  task: TaskData;
}>();

const toggleDelete = ref(false);
async function deleteProposal() {
  try {
    await AxiosPrivate.delete(`/proposal/delete/${props.proposal.id}`);
    await props.fetchProposals();
  } catch (error) {
    throw error;
  }
}

const toggleWideView = ref(false);
const TEXT_LENGTH = 100;
function trunc(text: string, length: number) {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

// function to parse text from markdown for generating a preview
function parseTextFromMarkDown(htmlString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);

  let text = "";
  let currentNode = walker.currentNode;

  while (currentNode) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      text += currentNode.nodeValue;
    }
    currentNode = walker.nextNode()!;
  }

  return text;
}
</script>
<template>
  <div
    v-if="toggleWideView"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-[35] flex items-center justify-center"
  >
    <div
      class="relative bg-white p-4 rounded-md w-full max-w-[700px] flex flex-col gap-4 max-h-[80vh] overflow-y-scroll"
    >
      <button
        class="absolute top-3 right-3 text-red-500 hover:bg-zinc-200 p-2 rounded-full"
      >
        <X :size="24" @click="toggleWideView = !toggleWideView" />
      </button>
      <div>
        <p class="text-sm font-bold text-zinc-700">Solution title</p>
        <h1 class="text-xl font-semibold">{{ props.proposal.name }}</h1>
      </div>
      <div>
        <p class="text-sm font-bold text-zinc-700">Description</p>
        <div v-html="props.proposal.description"></div>
      </div>
      <div class="grid grid-cols-3">
        <div>
          <p class="text-sm font-bold text-zinc-700">Proposer</p>
          <p>
            {{ props.proposal.user.firstname }}
            {{ props.proposal.user.lastname }}
          </p>
        </div>
        <div>
          <p class="text-sm font-bold text-zinc-700">Status</p>
          <p>{{ props.proposal.status }}</p>
        </div>
        <div>
          <p class="text-sm font-bold text-zinc-700">Stack</p>
          <p>{{ props.proposal.stack }}</p>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="toggleDelete"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div class="relative w-full max-w-[700px] bg-white p-4 rounded-md">
      <div class="flex justify-end">
        <button
          @click="toggleDelete = false"
          class="absolute top-3 right-3 text-red-500 hover:bg-zinc-200 p-2 rounded-full"
        >
          <X :size="24" />
        </button>
      </div>
      <div class="text-lg font-bold">Delete solution proposal</div>
      <div class="">
        <p>Are you sure you want to delete this solution proposal?</p>
      </div>
      <div class="flex justify-end gap-4">
        <button
          @click="toggleDelete = false"
          class="bg-zinc-500 text-white p-2 rounded-md"
        >
          Cancel
        </button>
        <button
          @click="deleteProposal()"
          class="bg-red-500 text-white p-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  </div>

  <div
    class="relative w-full max-w-[800px] flex flex-col gap-1 bg-white shadow-md shadow-zinc-500 p-6 rounded-md"
  >
    <div class="absolute top-3 right-3 flex gap-2">
      <ProposalModal
        :task="props.task"
        :proposal="props.proposal"
        :user="props.user"
        :editMode="true"
        :fetchProposals="fetchProposals"
        class="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md cursor-pointer"
      >
        <Edit :size="18" />
      </ProposalModal>
      <button
        @click.stop="toggleDelete = true"
        v-if="
          (user.role === 'MANAGER' || proposal.userId === user.id) &&
          proposal.status === 'PENDING'
        "
        class=""
      >
        <Trash
          :size="26"
          class="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md cursor-pointer"
        />
      </button>
    </div>

    <div>
      <p class="text-sm text-zinc-500 font-bold">solution title</p>
      <p>{{ props.proposal.name }}</p>
    </div>
    <div>
      <p class="text-sm text-zinc-500 font-bold">description</p>
      {{
        trunc(parseTextFromMarkDown(props.proposal.description), TEXT_LENGTH)
      }}
      <span
        @click="toggleWideView = true"
        v-if="proposal.description.length > TEXT_LENGTH"
        class="text-blue-500 cursor-pointer"
        >read more</span
      >
    </div>
    <div class="grid grid-cols-3">
      <div>
        <p class="text-sm font-bold text-zinc-500">Proposer</p>
        {{ proposal.user.firstname }} {{ proposal.user.lastname }}
      </div>
      <div>
        <p class="text-sm font-bold text-zinc-500">Status</p>
        {{ proposal.status.toLowerCase() }}
      </div>
      <div>
        <p class="text-sm font-bold text-zinc-500">Stack</p>
        {{ proposal.stack }}
      </div>
    </div>
    <div class="flex justify-center">
      <button
        @click="toggleWideView = true"
        class="text-blue-500 hover:bg-zinc-300 p-1 rounded-md w-fit"
      >
        View details
      </button>
    </div>
  </div>
</template>
