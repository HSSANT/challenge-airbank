<template>
  <div class="flex gap-4 w-full flex-wrap">
    <div class="flex-grow flex-shrink-0">
      <label for="search" class="block text-sm font-medium text-gray-600 ">
        Search</label
      >
      <div class="relative mt-1">
        <div
          class="absolute top-0 bottom-0 right-5 flex justify-center items-center ml-3 pointer-events-none"
        >
          <Search />
        </div>
        <input
          id="search"
          type="text"
          name="search"
          class="block shadow-sm border border-gray-600 p-3 pl-9 focus:border-gray-600 focus:ring-transparent focus:outline-none text-base w-full"
          placeholder="Search by bank, account, reference, category, currency"
          :value="query"
          @change="$emit('updateQuery', $event.target)"
        />
      </div>
    </div>
    <div>
      <label for="bank" class="block text-sm font-medium text-gray-600">
        Bank
      </label>
      <select
        class="mt-1 shadow-sm border border-gray-600 p-3 focus:border-gray-600 focus:ring-transparent focus:outline-none text-base"
        @change="$emit('updateBank', $event.target)"
      >
        <option selected>No filter applied</option>
        <option v-for="bank in banks" :key="bank">
          {{ bank }}
        </option>
      </select>
    </div>
    <div>
      <label for="account" class="block text-sm font-medium text-gray-600">
        Account
      </label>
      <select
        class="mt-1 block shadow-sm border border-gray-600 p-3 focus:border-gray-600 focus:ring-transparent focus:outline-none text-base"
        @change="$emit('updateAccount', $event.target)"
      >
        <option selected>No filter applied</option>
        <option v-for="account in accounts" :key="account">
          {{ account }}
        </option>
      </select>
    </div>
    <div>
      <label
        for="startingMonth"
        class="block text-sm font-medium text-gray-600"
      >
        Starting Month
      </label>
      <input
        type="month"
        class="mt-1 shadow-sm border border-gray-600 p-3 focus:border-gray-600 focus:ring-transparent focus:outline-none text-sm"
        @change="$emit('updateSince', $event.target)"
      />
    </div>
    <div>
      <label for="endingMonth" class="block text-sm font-medium text-gray-600">
        Ending Month
      </label>
      <input
        type="month"
        class="mt-1 shadow-sm border border-gray-600 p-3 focus:border-gray-600 focus:ring-transparent focus:outline-none text-sm"
        @change="$emit('updateUntil', $event.target)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { reactive, toRefs } from "vue";
import Search from "~/components/icons/Search.vue";
import AccountsQueryGQL, {
  AccountsQuery,
} from "~/server/graphql/queries/AccountsQuery";

const state = reactive({
  accounts: [] as string[],
  banks: [] as string[],
});
const { query } = defineProps({
  query: {
    type: String,
    default: "",
  },
});

defineEmits([
  "updateQuery",
  "updateBank",
  "updateAccount",
  "updateSince",
  "updateUntil",
]);

const { onResult } = useQuery<AccountsQuery>(AccountsQueryGQL);

onResult(({ data }) => {
  state.accounts = [...new Set(data.accounts.map(({ name }) => name))];
  state.banks = [...new Set(data.accounts.map(({ bank }) => bank))];
});
const { accounts, banks } = toRefs(state);
</script>
