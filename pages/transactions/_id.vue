<template>
  <ApolloQuery
    :query="TransactionsQueryGQL"
    :variables="{ transactionsId: $route.params.id }"
  >
    <template #default="{ result: { error, data, loading } }">
      <div
        class="h-screen w-screen overflow-hidden bg-gray-100 flex justify-center items-center"
      >
        <div
          class="bg-white p-5 rounded-lg shadow-lg max-w-full sm:min-w-max sm:w-4/12 sm:h-4/5 flex flex-col"
        >
          <TransactionContainer
            key="$route.params.id"
            v-if="data?.transactions && data.transactions.length > 0"
            :transaction="data.transactions[0]"
          />
        </div>
      </div>
    </template>
  </ApolloQuery>
</template>

<script setup lang="ts">
import TransactionContainer from "~/components/TransactionContainer.vue";
import TransactionsQueryGQL from "~/server/graphql/queries/TransactionsQuery";
</script>

<style scoped></style>
