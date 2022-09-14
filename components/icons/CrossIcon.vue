<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="icon icon-tabler icon-tabler-chevron-left"
    :width="size || 24"
    viewBox="0 0 24 24"
    stroke-width="4"
    stroke="#2c3e50"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M3 3L19 19" />
    <path d="M19 3L3 19" />
  </svg>
</template>

<script setup lang="ts">
const { size } = defineProps({
  size: {
    type: Number,
    default: 24,
  },
});
</script>
