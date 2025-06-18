<template>
  <div :class="$style.wrapper">
    <label :for="id">
      {{ props.label }}
    </label>
    <div :class="$style.inputWrapper">
      <input v-model="text" :class="$style.textBox" :id="id" type="text" @change="hanldeChange" :disabled="disabled" />
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, useId, ref, watch } from 'vue';

  const props = defineProps({
    label: String,
    startValue: String,
    disabled: { type: Boolean, default: false },
  });

  const id = useId();
  const text = ref(props.startValue);
  const emit = defineEmits(['change']);

  watch(() => props.startValue, (startValue) => {
    if (text.value === startValue) return;
    text.value = startValue;
    emit('change', startValue);
  });

  const hanldeChange = () => {
    emit('change', text.value);
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

  .textBox {
    border: none;
    background-color: white;
    color: black;
    width: 130px;
    padding: 0;
  }
</style>
