<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { AxiosPrivate } from "@/api";
import type { UserData } from "@/types";

// icons
import { GanttChart, Settings, Settings2, User, Users } from "lucide-vue-next";
const user = ref<UserData | null>();
const toggle = ref(false);
const menuRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  const { data } = await AxiosPrivate.get("/auth/me");
  user.value = data;
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

function logOut() {
  window.localStorage.removeItem("token");
  window.location.href = "/login";
}

function handleClickOutside(event: MouseEvent) {
  if (toggle.value) {
    if (
      !menuRef.value ||
      (!menuRef.value.contains(event.target as Node) &&
        event.target !==
          document.querySelector(".bg-red-500.text-white.w-10.h-10")) // Check for toggle button element
    ) {
      toggle.value = false;
    }
  }
}
</script>
<template>
  <div class="relative">
    <div
      @click="toggle = !toggle"
      class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
    >
      {{ user?.firstname[0] }}{{ user?.lastname[0] }}
    </div>
    <div
      ref="menuRef"
      v-if="toggle"
      class="fixed bg-zinc-100 opacity-100 top-14 right-4 shadow-lg shadow-zinc-500 w-60 p-4 rounded-lg"
    >
      <div class="flex items-center justify-center flex-col gap-1 pb-2">
        <div
          class="w-16 h-16 bg-red-500 flex items-center justify-center text-white text-xl rounded-full"
        >
          {{ user?.firstname[0] }}{{ user?.lastname[0] }}
        </div>
        <div>{{ user?.firstname }} {{ user?.lastname }}</div>
        <div class="capitalize text-sm">
          Role: {{ user?.role.toLocaleLowerCase() }}
        </div>
        <!-- <div class="">
          <RouterLink to="/usersettings" class="text-red-500">
            <Settings :size="12" />
          </RouterLink>
        </div> -->
      </div>
      <div class="flex flex-col gap-1 pt-2">
        <hr />
        <small class="text-red-500">Menu</small>
        <RouterLink
          class="hover:bg-red-500 hover:text-white p-1 pl-2 rounded-sm flex items-center gap-1"
          to="/dashboard"
        >
          <User :size="16" /> <span>Dashboard</span></RouterLink
        >
        <RouterLink
          class="hover:bg-red-500 hover:text-white p-1 pl-2 rounded-sm flex items-center gap-1"
          to="/workspaces"
        >
          <GanttChart :size="16" /> <span>Workspaces</span></RouterLink
        >
        <RouterLink
          v-if="user?.role === 'SUPERADMIN'"
          class="hover:bg-red-500 hover:text-white p-1 pl-2 rounded-sm flex items-center gap-1"
          to="/users"
        >
          <Users :size="16" /> <span>Manage users</span></RouterLink
        >
      </div>

      <div class="flex flex-col gap-1 pt-2">
        <hr />
        <small class="text-red-500">Account</small>
        <button
          @click="logOut"
          class="hover:bg-red-500 hover:text-white p-1 rounded-sm"
        >
          Logout
        </button>
      </div>

      <!-- <RouterLink to="/profile" class="block p-2">Profile</RouterLink> -->
    </div>
  </div>
</template>
