<template>
  <div :class="$style.checkered">
    <canvas :class="$style.canvas" ref="renderer" />
    <!-- <canvas ref="renderer" :width="width" :height="height" /> -->
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
  .checkered {
    background-image: repeating-conic-gradient(#606060 0% 25%, #bdbdbd 0% 50%);
    background-position: 0 0, 45px 45px;
    background-size: 90px 90px;
    background-color: #bdbdbd;
    /* width: max-content;
    height: max-content;
    overflow: hidden; */
    border: 1px solid #000000;
  }
  
  .canvas {
    object-fit: cover;
  }
</style>
