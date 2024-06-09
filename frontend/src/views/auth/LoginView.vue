<script setup lang="ts">
import { AxiosPublic } from "@/api";
import BaseInput from "@/components/form/BaseInput.vue";

import { ref } from "vue";
const email = ref("");
const password = ref("");
const loading = ref(false);

// define the method to handle the form submission
const handleSubmit = async () => {
  loading.value = true;
  const { data, status } = await AxiosPublic.post("/auth/login", {
    email: email.value,
    password: password.value,
  });
  if (status === 200) {
    localStorage.setItem("token", data.token);
    window.location.href = "/";
  }
  try {
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-1 w-full max-w-[300px]">
        <div class="text-center flex flex-col gap-1">
          <h2 class="text-3xl font-semibold">Sign In</h2>
          <div class="text-gray-600 text-center mb-10">
            Access your account for personalized insights and updates
          </div>
        </div>

        <BaseInput
          label="E-mail"
          v-model="email"
          placeholder="johndoe@mail.com"
        />
        <BaseInput
          label="Password"
          type="password"
          v-model="password"
          placeholder="password"
        />
        <RouterLink to="/reset" class="text-blue-500 text-right">
          Forgot password?
        </RouterLink>

        <button class="bg-zinc-800 p-2 rounded-md my-2">
          <span v-if="loading">
            <v-progress-circular
              bgColor="error"
              size="24"
              indeterminate
            ></v-progress-circular>
          </span>
          <span class="text-white" v-else>Sign In</span>
        </button>
      </div>
    </form>
  </div>
</template>
