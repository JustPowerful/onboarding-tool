<script setup lang="ts">
import { ref } from "vue";
import BaseInput from "../form/BaseInput.vue";
import type { UserData } from "@/types";
import { XIcon } from "lucide-vue-next";
import { AxiosPrivate } from "@/api";

const props = defineProps<{
  user?: UserData;
  class: string;
  isEditMode: boolean;
  onUserCreated: () => Promise<void>;
}>();
const toggle = ref(false);

// user data fields to be used in the form
const firstname = ref("" || props.user?.firstname);
const lastname = ref("" || props.user?.lastname);
const email = ref("" || props.user?.email);
const password = ref("");
const passwordConfirmation = ref("");
const role = ref("" || props.user?.role || null);

async function createUser() {
  try {
    const { data } = await AxiosPrivate.post("/auth/register", {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
      role: role.value,
    });
    await props.onUserCreated();
    toggle.value = false;
    // reset the refs
    firstname.value = "";
    lastname.value = "";
    email.value = "";
    password.value = "";
    passwordConfirmation.value = "";
    role.value = null;
  } catch (error) {}
}
</script>
<template>
  <!-- a customizable button -->
  <button @click="toggle = !toggle" :class="class">
    <slot />
  </button>

  <!-- the toggled menu -->
  <div
    v-if="toggle"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div class="relative w-full max-w-[700px] p-6 bg-white rounded-md">
      <button
        @click="toggle = false"
        class="absolute top-3 right-3 text-red-500 p-2 hover:bg-zinc-300 rounded-full"
      >
        <XIcon />
      </button>
      <h2 class="text-xl font-semibold">Add a user</h2>
      <form @submit.prevent="createUser" class="flex flex-col gap-2">
        <BaseInput
          label="firstname"
          v-model="firstname"
          placeholder="firstname"
          type="text"
        />
        <BaseInput
          label="lastname"
          v-model="lastname"
          placeholder="lastname"
          type="text"
        />
        <BaseInput
          label="email"
          v-model="email"
          placeholder="email"
          type="text"
        />
        <div>
          <label class="text-base font-semibold">Role</label> <br />
          <input type="radio" value="CLIENT" v-model="role" id="client" />
          <label for="client">Client</label> <br />
          <input type="radio" value="EMPLOYEE" v-model="role" id="employee" />
          <label for="employee">Employee</label> <br />
          <input type="radio" value="MANAGER" v-model="role" id="manager" />
          <label for="manager">Manager</label> <br />
        </div>

        <BaseInput
          label="password"
          v-model="password"
          placeholder="password"
          type="password"
        />
        <BaseInput
          label="confirm password"
          v-model="passwordConfirmation"
          placeholder="confirm password"
          type="password"
        />
        <button
          :disabled="
            password === passwordConfirmation &&
            firstname &&
            lastname &&
            email &&
            password &&
            role
              ? false
              : true
          "
          v-if="!isEditMode"
          class="bg-red-500 text-white p-2 rounded-md disabled:bg-zinc-500"
        >
          Create user
        </button>
        <button v-else class="bg-red-500 text-white p-2 rounded-md">
          Update user
        </button>
      </form>
    </div>
  </div>
</template>
