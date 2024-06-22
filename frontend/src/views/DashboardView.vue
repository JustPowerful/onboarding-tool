<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import type { UserData } from "@/types";
import { Book, MessageCircleQuestion, Table2 } from "lucide-vue-next";
import { onMounted, ref } from "vue";
const user = ref<UserData | null>(null);
async function getCurrentUser() {
  try {
    const { data } = await AxiosPrivate.get("/auth/me");
    user.value = data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  getCurrentUser();
});
</script>
<template>
  <div class="p-12">
    <h1 class="text-2xl font-semibold">
      Welcome to the dashboard <span v-if="user">, {{ user.firstname }}</span>
    </h1>
    <p class="text-gray-500">
      Here are some of the things you can do to boost your productivity
    </p>
    <div class="grid grid-cols-4 gap-10 mt-10">
      <RouterLink
        to="/workspaces"
        class="grid grid-rows-[6fr_0.5fr] shadow-md hover:shadow-lg hover:scale-95 transition-all shadow-zinc-500 aspect-video p-6 rounded-md"
      >
        <div class="flex justify-center items-center text-red-500">
          <Table2 :size="80" />
        </div>
        <div>
          <div class="text-2xl text-red-500 font-semibold">
            Visit Workspaces
          </div>
          <p class="text-gray-500 text-sm">
            Workspace is a place where you can manage your tasks and collaborate
            with your team
          </p>
        </div>
      </RouterLink>
      <RouterLink
        to="/questions"
        class="grid grid-rows-[6fr_0.5fr] shadow-md hover:shadow-lg hover:scale-95 transition-all shadow-zinc-500 aspect-video p-6 rounded-md"
      >
        <div class="flex justify-center items-center text-red-500">
          <MessageCircleQuestion :size="80" />
        </div>
        <div>
          <div class="text-2xl text-red-500 font-semibold">Employee FAQs</div>
          <p class="text-gray-500 text-sm">
            Get answers to frequently asked questions by employees, and if there
            isn't any, you can ask
          </p>
        </div>
      </RouterLink>
      <RouterLink
        to="/questions"
        class="grid grid-rows-[6fr_0.5fr] shadow-md hover:shadow-lg hover:scale-95 transition-all shadow-zinc-500 aspect-video p-6 rounded-md"
      >
        <div class="flex justify-center items-center text-red-500">
          <Book :size="80" />
        </div>
        <div>
          <div class="text-2xl text-red-500 font-semibold">
            Read the tool guide
          </div>
          <p class="text-gray-500 text-sm">
            Our onboarding tool has a guide that will help you get started with
            the interface
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
