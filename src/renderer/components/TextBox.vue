<template>
  <div :class="$style.wrapper">
    <label :for="id">
      {{ props.label }}
    </label>
    <div :class="$style.inputWrapper">
      <input
        v-model="text"
        :class="[$style.textBox, props.error && $style.error]"
        :id="id"
        type="text"
        @change="handleChange"
        :disabled="disabled"
      />
    </div>
  </div>
  <span v-if="props.error" :class="$style.errorMessage">
    {{ props.error }}
  </span>
</template>

<script setup>
  import { defineEmits, defineProps, useId, ref, watch } from 'vue';

  const props = defineProps({
    label: String,
    startValue: String,
    disabled: { type: Boolean, default: false },
    error: { type: String },
  });

  const id = useId();
  const text = ref(props.startValue);
  const emit = defineEmits(['change']);

  watch(() => props.startValue, (startValue) => {
    if (text.value === startValue) return;
    text.value = startValue;
    emit('change', startValue);
  });

  const handleChange = () => {
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

  .error {
    border: 2px solid red;
  }

  .errorMessage {
    color: red;
  }
</style>
