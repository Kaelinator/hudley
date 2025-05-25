<template>
  <div :class="$style.formWrapper">
    <input :value="path" :class="$style.textBox" type="text" disabled="true" :placeholder="placeholder"></input>
    <button @click="openFilePicker" :class="$style.editButton"><BsPencilFill /></button>
  </div>
</template>

<script setup>
  import { ref, defineEmits, defineProps } from 'vue';
  import { BsPencilFill } from 'vue-icons-plus/bs';

  const props = defineProps({
    placeholder: String,
    accept: String,
    action: String, // 'open' or 'save'
    options: Object,
  });

  const emit = defineEmits(['change']);

  const path = ref(null);
  
  const collapseArray = (arr) => arr.length == 1 ? arr[0] : arr;

  const openFilePicker = async () => {

    if (props.action !== 'open' && props.action !== 'save')
      throw new Error('Invalid action "' + props.action + '". Must be "save" or "open"');

    const result = await (props.action === 'open'
      ? window.hudley.showOpenDialog(props.options)
      : window.hudley.showSaveDialog(props.options));

    if (result.canceled) return;

    path.value = result.basename ?? result.basenames.join(', ');
    emit('change', result.filePath ?? collapseArray(result.filePaths));
  }
</script>

<style module>

  .formWrapper {
    display: flex;
    flex-flow: row nowrap;
  }

  .textBox {
    border: none;
    width: 100%;
  }

  .textBox:disabled {
    background-color: white;
    color: black;
  }

  .editButton {
    padding: 0;
    display: flex;
    color: white;
    background: black;
    border: none;
    width: 30px;
    height: 30px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
  }

  .displayNone {
    display: none;
  }
</style>
