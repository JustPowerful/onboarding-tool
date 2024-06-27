<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import Modal from "@/components/templates/Modal.vue";
import type { TaskData } from "@/types";
import { CheckCheck, ListChecks, X } from "lucide-vue-next";
import { ref, defineProps, onMounted } from "vue";
const toggle = ref(false);
const props = defineProps<{
  task: TaskData;
}>();

const count = ref(0);
async function getCount() {
  try {
    const { data } = await AxiosPrivate.get(
      `/proposal/paginate?taskId=${props.task.id}&search=&page=0&status=PENDING`
    );
    count.value = data.totalProposals;
  } catch (error) {
    throw error;
  }
}

onMounted(() => {
  getCount();
});
</script>
<template>
  <button
    @click="toggle = !toggle"
    class="relative bg-zinc-300 hover:bg-zinc-400 w-full p-1 rounded-md text-slate-700 flex items-center justify-center gap-1"
  >
    <CheckCheck :size="18" />
    Proposed Solutions
    <div
      v-if="count > 0"
      class="absolute -top-2 -right-2 bg-red-500 text-white text-sm w-6 h-6 flex items-center justify-center rounded-full"
    >
      <span>{{ count }}</span>
    </div>
  </button>
  <!-- Toggled window background -->
  <Modal :width="400" :show="toggle" @close="toggle = !toggle">
    <!-- The window itself ✨ -->
    <div>
      Redirecting you to the solution proposition page, proceed?
      <div class="grid grid-cols-2 gap-2 mt-2">
        <RouterLink
          :to="`/proposals/${task.id}`"
          class="text-white bg-red-500 p-2 rounded-md block text-center w-full"
        >
          Sure
        </RouterLink>
        <button class="bg-zinc-700 p-2 text-white rounded-md">Cancel</button>
      </div>
    </div>
  </Modal>
</template>
