<template>
  <div :class="$style.wrapper">
    <label :for="id">
      {{ props.label }}
    </label>
    <div :class="$style.inputWrapper">
      <input v-model="value" :class="$style.nud" :id="id" type="number" @change="hanldeChange" :disabled="disabled" />
      <div :class="$style.buttonWrapper">
        <button @click="add(props.step)" :class="$style.arrow" :disabled="disabled"><EpCaretTop size="15px" /></button>
        <button @click="add(-props.step)" :class="$style.arrow" :disabled="disabled"><EpCaretBottom size="15px" /></button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, useId, ref, watch } from 'vue';
  import { EpCaretBottom, EpCaretTop } from 'vue-icons-plus/ep';

  const props = defineProps({
    label: String,
    min: Number,
    max: Number,
    step: { type: Number, default: 1 },
    startValue: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
  });

  const id = useId();
  const value = ref(props.startValue);
  const emit = defineEmits(['change']);

  watch(() => props.startValue, (startValue) => {
    value.value = startValue;
    emit('change', startValue);
  });

  const add = (n) => {
    const newValue = value.value + n;

    if (newValue < props.min || newValue > props.max) {
      return;
    }

    value.value = newValue;
    emit('change', newValue);
  };

  const hanldeChange = () => {
    const newValue = value.value < props.min
      ? props.min
      : value.value > props.max
      ? props.max
      : value.value;

    value.value = newValue;
    emit('change', newValue);
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

  .nud::-webkit-outer-spin-button,
  .nud::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .nud {
    border: none;
    background-color: white;
    color: black;
    width: 100px;
    padding: 0;
  }

  .nud:disabled {
    cursor: not-allowed;
    background-color: #f7f7f7;
  }

  .buttonWrapper {
    display: flex;
    flex-flow: column nowrap;
    width: 30px;
  }

  .buttonWrapper::before {
    align-self: stretch;
    content: '';
    border-top: 1px solid white;
  }

  .buttonWrapper .arrow:first-child {
    order: -1;
  }

  .arrow {
    background-color: black;
    color: white;
    text-align: center;
    height: 15px;
    cursor: pointer;
    border: none;
  }

  .arrow:disabled {
    cursor: not-allowed;
    background-color: #444;
  }

  .arrow:hover {
    background-color: #444;
    color: white;
  }

  .arrow:active {
    background-color: white;
    color: black;
  }

  .arrow:disabled:active {
    color: white;
    background-color: #444;
  }

</style>
