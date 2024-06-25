<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import BaseInput from "@/components/form/BaseInput.vue";
import type { Proposal, TaskData, UserData } from "@/types";
import { X } from "lucide-vue-next";
import Editor from "primevue/editor";
import { ref, watch } from "vue";

const props = defineProps<{
  proposal?: Proposal;
  user: UserData;
  task: TaskData;
  editMode: boolean;
  class: string;
  editOpened?: boolean;
  fetchProposals: () => Promise<void>;
}>();

const name = ref(props.proposal?.name || "");
const description = ref(props.proposal?.description || "");
const stack = ref(props.proposal?.stack || "");
const toggleCreateModal = ref(false);
async function createProposal() {
  try {
    await AxiosPrivate.post("/proposal/create", {
      name: name.value,
      description: description.value,
      stack: stack.value,
      taskId: props.task.id,
    });
    props.fetchProposals();
    toggleCreateModal.value = false;
  } catch (error) {}
}
// [TODO]: Add the ability to edit a proposal
async function updateProposal() {
  try {
    await AxiosPrivate.patch(`/proposal/update`, {
      id: props.proposal?.id,
      name: name.value,
      description: description.value,
      stack: stack.value,
      taskId: props.task.id,
    });
    props.fetchProposals();
    toggleCreateModal.value = false;
  } catch (error) {}
}

const editorRef = ref(null);
watch(editorRef, (editor: any) => {
  if (!editor) return;
  editor.renderValue = function renderValue(this: any, value: any) {
    if (this.quill) {
      if (description.value) {
        const delta = this.quill.clipboard.convert({ html: description.value });
        this.quill.setContents(delta, "silent");
      } else {
        this.quill.setText("");
      }
    }
  }.bind(editor);
});
</script>
<template>
  <button
    @click.stop="toggleCreateModal = !toggleCreateModal"
    :class="props.class"
  >
    <slot />
  </button>
  <!-- the proposition creation modal -->
  <div
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center z-50"
    v-if="toggleCreateModal"
  >
    <div class="relative bg-white p-6 w-full max-w-[800px] rounded-md">
      <div class="flex justify-end">
        <button
          @click="toggleCreateModal = !toggleCreateModal"
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
          ref="editorRef"
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
          @click="props.editMode ? updateProposal() : createProposal()"
          class="w-full bg-red-500 text-white p-2 rounded-md"
        >
          {{ props.editMode ? "Update" : "Create" }}
        </button>
      </div>
    </div>
  </div>
</template>
