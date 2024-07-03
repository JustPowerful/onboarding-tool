<script setup lang="ts">
import { XIcon } from "lucide-vue-next";
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
  show: boolean;
  width?: number;
  height?: number;
}>();
const emit = defineEmits(["close"]);

function closeModal(e: KeyboardEvent) {
  if (e.key === "Escape") {
    if (props.show) {
      emit("close");
    }
  }
}
// adding a function to close the modal when the escape key is pressed
// using an event listener to listen for the keydown event
onMounted(() => {
  document.addEventListener("keydown", closeModal);
});
// removing the event listener when the component is unmounted
onUnmounted(() => {
  document.removeEventListener("keydown", closeModal);
});
</script>
<template>
  <div
    v-if="props.show"
    class="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      :class="`font-medium max-h-full overflow-y-auto text-base relative bg-white rounded-md w-full p-4 max-w-[${
        width ? width + 'px' : '700px'
      }] ${width ? width : ''}
       
       `"
    >
      <button
        class="absolute top-3 right-3 hover:bg-zinc-300 p-1 rounded-md text-red-500"
      >
        <XIcon @click="$emit('close')" />
      </button>
      <slot />
    </div>
  </div>
</template>
