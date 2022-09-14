<template>
  <div>
    <CategoryModal
      v-if="selectedCategory"
      :category="selectedCategory"
      @closeModal="closeModal"
      @upsertCategory="upsertCategory"
      @deleteCategory="deleteCategory"
    />
    <h1 class="sm:text-2xl font-bold text-center flex gap-4 mr-8 mb-6">
      <NuxtLink
        class="hover:bg-gray-100 rounded-full cursor-pointer flex content-center justify-center w-8"
        to="/"
      >
        <ChevronLeft :size="24" />
      </NuxtLink>
      {{ transaction.account.name }} - {{ transaction.account.bank }}
    </h1>
    <div class="sm:px-8">
      <div class="flex justify-between">
        <h5 class="sm:text-xl text-gray-600">
          {{ transaction.amount > 0 ? "Received" : "Spent" }}
        </h5>
        <h5
          :class="
            'sm:text-xl font-medium text-right ' +
            (transaction.amount < 0 ? 'text-red-900' : 'text-green-900')
          "
        >
          {{ transaction.currency }}$
          {{ Math.abs(transaction.amount).toFixed(2) }}
        </h5>
      </div>
      <div class="flex flex-col gap-1">
        <div class="flex justify-between">
          <h5 class="sm:text-xl text-gray-600">Reference</h5>
          <h5 class="sm:text-xl font-medium text-gray-900 text-right">
            <ExpandableInput
              :default-value="transactionReference || 'No reference provided'"
              max="35"
              @submit="submitReference"
            />
          </h5>
        </div>
        <div class="flex justify-between">
          <h5 class="sm:text-xl text-gray-600">Category</h5>
          <div class="group relative">
            <button
              class="sm:text-xl font-medium text-gray-900 text-right px-3 rounded-full hover:brightness-110 transition-all"
              :style="`background-color: #${
                transaction?.category?.color || '909090'
              } `"
            >
              {{ transaction.category?.name || "No category provided" }}
            </button>
            <CategoryAutocomplete
              :categories="categories"
              :current-category="transaction.category?.name"
              @updateTransactionCategory="updateTransactionCategory"
              @selectCategory="selectCategory"
            />
          </div>
        </div>
        <div class="flex justify-between">
          <h5 class="sm:text-xl text-gray-600">Date</h5>
          <h5 class="sm:text-xl font-medium text-gray-900 text-right">
            {{ dayjs(transaction.date).format("DD/MM/YY") }}
          </h5>
        </div>
        <div class="flex justify-between">
          <h5 class="sm:text-xl text-gray-600">Time</h5>
          <h5 class="sm:text-xl font-medium text-gray-900 text-right">
            {{ dayjs(transaction.date).format("hh:mm A") }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from "dayjs";
// eslint-disable-next-line import/named
import { Category, Transaction } from "@prisma/client";

import { reactive, toRefs } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import CategoryAutocomplete from "./CategoryAutocomplete.vue";
import CategoryModal from "./CategoryModal.vue";
import ChevronLeft from "./icons/ChevronLeft.vue";
import ExpandableInput from "./ExpandableInput.vue";
import UpsertCategoryGQL, {
  UpsertCategoryMutation,
} from "~/server/graphql/mutations/UpsertCategory";
import DeleteCategoryGQL, {
  DeleteCategoryMutation,
} from "~/server/graphql/mutations/DeleteCategory";
import UpdateTransactionGQL, {
  UpdateTransactionMutation,
} from "~/server/graphql/mutations/UpdateTransaction";
import CategoriesQueryGQL, {
  CategoriesQuery,
} from "~/server/graphql/queries/CategoriesQuery";

const { transaction } = defineProps({
  transaction: {
    type: Object as () => Transaction & {
      category?: Category;
      account: { name: string; bank: string };
    },
    required: true,
  },
});




const state = reactive({
  categories: [] as Category[],
  selectedCategory: null as (Omit<Category, "id"> & { id?: string }) | null,
  transactionReference: transaction.reference || "No reference provided",
});

const { onResult } = useQuery<CategoriesQuery>(CategoriesQueryGQL);

onResult(({ data }) => {
  state.categories = data.categories;
});

const { categories, selectedCategory, transactionReference } = toRefs(state);

const { mutate: upsertCategoryMutation }: UpsertCategoryMutation = useMutation(
  UpsertCategoryGQL,
  {
    refetchQueries: ["CategoriesQuery"],
  },
);
const { mutate: deleteCategoryMutation }: DeleteCategoryMutation = useMutation(
  DeleteCategoryGQL,
  {
    refetchQueries: ["CategoriesQuery", "TransactionsQuery"],
  },
);

const { mutate: updateTransactionMutation }: UpdateTransactionMutation =
  useMutation(UpdateTransactionGQL, {
    refetchQueries: ["TransactionsQuery"],
  });

const closeModal = () => {
  state.selectedCategory = null;
};

const selectCategory = (category: Omit<Category, "id"> & { id?: string }) => {
  state.selectedCategory = category;
};

const upsertCategory = (category: Omit<Category, "id"> & { id?: string }) => {
  upsertCategoryMutation(category).then(data => {
    updateTransactionMutation({
      transaction: {
        id: transaction.id,
        categoryId: data?.data?.upsertCategory?.id,
      },
    });
    state.selectedCategory = null;
  });
};

const deleteCategory = (categoryId: string) => {
  deleteCategoryMutation({ id: categoryId }).then(d => {
    state.selectedCategory = null;
  });
};

const updateTransactionCategory = (category: Category | null) =>
  updateTransactionMutation({
    transaction: { id: transaction.id, categoryId: category?.id || null },
  });

const submitReference = (target: EventTarget | null) => {
  if (!target) return;
  const reference = (target as HTMLInputElement).innerText || null;
  if (!reference) {
    (target as HTMLInputElement).innerText = "No reference provided";
    transactionReference.value = "No reference provided";
  }
  updateTransactionMutation({
    transaction: {
      id: transaction.id,
      reference,
    },
  });
};
</script>
