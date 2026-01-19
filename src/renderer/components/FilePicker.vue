<template>
  <div :class="[$style.formWrapper, error && $style.error]">
    <input :value="filename(props.path)" :class="$style.textBox" type="text" disabled="true" :placeholder="placeholder"></input>
    <button @click="openFilePicker" :class="$style.editButton"><BsPencilFill /></button>
  </div>
  <span v-if="props.error" :class="$style.errorMessage">
    {{ props.error }}
  </span>
</template>

<script setup>
  import { ref, defineEmits, defineProps, watch } from 'vue';
  import { BsPencilFill } from 'vue-icons-plus/bs';

  const props = defineProps({
    placeholder: String,
    path: String,
    accept: String,
    action: String, // 'open' or 'save'
    options: Object,
    error: String,
  });

  const emit = defineEmits(['change']);

  const collapseArray = (arr) => arr.length == 1 ? arr[0] : arr;

  const openFilePicker = async () => {

    if (props.action !== 'open' && props.action !== 'save')
      throw new Error(`Invalid action "${props.action}". Must be "save" or "open"`);

    const result = await (props.action === 'open'
      ? window.hudley.showOpenDialog(props.options)
      : window.hudley.showSaveDialog(props.options));

    if (result.canceled) return;

    emit('change', result.filePath ?? collapseArray(result.filePaths));
  }

  const filename = (path) => path?.replace(/^.*[\\/]/, '');
</script>

<style module>

  .formWrapper {
    display: flex;
    flex-flow: row nowrap;
  }

  .textBox {
    border: none;
    flex-grow: 1;
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

  .editButton:hover {
    background-color: #444;
    color: white;
  }

  .editButton:active {
    background-color: white;
    color: black;
  }

  .displayNone {
    display: none;
  }

  .error {
    border: 2px solid red;
  }

  .errorMessage {
    color: red;
  }
</style>
