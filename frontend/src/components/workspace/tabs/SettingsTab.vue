<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import BaseInput from "@/components/form/BaseInput.vue";
import { SettingsIcon } from "lucide-vue-next";
import { onMounted, ref } from "vue";
const workspaceName = ref("");
const loading = ref(false);

const props = defineProps<{
  workspaceId: number;
  refreshWorkspace: () => Promise<void>;
}>();

async function fetchWorkspaceData() {
  try {
    loading.value = true;
    const { data } = await AxiosPrivate.get(
      `/workspace/get/${props.workspaceId}`
    );
    workspaceName.value = data.workspace.name;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function updateWorkspace() {
  try {
    loading.value = true;
    await AxiosPrivate.patch(`/workspace/update`, {
      id: props.workspaceId,
      name: workspaceName.value,
    });
    props.refreshWorkspace();
    await fetchWorkspaceData();
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchWorkspaceData();
});
</script>
<template>
  <div class="p-6">
    <h1 class="text-xl font-semibold flex items-center gap-1">
      <SettingsIcon :size="22" />
      Settings
    </h1>
    <div class="mt-4">
      <BaseInput
        v-model="workspaceName"
        label="Workspace name"
        placeholder="Workspace name"
      />
      <button
        @click="updateWorkspace"
        :disabled="loading"
        class="w-full disabled:bg-zinc-600 bg-red-500 text-white p-2 rounded-md mt-2"
      >
        <span v-if="!loading"> Save </span>
        <span v-else>
          <v-progress-circular
            indeterminate
            size="20"
            color="white"
          ></v-progress-circular>
        </span>
      </button>
    </div>
  </div>
</template>
