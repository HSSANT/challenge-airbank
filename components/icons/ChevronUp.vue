<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="icon icon-tabler icon-tabler-chevron-left"
    :width="size || 24"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="#2c3e50"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 15 12 9 18 15" />
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
