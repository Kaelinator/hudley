<template>
  <div :class="$style.wrapper">
    <label :for="id">
      {{ props.label }}
    </label>
    <div :class="$style.inputWrapper">
      <select v-model="value" :class="$style.select" :id="id" @change="handleChange" :disabled="disabled">
        <slot></slot>
      </select>
      <div :class="$style.arrow" :disabled="disabled"><EpCaretBottom /></div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, useId, ref, watch } from 'vue';
  import { EpCaretBottom, EpCaretTop } from 'vue-icons-plus/ep';

  const props = defineProps({
    label: String,
    startValue: String,
    disabled: { type: Boolean, default: false },
  });

  const id = useId();
  const value = ref(props.startValue);
  const emit = defineEmits(['change']);

  watch(() => props.startValue, (startValue) => {
    if (value.value === startValue) return;
    value.value = startValue;
    emit('change', startValue);
  });

  const handleChange = () => {
    emit('change', value.value);
  }
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
    background: white;
  }

  .inputWrapper:has(.select:disabled) {
    background-color: #f7f7f7;
  }

  .select {
    appearance: none;
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: 130px;
    z-index: 1;
    color: black;
  }

  .select:disabled {
    appearance: none;
    cursor: not-allowed;
    color: black;
    background-color: transparent;
    opacity: 1;
  }

  .arrow {
    /* ugly. whatever. */
    position: relative;
    margin-left: -30px;
    background-color: black;
    color: white;
    text-align: center;
    height: 30px;
    width: 30px;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .select:disabled + .arrow {
    cursor: not-allowed;
    background-color: #444;
  }

  .select:hover + .arrow {
    background-color: #444;
    color: white;
  }

  .select:active + .arrow {
    background-color: white;
    color: black;
    transform: rotate(180deg);
  }

  .select:disabled:active + .arrow {
    color: white;
    background-color: #444;
    transform: rotate(0deg);
  }
</style>
