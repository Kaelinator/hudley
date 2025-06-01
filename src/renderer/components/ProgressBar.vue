<template>
  <div :class="$style.wrapper">
    <div :class="$style.progressWrapper">
      <progress :value="props.progress" max="1" :class="$style.progressBar"></progress>
      <div :class="$style.progressText"><slot></slot></div>
    </div>
    <Button v-if="props.cancellable" @click="onCancel" :class="$style.cancel"><CgClose /></Button>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps } from 'vue';
  import { CgClose } from 'vue-icons-plus/cg'

  import Button from './Button.vue';

  const props = defineProps({
    cancellable: { type: Boolean, default: false },
    progress: Number, // between 0 and 1
  });

  const emit = defineEmits(['cancel']);

  const onCancel = () => {
    emit('cancel');
  };
</script>

<style module>
  .wrapper {
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
    height: 30px;
  }

  .progressWrapper, .progressBar {
    height: 100%;
    width: 100%;
  }

  .progressBar {
    appearance: none;
    z-index: 1;
  }

  .progressBar::-webkit-progress-value {
    background-color: black;
    z-index: 1;
  }

  .progressText {
    font-size: 10pt;
    position: relative;
    margin-top: -23px;
    color: white;
    /* mix-blend-mode: difference; */
    padding-left: 5px;
  }

  .cancel {
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
