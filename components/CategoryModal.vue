<template>
  <div class="absolute top-0 left-0 w-screen h-screen">
    <div
      class="absolute top-0 left-0 bottom-0 right-0 m-auto h-fit flex justify-center content-center z-30 select-none"
    >
      <div class="p-3 bg-white rounded-lg shadow-xl">
        <h3 class="flex gap-4 font-bold">
          <div
            class="flex content-center cursor-pointer"
            @click="emit('closeModal')"
          >
            <CrossIcon width="18px" />
          </div>

          {{ category.id ? "Edit" : "Add" }} Category
        </h3>
        <form
          class="mx-8"
          @submit.prevent="
            emit('upsertCategory', {
              name: categoryName,
              color: categoryColor,
              id: category.id,
            })
          "
        >
          <div>
            <span class="text-xs font-medium">Category Name</span><br />
            <input
              v-model="categoryName"
              type="text"
              class="w-full pl-2 border-b-2 border-gray-400"
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <span class="text-xs font-medium">Category Color</span><br />
            <input
              v-model="categoryColor"
              type="color"
              class="w-full bg-transparent"
              placeholder="Enter category color"
            />
          </div>
          <button
            class="w-full mt-1 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
            type="submit"
          >
            {{ category?.id ? "Update" : "Create" }} Category
          </button>
          <button
            v-if="category?.id"
            class="w-full mt-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
            @click.prevent="emit('deleteCategory', category.id)"
          >
            Delete Category
          </button>
        </form>
      </div>
    </div>
    <div
      class="absolute top-0 w-screen h-screen bg-black opacity-10 z-10 cursor-pointer"
      @click="emit('closeModal')"
    ></div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/named
import { Category } from "@prisma/client";
import { ref } from "vue";
import CrossIcon from "./icons/CrossIcon.vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { category } = defineProps({
  category: {
    type: Object as () => Omit<Category, "id"> & {
      id?: string;
    },
    default: () => ({
      name: "",
      color: "6464dd",
    }),
  },
});
const categoryName = ref(category.name);
const categoryColor = ref(
  category.color?.includes("#") ? category.color : `#${category.color}`,
);

const emit = defineEmits(["closeModal", "upsertCategory", "deleteCategory"]);
</script>
