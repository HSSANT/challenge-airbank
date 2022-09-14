<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="icon icon-tabler icon-tabler-chevrons-left"
    :width="size || 24"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="#2c3e50"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="11 7 6 12 11 17" />
    <polyline points="17 7 12 12 17 17" />
  </svg>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ChevronsLeft",
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
});
</script>
