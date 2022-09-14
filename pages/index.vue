<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="
      h-screen
      w-screen
      overflow-hidden
      bg-gray-100
      flex
      justify-center
      items-center
    "
  >
    <div
      class="
        bg-white
        p-5
        rounded-lg
        shadow-lg
        w-full
        h-full
        overflow-y-auto
        flex flex-col
      "
    >
      <h1 class="font-bold flex-shrink-0">Transactions</h1>
      <FormHeader
        :query="query"
        @updateQuery="updateQuery"
        @updateBank="updateBank"
        @updateAccount="updateAccount"
        @updateSince="updateSince"
        @updateUntil="updateUntil"
      />
      <div>
        <MainTable
          :key="state.key"
          v-if="paginatedTransactions.transactions"
          :transactions="paginatedTransactions.transactions"
          :loading="loading"
          @updateSortBy="updateSortBy"
        />
        <p v-if="error">Error: {{ error }}</p>
      </div>
      <div class="flex justify-end mt-2">
        <div class="row">
          <div class="col">
            <div class="dataTables_paginate paging_simple_numbers float-right">
              <ul class="pagination pagination-rounded mb-0">
                <!-- pagination -->
                <b-pagination
                  v-model="state.page"
                  :total-rows="paginatedTransactions.total"
                  :per-page="paginatedTransactions.perPage"
                ></b-pagination>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/named */

import { reactive, toRefs } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { Account, Category, Transaction } from "@prisma/client";
import FormHeader from "~/components/FormHeader.vue";
import MainTable from "~/components/MainTable.vue";
import ChevronsLeft from "~/components/icons/ChevronsLeft.vue";
import ChevronLeft from "~/components/icons/ChevronLeft.vue";
import ChevronsRight from "~/components/icons/ChevronsRight.vue";
import ChevronRight from "~/components/icons/ChevronRight.vue";
import PaginatedTransactionsQueryGQL, {
  PaginatedTransactionsQuery,
  PaginatedTransactionsQueryVariables,
} from "~/server/graphql/queries/PaginatedTransactionsQuery";
// import PaginationComponent from "~/components/PaginationComponent.vue";

const state = reactive({
  page: 1,
  perPage: 10,
  query: "",
  key:0,
  paginatedTransactions: {
    transactions: [] as (Transaction & {
      category?: Category;
      account: Account;
    })[],
    perPage: 0,
    total: 0,
    totalPages: 0,
    page: 0,
  },
  bank: "",
  account: "",
  since: "",
  until: "",
});
const sortBy = reactive({
  key: "",
  order: "" as "asc" | "desc",
});

const nextPage = (lastPage?: number) => {
  state.page = lastPage ? Math.min(lastPage, state.page + 1) : state.page + 1;
};
const prevPage = () => {
  state.page = Math.max(1, state.page - 1);
};

const changePage = (
  target: (EventTarget | null) | number,
  lastPage?: number
) => {
  if (typeof target === "number") {
    state.page = lastPage
      ? Math.min(lastPage, Math.max(1, Number(target)))
      : Math.max(1, Number(target));
  } else {
    // I really don't like this, but it's the only way I can get the
    // correct type. I'm not sure how to do this properly.
    const targetValue = Number((target as HTMLInputElement).value);
    state.page = lastPage
      ? Math.min(lastPage, Math.max(1, targetValue))
      : Math.max(1, targetValue);
    (target as HTMLInputElement).value = String(state.page);
  }
};
const updateQuery = (target: EventTarget) => {
  state.query = (target as HTMLInputElement).value;
};

const {
  page,
  perPage,
  query,
  paginatedTransactions,
  account,
  bank,
  since,
  until,
} = toRefs(state);
const updateSortBy = (fromTable: { key: string; asc: boolean }) => {
  sortBy.order = fromTable.asc ? "asc" : "desc";
  sortBy.key = fromTable.key.toLowerCase();
};

const { onResult, error, loading } = useQuery<
  PaginatedTransactionsQuery,
  PaginatedTransactionsQueryVariables
>(PaginatedTransactionsQueryGQL, {
  page,
  perPage,
  query,
  accountName: account,
  bankName: bank,
  since,
  until,
  sortBy,
});

onResult(({ data }) => {
  if (data) {
    state.paginatedTransactions = data.paginatedTransactions;
    state.key += 1;
    if (state.page > state.paginatedTransactions.totalPages) {
      state.page = state.paginatedTransactions.totalPages;
    }
  }
});

const updateBank = (target: EventTarget) => {
  const value = (target as HTMLInputElement).value;
  state.bank = value !== "No filter applied" ? value : "";
};

const updateAccount = (target: EventTarget) => {
  const value = (target as HTMLInputElement).value;
  state.account = value !== "No filter applied" ? value : "";
};

const updateSince = (target: EventTarget) => {
  state.since = (target as HTMLInputElement).value;
};

const updateUntil = (target: EventTarget) => {
  state.until = (target as HTMLInputElement).value;
};
</script>

<style lang="css">
.scrollbar::-webkit-scrollbar {
  width: 4px;
}
.scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
.scrollbar::-webkit-scrollbar-thumb {
  background: rgb(183, 183, 183);
  border-radius: 8px;
}

/* Handle on hover */
.scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(121, 121, 121);
}
</style>
