<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <v-app>
    <Navbar />
    <div class="pt-14">
      <RouterView />
    </div>
  </v-app>
</template>

<style scoped></style>
