<template>
  <span
    type="text"
    class="font-medium text-right break-words border-b border-gray-700 focus:outline-none"
    contenteditable="true"
    role="textbox"
    @blur="emit('submit', $event.target)"
    @keydown="limitCharacters($event, maxChars)"
  >
    {{ defaultValue }}
  </span>
</template>

<script setup lang="ts">
const { defaultValue, maxChars } = defineProps({
  defaultValue: {
    type: String,
    required: true,
  },
  maxChars: {
    type: Number,
    default: 35,
  },
});
const emit = defineEmits(["submit"]);

const limitCharacters = (event: KeyboardEvent, maxChars: number) => {
  const target = event.target;
  const reference = (target as HTMLInputElement).innerText || null;
  if (!reference) return;
  if (
    (reference.length > maxChars && event.key.length === 1) ||
    event.key === "Enter"
  ) {
    event.preventDefault();
  }
};
</script>
