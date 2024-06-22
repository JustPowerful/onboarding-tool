<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import type { UserData } from "@/types";
import { UserCheck, UserMinus, UserRoundIcon } from "lucide-vue-next";
import { defineProps } from "vue";
const props = defineProps<{
  taskId: number;
  member: UserData;
  isAssigned: boolean;
  fetchUnassigned: () => void;
  fetchAssignedMembers: () => void;
}>();

async function assignMember() {
  try {
    await AxiosPrivate.post("/task/assignmember", {
      taskId: props.taskId,
      userId: props.member.id,
    });
    props.fetchUnassigned();
  } catch (error) {}
}

async function removeMember() {
  try {
    await AxiosPrivate.delete("/task/removeassignement", {
      data: {
        taskId: props.taskId,
        userId: props.member.id,
      },
    });
    props.fetchAssignedMembers();
  } catch (error) {}
}
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div
        class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
      >
        {{ member.firstname[0] }}{{ member.lastname[0] }}
      </div>
      <div>
        <div class="font-bold">
          {{ member.firstname }} {{ member.lastname }}
        </div>
        <div class="text-sm text-gray-500">{{ member.email }}</div>
      </div>
    </div>
    <button
      v-if="!isAssigned"
      @click="assignMember"
      class="bg-red-500 text-white p-2 rounded-md"
    >
      <UserCheck :size="18" />
    </button>
    <button
      v-else
      @click="removeMember"
      class="bg-red-500 text-white p-2 rounded-md"
    >
      <UserMinus :size="18" />
    </button>
  </div>
</template>
