<template>
  <div :class="$style.wrapper">
    <label :for="id" :class="$style.label">
      {{ props.label }}
    </label>
    <div :class="$style.inputWrapper">
      <input v-model="color" :class="$style.picker" :id="id" type="color" @change="hanldeChange" :disabled="disabled" />
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, useId, ref, watch } from 'vue';
  import { AiOutlineCheck } from 'vue-icons-plus/ai';

  const props = defineProps({
    label: String,
    startValue: { type: String, default: '#000000' },
    disabled: { type: Boolean, default: false },
  });

  const id = useId();
  const color = ref(props.startValue);
  const emit = defineEmits(['change']);

  watch(() => props.startValue, (startValue) => {
    if (color.value === startValue) return;
    color.value = startValue;
    emit('change', startValue);
  });

  const hanldeChange = () => {
    emit('change', color.value);
  };
</script>

<style module>
  .wrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .inputWrapper {
    display: flex;
    flex-flow: row nowrap;
    height: 30px;
  }

  .label {
    cursor: pointer;
  }

  .picker {
    appearance: none;
    cursor: pointer;
    background-color: black;
    width: 30px;
    height: 30px;
    padding: 0;
    margin: 0;
    border: none;
  }

  .picker:disabled {
    cursor: not-allowed;
    background-color: #444;
  }

  .picker:hover {
    background-color: #444;
  }

  .picker:active {
    background-color: white;
  }
 
  .picker:disabled:active {
    background-color: #444;
  }
</style>
