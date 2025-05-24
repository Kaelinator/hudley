<template>
  <div :class="$style.formWrapper">
    <input :value="path?.name" :class="$style.textBox" type="text" disabled="true" :placeholder="placeholder"></input>
    <button @click="openSaveDialog" :class="$style.editButton"><BsPencilFill /></button>
  </div>
</template>

<script setup>
  import { ref, defineEmits, defineProps, useId } from 'vue';
  // import { dialog } from 'electron';
  import { BsPencilFill } from 'vue-icons-plus/bs';

  const props = defineProps({
    placeholder: String,
    accept: String,
  });

  const emit = defineEmits(['change']);

  const id = useId();

  const path = ref(null);

  const openSaveDialog = () => {
    
  }

  const pathChanged = (e) => {
    if (e.target.files.length === 1) {
      path.value = e.target.files[0];
      emit('change', path.value);
    }
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
