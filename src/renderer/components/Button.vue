<template>
  <button :class="$style.button" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup>
  import { defineEmits, defineProps } from 'vue';

  const props = defineProps({
    disabled: { type: Boolean, default: false },
  });
</script>

<style module>
  .button {
    text-align: center;
    color: white;
    background-color: black;
    border: none;
    height: 30px;
    cursor: pointer;
  }

  .button:disabled {
    cursor: not-allowed;
    background-color: #444;
  }

  .button:hover {
    background-color: #444;
    color: white;
  }

  .button:active {
    background-color: white;
    color: black;
  }
 
  .button:disabled:active {
    color: white;
    background-color: #444;
  }
</style>

