<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import type { TaskData, UserData } from "@/types";
import {
  Ellipsis,
  LayoutList,
  PlusIcon,
  Save,
  Trash,
  Users,
  X,
} from "lucide-vue-next";
import { defineProps, ref, watch } from "vue";
import Editor from "primevue/editor";

import BaseInput from "../form/BaseInput.vue";
import AssignmentManager from "./AssignmentManager.vue";
import ProposalManager from "./proposals/ProposalManager.vue";

const props = defineProps<{
  task: TaskData;
  workspaceId: number;
  fetchChecklists: () => Promise<void>;
  disableDragging: () => void;
  enableDragging: () => void;
}>();

const toggleTaskMenu = ref(false);

const name = ref(props.task.name);
const description = ref(props.task.description);
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

const deleteLoading = ref(false);
async function deleteTask() {
  try {
    deleteLoading.value = true;
    await AxiosPrivate.delete(`/task/delete/${props.task.id}`);
    await props.fetchChecklists();
  } catch (error) {
    throw error;
  } finally {
    deleteLoading.value = false;
  }
}

watch(
  () => toggleTaskMenu.value,
  () => {
    if (toggleTaskMenu.value) {
      fetchAssignedMembers();
    }
  }
);

const updateLoading = ref(false);
async function updateTask() {
  try {
    updateLoading.value = true;
    await AxiosPrivate.patch(`/task/update`, {
      id: props.task.id,
      name: name.value,
      description: description.value,
    });
    props.fetchChecklists();
    toggleTaskMenu.value = false;
    props.enableDragging();
  } catch (error) {
  } finally {
    updateLoading.value = false;
  }
}

const members = ref<UserData[]>([]);
const totalAssignedUsers = ref(0);
// this will only fetch the first page of unassigned members to showcase it in the UI
// then the user can press the ... elipsis to fetch more members
async function fetchAssignedMembers() {
  try {
    const { data } = await AxiosPrivate.get(
      `/task/getassignements?search=&page=0&workspaceId=${props.workspaceId}&taskId=${props.task.id}`
    );
    members.value = data.members;
    totalAssignedUsers.value = data.totalUsers;
  } catch (error) {}
}
</script>
<template>
  <div>
    <!-- task menu  -->
    <div
      v-if="toggleTaskMenu"
      class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div class="relative w-full max-w-[760px] bg-white rounded-md p-4">
        <button
          @click="
            toggleTaskMenu = false;
            enableDragging();
          "
          class="absolute top-3 right-3 text-red-500"
        >
          <X :size="21" />
        </button>
        <div class="grid grid-cols-[8fr_3fr] gap-4">
          <div>
            <div class="flex gap-1 items-center text-xl mb-3">
              <span>
                <LayoutList :size="18" />
              </span>
              <span>{{ task.name }}</span>
            </div>
            <div>
              <small class="text-red-400"
                >Members
                <span v-if="totalAssignedUsers > 0"
                  >({{ totalAssignedUsers }})</span
                >
              </small>
              <div class="flex">
                <div
                  v-for="member in members"
                  class="cursor-pointer select-none -mr-4 relative group w-10 h-10 text-white bg-red-500 border-2 border-white rounded-full flex justify-center items-center hover:scale-110 transition-all"
                >
                  {{ member.firstname[0] }}{{ member.lastname[0] }}
                </div>
                <AssignmentManager
                  :fetch-checklists="fetchChecklists"
                  :refresh-member-preview="fetchAssignedMembers"
                  class="-mr-4 relative group w-10 h-10 text-white bg-zinc-500 flex justify-center items-center rounded-full hover:scale-110 transition-all border-2 border-white"
                  :button-children="PlusIcon"
                  :workspace-id="workspaceId"
                  :task-id="task.id"
                >
                  <div
                    v-if="totalAssignedUsers > 0"
                    class="absolute text-xs -top-1 -right-1 text-white bg-red-500 rounded-full shadow-md shadow-zinc-400 w-4 h-4 group-hover:block transition-all"
                  >
                    {{ totalAssignedUsers }}
                  </div>
                  <Ellipsis :size="24" />
                </AssignmentManager>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <BaseInput
                label="Task name"
                placeholder="Give the task a name..."
                v-model="name"
              />
              <div class="flex flex-col gap-1">
                <label class="font-semibold">Description</label>
                <!-- <textarea
                  v-model="description"
                  placeholder="Give the task a description..."
                  class="w-full p-2 border border-zinc-400 rounded-md focus:outline-red-400"
                ></textarea> -->

                <Editor
                  ref="editorRef"
                  placeholder="Give the task a description..."
                  v-model="description"
                  editorStyle="height: 320px"
                />
              </div>
              <button
                @click="updateTask"
                class="flex items-center justify-center gap-1 text-white bg-red-500 p-2 rounded-md"
              >
                <span
                  v-if="!updateLoading"
                  class="flex justify-center items-center gap-1"
                >
                  <Save :size="18" /> Update</span
                >
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
          <div class="pt-5 flex flex-col justify-between">
            <div class="flex flex-col gap-2">
              <small class="text-red-400">Manage your task card</small>
              <AssignmentManager
                :fetch-checklists="fetchChecklists"
                :refresh-member-preview="fetchAssignedMembers"
                class="bg-zinc-300 hover:bg-zinc-400 w-full p-1 rounded-md text-slate-700 flex items-center justify-center gap-1"
                :button-children="PlusIcon"
                :workspace-id="workspaceId"
                :task-id="task.id"
              >
                <Users :size="18" />
                Assigned members
              </AssignmentManager>
              <ProposalManager :task="task" />
            </div>
            <div>
              <button
                @click="deleteTask"
                class="bg-red-500 text-white p-2 rounded-md w-full flex gap-1 justify-center items-center"
              >
                <span
                  v-if="!deleteLoading"
                  class="flex items-center justify-center gap-1"
                  ><Trash :size="18" /> Delete Task</span
                >
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
        </div>
      </div>
    </div>

    <!-- task -->
    <div
      @click="
        toggleTaskMenu = true;
        disableDragging();
      "
      class="bg-white p-2 border-2 border-zinc-200 rounded-md"
    >
      <div class="flex justify-between">
        <div>{{ props.task.name }}</div>
        <div class="text-zinc-500">
          <Ellipsis :size="21" />
        </div>
      </div>
      <div class="text-zinc-500">
        <div
          v-if="task.assignements && task.assignements.length > 0"
          class="flex items-center gap-1"
        >
          <Users :size="15" /> {{ task.assignements?.length }}
        </div>
      </div>
    </div>
  </div>
</template>
