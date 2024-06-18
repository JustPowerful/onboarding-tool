<script setup lang="ts">
import { SearchIcon, Users } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { defineProps } from "vue";
import BaseInput from "../form/BaseInput.vue";
import { AxiosPrivate } from "@/api";
import type { UserData } from "@/types";
const props = defineProps<{
  workspaceId: number;
}>();

const loadingMembers = ref(false);
const members = ref<UserData[]>([]);
async function fetchMembers() {
  try {
    loadingMembers.value = true;
    const { data } = await AxiosPrivate.get(
      `/workspace/getnotinscribedusers?search=${search.value}&page=${page.value}&role=EMPLOYEE`
    );
    members.value = data.members;
  } catch (error) {
  } finally {
    loadingMembers.value = false;
  }
}

onMounted(() => {
  fetchMembers();
});

const toggle = ref(false);

const page = ref(0);
const search = ref("");
</script>
<template>
  <button
    @click="toggle = !toggle"
    class="text-sm flex gap-1 text-white bg-red-500 p-2 rounded-md"
  >
    <Users :size="18" />
    Staff
  </button>
  <div
    v-if="toggle"
    class="fixed bg-black bg-opacity-50 top-0 left-0 w-full h-screen z-50 flex items-center justify-center"
  >
    <div
      class="w-full max-w-[300px] bg-white rounded-md p-4 text-base flex flex-col gap-1"
    >
      <div class="flex items-center gap-1 text-xl">
        <Users :size="18" />
        Staff
      </div>
      <div class="grid grid-cols-[9fr_1fr] gap-1">
        <BaseInput label="" v-model="search" placeholder="search a member" />
        <button class="p-2 bg-red-500 text-white rounded-md">
          <SearchIcon :size="18" />
        </button>
      </div>
      <div>
        <div class="flex gap-2 items-center">
          <!-- members -->
          <div v-for="member in members">
            {{ member.firstname }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
