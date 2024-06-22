<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import type { UserData } from "@/types";
import { Minus, Plus, User } from "lucide-vue-next";
import { defineProps } from "vue";
const props = defineProps<{
  workspaceId: number;
  member: UserData;
  isAdded: boolean;
  fetchNotInscribed: () => Promise<void>;
  fetchInscribed: () => Promise<void>;
}>();

async function addUser() {
  try {
    await AxiosPrivate.post(`/workspace/addmember`, {
      userId: props.member.id,
      workspaceId: props.workspaceId,
    });
    if (props.isAdded) {
      await props.fetchInscribed();
    } else {
      await props.fetchNotInscribed();
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeUser() {
  try {
    await AxiosPrivate.delete(`/workspace/removemember`, {
      data: {
        userId: props.member.id,
        workspaceId: props.workspaceId,
      },
    });
    await props.fetchNotInscribed();
    await props.fetchInscribed();
  } catch (error) {
    console.error(error);
  }
}
</script>
<template>
  <div
    class="bg-white shadow-sm shadow-zinc-400 p-2 rounded-md flex justify-between"
  >
    <div class="flex items-center gap-2">
      <div
        class="w-8 h-8 bg-red-500 text-white rounded-full text-base font-normal flex items-center justify-center"
      >
        <div>
          {{ member.firstname[0].toUpperCase() }}
          {{ member.lastname[0].toUpperCase() }}
        </div>
      </div>
      <div>
        <div>{{ member.firstname }} {{ member.lastname }}</div>
        <div class="text-xs text-zinc-500">{{ member.email }}</div>
      </div>
    </div>
    <div>
      <button
        @click="
          () => {
            if (isAdded) {
              removeUser();
            } else {
              addUser();
            }
          }
        "
        class="p-2 bg-red-500 text-white rounded-md"
      >
        <Plus v-if="!isAdded" :size="18" />
        <Minus v-else :size="18" />
      </button>
    </div>
  </div>
</template>
