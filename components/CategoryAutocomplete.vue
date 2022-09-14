<template>
  <div
    class="hidden group-focus-within:block absolute top-full right-0 min-w-[320px] bg-white shadow-lg p-2 rounded-xl"
  >
    <label for="categorySearch" class="font-medium text-xs"
      >Search Category</label
    >
    <div class="relative">
      <input
        id="categorySearch"
        ref="inputRef"
        v-model="categoryQuery"
        type="text"
        class="box-border w-full pl-1 border-b border-black"
      />
      <button
        class="absolute right-0 top-0 bottom-0 my-auto cursor-pointer content-center"
        @click.prevent="updateTransactionCategory(null)"
      >
        <CrossIcon width="14px" />
      </button>
    </div>

    <div class="mt-2 max-h-36 overflow-y-auto">
      <button
        v-for="category in categories.filter(category =>
          category.name.toLowerCase().includes(categoryQuery.toLowerCase()),
        )"
        :key="category.id"
        class="hover:bg-gray-100 text-sm font-medium w-full text-left flex justify-between content-center h-fit"
        @click="updateTransactionCategory(category)"
      >
        <div
          class="hover:bg-gray-100 text-sm font-medium w-full text-left flex justify-between content-center h-fit"
        >
          <span
            class="my-1 px-2 rounded-full flex-shrink-0"
            :style="`background-color: #${category.color}`"
          >
            {{ category.name }}
          </span>
          <div
            class="flex justify-center content-center w-[28px] h-[28px] hover:bg-gray-200"
            @click.stop="emit('selectCategory', category)"
          >
            <EditIcon width="22px" />
          </div>
        </div>
      </button>
      <button
        class="hover:bg-gray-100 text-sm font-medium w-full text-left flex justify-between content-center h-fit pl-2"
        @click.stop="
          emit('selectCategory', { name: categoryQuery, color: '#000000' })
        "
      >
        Create new Category
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/named
import { Category } from "@prisma/client";
import { ref } from "vue";
import EditIcon from "./icons/EditIcon.vue";
import CrossIcon from "./icons/CrossIcon.vue";

const { categories, currentCategory } = defineProps({
  categories: {
    type: Array as () => Category[],
    required: true,
  },
  currentCategory: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["updateTransactionCategory", "selectCategory"]);

const categoryQuery = ref(currentCategory);
const inputRef = ref<HTMLInputElement | null>(null);
const updateTransactionCategory = (category: Category | null) => {
  emit("updateTransactionCategory", category);
  if (inputRef.value) {
    inputRef.value.blur();
    inputRef.value.value = category?.name || "";
  }
};
</script>
