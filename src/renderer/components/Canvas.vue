<template>
  <div :class="$style.displayResizer">
    <img :class="$style.display" src="https://i.ytimg.com/vi/6XDWPp9RNJk/maxresdefault.jpg" />
    <canvas :class="$style.displayNone" ref="renderer" :width="width" :height="height" />
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';
  const props = defineProps({
    width: Number,
    height: Number,
  });


</script>

<style module>
  .displayResizer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 20px);
    width: 100%;
    overflow: hidden;
  }

  .display {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    box-sizing: border-box;
    background-image: repeating-conic-gradient(#606060 0% 25%, #bdbdbd 0% 50%);
    background-position: 0 0, 45px 45px;
    background-size: 90px 90px;
    background-color: #bdbdbd;
    border: 1px solid #000000;
  }

  .displayNone {
    display: none;
  }
</style>
