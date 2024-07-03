<script setup lang="ts">
import { AxiosPrivate } from "@/api";
import Modal from "@/components/templates/Modal.vue";
import type { Client } from "@/types";
import { SearchIcon, XIcon } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import ClientCard from "../clients/ClientCard.vue";
import Paginator from "primevue/paginator";
import BaseInput from "@/components/form/BaseInput.vue";
import ClientRow from "../clients/table/ClientRow.vue";

const props = defineProps<{
  workspaceId: number;
}>();

// paginate client
const first = ref(0);
const search = ref("");
const rowsPerPage = ref(1);
const totalUsers = ref(0);
const clients = ref<Client[]>([]);

// create client
const toggleCreateClient = ref(false);
const name = ref("");
const email = ref("");
const phone = ref("");

async function paginateMembers() {
  try {
    // /client/paginateworkspaceclients
    const { data } = await AxiosPrivate.get(
      `/client/paginateworkspaceclients?page=${Math.floor(
        first.value / rowsPerPage.value
      )}&search=${search.value}&inscribed=false&workspaceId=${
        props.workspaceId
      }`
    );
    clients.value = data.clients;
    totalUsers.value = data.totalClients;
    rowsPerPage.value = data.rowsPerPage;
  } catch (error) {}
}

// paginate added clients
const firstAdd = ref(0);
const searchAdd = ref("");
const rowsPerPageAdd = ref(1);
const totalUsersAdd = ref(0);
const clientsAdd = ref<Client[]>([]);

async function paginateAddedClients() {
  try {
    const { data } = await AxiosPrivate.get(
      `/client/paginateworkspaceclients?page=${Math.floor(
        firstAdd.value / rowsPerPageAdd.value
      )}&search=${searchAdd.value}&inscribed=true&workspaceId=${
        props.workspaceId
      }`
    );
    clientsAdd.value = data.clients;
    totalUsersAdd.value = data.totalClients;
    rowsPerPageAdd.value = data.rowsPerPage;
  } catch (error) {}
}

onMounted(() => {
  paginateAddedClients();
});

watch(
  () => firstAdd.value,
  () => {
    paginateAddedClients();
  }
);

async function createClient() {
  try {
    const { data } = await AxiosPrivate.post("/client/create", {
      name: name.value,
      email: email.value,
      phone: phone.value,
    });
    first.value = 0;
    await paginateMembers();
    toggleCreateClient.value = false;
  } catch (error) {}
}

const toggleClientBrowser = ref(false);

watch(
  () => toggleClientBrowser.value,
  (value) => {
    if (value) {
      paginateMembers();
    }
  }
);

watch(
  () => first.value,
  () => {
    paginateMembers();
  }
);
</script>
<template>
  <div class="p-6 relative">
    <!-- begin: client browser -->
    <button
      @click="toggleClientBrowser = true"
      class="absolute top-3 right-6 p-2 bg-red-500 text-white rounded-md"
    >
      Browse Clients
    </button>
    <Modal
      :width="400"
      :show="toggleClientBrowser"
      @close="toggleClientBrowser = false"
    >
      <div>
        <h1 class="text-2xl font-semibold">Browse Clients</h1>
        <form
          @submit.prevent="
            first = 0;
            paginateMembers();
          "
          class="grid grid-cols-[10fr_1fr] gap-2 mt-2"
        >
          <div class="relative">
            <button
              v-if="search"
              type="button"
              @click="
                search = '';
                paginateMembers();
              "
              class="text-white bg-red-500 p-1 rounded-full absolute top-2.5 right-3"
            >
              <XIcon :size="14" />
            </button>
            <input
              v-model="search"
              type="text"
              class="border border-gray-300 p-2 w-full rounded-md"
              placeholder="ie: John Doe or johndoe@mail.com"
            />
          </div>
          <button
            type="submit"
            class="flex items-center justify-center bg-red-500 p-2 text-white rounded-md"
          >
            <SearchIcon :size="24" />
          </button>
        </form>
        <button
          @click="toggleCreateClient = true"
          class="text-white bg-red-500 p-2 rounded-md w-full my-2"
        >
          Create a new client
        </button>
        <div class="flex flex-col gap-2">
          <div v-for="client in clients">
            <ClientCard
              :client="client"
              :fetch-clients="
                async () => {
                  paginateMembers();
                  paginateAddedClients();
                }
              "
              :workspace-id="workspaceId"
            />
          </div>
        </div>
        <Paginator
          v-model:first="first"
          :totalRecords="totalUsers"
          :rows="rowsPerPage"
        />
      </div>
    </Modal>
    <!-- end: client browser -->

    <!-- begin: create client modal -->
    <Modal :show="toggleCreateClient" @close="toggleCreateClient = false">
      <div>
        <h2 class="text-2xl font-semibold">Create a client</h2>
        <form class="mt-4 flex flex-col gap-2" @submit.prevent="createClient">
          <BaseInput
            v-model="name"
            label="Client email (company or individual)"
            placeholder="Write the client's name..."
          />
          <BaseInput
            v-model="email"
            label="Email"
            placeholder="Write the client's email..."
          />
          <BaseInput
            v-model="phone"
            label="Phone"
            placeholder="Write the client's phone..."
          />
          <button class="bg-red-500 text-white p-2 rounded-md">Create</button>
        </form>
      </div>
    </Modal>
    <!-- end: create client modal -->

    <!-- below is the list of added clients -->
    <div class="grid grid-cols-3 border-b-2 border-zinc-300 pb-2">
      <div>Client</div>
      <div>Workspaces</div>
      <div>Current State</div>
    </div>
    <div>
      <div v-for="client in clientsAdd">
        <ClientRow
          :fetch-clients="paginateAddedClients"
          :client="client"
          :workspace-id="workspaceId"
        />
      </div>
    </div>
    <Paginator
      v-model:first="firstAdd"
      :totalRecords="totalUsersAdd"
      :rows="rowsPerPageAdd"
    />
  </div>
</template>
