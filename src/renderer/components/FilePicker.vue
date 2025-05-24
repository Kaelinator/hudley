<template>
  <div :class="$style.formWrapper">
    <input :value="path?.name" :class="$style.textBox" type="text" disabled="true" :placeholder="placeholder"></input>
    <label for="file-picker" :class="$style.editButton"><BsPencilFill /></label>
    <input @change="pathChanged" id="file-picker" :class="$style.displayNone" type="file" :accept="accept"/>
  </div>
</template>

<script setup>
  import { ref, defineEmits, defineProps } from 'vue';
  import { BsPencilFill } from 'vue-icons-plus/bs';

  const props = defineProps({
    placeholder: String,
    accept: String,
  });

  const emit = defineEmits(['change']);

  const path = ref(null);

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
