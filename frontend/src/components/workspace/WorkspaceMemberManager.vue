<script setup lang="ts">
import { SearchIcon, Users, X } from "lucide-vue-next";
import { onMounted, ref, watch, watchEffect } from "vue";
import { defineProps } from "vue";
import BaseInput from "../form/BaseInput.vue";
import { AxiosPrivate } from "@/api";
import type { UserData } from "@/types";
import MemberCard from "./MemberCard.vue";
import Paginator from "primevue/paginator";
const props = defineProps<{
  workspaceId: number;
}>();

const page = ref(0);
const rows = ref(1);
const tab = ref(1); // current tab
const totalInscribed = ref(0);

async function getTotalInscribed() {
  try {
    const { data } = await AxiosPrivate.get(
      `/workspace/getmembers?workspaceId=${props.workspaceId}&page=1&role=EMPLOYEE`
    );
    totalInscribed.value = data.totalUsers;
  } catch (error) {}
}

watch(
  () => tab.value,
  (value) => {
    page.value = 0; // reseting first to 0
    if (value === 1) {
      fetchNotInscribed(); // if tab 1
    } else {
      fetchInscribed(); // if tab 2
    }
  }
);

const loadingMembers = ref(false);
const members = ref<UserData[]>([]);
async function fetchNotInscribed() {
  await getTotalInscribed();
  try {
    loadingMembers.value = true;
    const { data } = await AxiosPrivate.get(
      `/workspace/getnotinscribedusers?search=${search.value}&page=${
        Math.floor(page.value / rows.value) + 1
      }&workspaceId=${props.workspaceId}&role=EMPLOYEE`
    );
    members.value = data.users;
    totalUsers.value = data.totalUsers;
    rows.value = data.rowsPerPage;
  } catch (error) {
  } finally {
    loadingMembers.value = false;
  }
}

async function fetchInscribed() {
  await getTotalInscribed();
  try {
    loadingMembers.value = true;
    const { data } = await AxiosPrivate.get(
      `/workspace/getmembers?search=${search.value}&page=${Math.floor(
        page.value / rows.value
      )}&workspaceId=${props.workspaceId}&role=EMPLOYEE`
    );
    members.value = data.users;
    totalUsers.value = data.totalUsers;
    rows.value = data.rowsPerPage;
    totalInscribed.value = data.totalUsers;
  } catch (error) {
  } finally {
    loadingMembers.value = false;
  }
}

onMounted(() => {
  fetchNotInscribed(); // initial fetch for tab 1
});

const toggle = ref(false);

const totalUsers = ref(1);
const search = ref("");

watch(
  () => page.value,
  () => {
    if (tab.value === 1) {
      fetchNotInscribed();
    } else {
      fetchInscribed();
    }
  }
);
</script>
<template>
  <button
    @click="toggle = !toggle"
    class="text-sm flex gap-1 text-white bg-red-500 p-2 rounded-md"
  >
    <Users :size="18" />
    Staff ({{ totalInscribed }})
  </button>
  <div
    v-if="toggle"
    class="fixed bg-black bg-opacity-50 top-0 left-0 w-full h-screen z-50 flex items-center justify-center"
  >
    <div
      class="relative w-full max-w-[400px] bg-white rounded-md p-4 text-base flex flex-col gap-1"
    >
      <button
        class="absolute top-2 right-2 text-red-500 hover:bg-zinc-200 w-fit p-1 rounded-full"
      >
        <X :size="24" @click="toggle = false" />
      </button>
      <div class="flex items-center gap-1 text-xl">
        <Users :size="18" />
        Staff
      </div>
      <div class="grid grid-cols-[9fr_1fr] gap-1">
        <BaseInput label="" v-model="search" placeholder="search a member" />
        <button
          @click="
            () => {
              if (tab === 1) {
                fetchNotInscribed();
              } else {
                fetchInscribed();
              }
            }
          "
          class="p-2 bg-red-500 text-white rounded-md"
        >
          <SearchIcon :size="18" />
        </button>
      </div>
      <div>
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex gap-1">
            <button
              @click="tab = 1"
              class="p-1 hover:bg-red-200 border-red-500 hover:text-red-500"
              :class="{
                'border-b-2': tab === 1,
              }"
            >
              Invite members
            </button>
            <button
              @click="tab = 2"
              class="p-1 hover:bg-red-200 border-red-500 hover:text-red-500"
              :class="{
                'border-b-2': tab === 2,
              }"
            >
              Joined members
            </button>
          </div>
          <!-- members -->
          <div>
            <div v-for="member in members">
              <MemberCard
                :workspaceId="workspaceId"
                :fetch-not-inscribed="fetchNotInscribed"
                :fetch-inscribed="fetchInscribed"
                :member="member"
                :is-added="tab === 2"
              />
            </div>

            <Paginator
              v-model:first="page"
              :totalRecords="totalUsers"
              :rows="rows"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
