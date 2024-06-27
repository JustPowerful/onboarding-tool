<script setup lang="ts">
import { SearchIcon, User, XIcon } from "lucide-vue-next";
import UserModal from "@/components/users/UserModal.vue";
import { AxiosPrivate } from "@/api";
import { onMounted, ref, watch } from "vue";
import type { UserData } from "@/types";
import Paginator from "primevue/paginator";
import UserCard from "./UserCard.vue";

const first = ref(0);
const rowsPerPage = ref(1);
const totalMembers = ref(0);
const members = ref<UserData[]>([]);
const search = ref("");
async function fetchMembers() {
  // fetch users from the backend
  try {
    const { data } = await AxiosPrivate.get(
      `/member/getall?page=${Math.floor(
        first.value / rowsPerPage.value
      )}&search=${search.value}`
    );
    totalMembers.value = data.totalMembers;
    rowsPerPage.value = data.rowsPerPage;
    members.value = data.members;
  } catch (error) {}
}

onMounted(() => {
  fetchMembers();
});

watch(() => first.value, fetchMembers);
</script>
<template>
  <div class="p-6">
    <!-- Title and description for the page  -->
    <div>
      <h1 class="text-3xl font-semibold flex items-center gap-1">
        <User :size="28" /> User Manager
      </h1>
      <p class="text-zinc-700">
        Manage users and their roles in the system, add new users, and more.
      </p>
    </div>
    <div class="flex justify-end">
      <UserModal
        :on-user-created="fetchMembers"
        :is-edit-mode="false"
        class="bg-red-500 text-white p-2 rounded-md"
      >
        Add a user
      </UserModal>
    </div>
    <form
      @submit.prevent="
        () => {
          first = 0;
          fetchMembers();
        }
      "
      class="grid grid-cols-[30fr_1fr] gap-3 my-2"
    >
      <div class="relative">
        <input
          v-model="search"
          type="text"
          placeholder="Search for a user"
          class="w-full p-2 border border-zinc-300 rounded-md"
        />
        <button
          type="button"
          @click.stop="
            () => {
              search = '';
              fetchMembers();
            }
          "
          v-if="search"
          class="absolute top-2.5 right-4 text-white bg-red-500 rounded-full p-1"
        >
          <XIcon :size="14" />
        </button>
      </div>
      <button
        type="submit"
        @click="fetchMembers"
        class="bg-red-500 text-white p-2 rounded-md flex items-center justify-center"
      >
        <SearchIcon />
      </button>
    </form>
    <div class="flex flex-col gap-2">
      <div v-for="member in members">
        <UserCard :member="member" />
      </div>
    </div>
    <Paginator
      v-model:first="first"
      :totalRecords="totalMembers"
      :rows="rowsPerPage"
    />
  </div>
</template>
