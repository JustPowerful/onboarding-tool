<script setup lang="ts">
const token = localStorage.getItem("token");
import ProfileMenu from "./profile/ProfileMenu.vue";
const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
</script>
<template>
  <div
    class="flex justify-between items-center max-h-14 min-h-14 bg-zinc-900 px-5 fixed top-0 left-0 w-full"
  >
    <div class="text-red-500 font-bold text-xl">OBT</div>
    <div>
      <div v-if="token" class="flex">
        <ProfileMenu />
        <!-- <button @click="logout" class="text-white">Logout</button> -->
      </div>
      <div v-else>
        <RouterLink to="/login" class="text-white mr-5"> Login </RouterLink>
      </div>
    </div>
  </div>
</template>
