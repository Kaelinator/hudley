<template>
  <div :class="$style.displayResizer">
    <img :class="$style.display" :src="frame" />
    <canvas :class="$style.displayNone" ref="renderer" :width="width" :height="height" />
  </div>
</template>

<script setup>
  import { defineProps, ref, useTemplateRef, watchEffect } from 'vue';

  import { renderFrame } from '../utils/canvas';

  const props = defineProps({
    width: Number,
    height: Number,
  });

  const frame = ref("");

  const canvas = useTemplateRef('renderer');
  watchEffect(() => {
    if (canvas.value) {
      // canvas is mounted
      const context = canvas.value.getContext('2d');
      frame.value = renderFrame(context).frame;
    }
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
    background-position: 0 0, 40px 40px;
    background-size: 80px 80px;
    background-color: #bdbdbd;
    border: 1px solid #000000;
  }

  .displayNone {
    display: none;
  }
</style>
