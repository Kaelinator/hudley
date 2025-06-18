<template>
  <div :class="$style.wrapper">
    <label :for="id" :class="$style.label">
      {{ props.label }}
    </label>
    <div :class="$style.inputWrapper">
      <input v-model="checked" :class="$style.checkBox" :id="id" type="checkbox" @change="hanldeChange" :disabled="disabled" />
      <AiOutlineCheck :class="$style.checkMark" />
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, useId, ref, watch } from 'vue';
  import { AiOutlineCheck } from 'vue-icons-plus/ai';

  const props = defineProps({
    label: String,
    startValue: Boolean,
    disabled: { type: Boolean, default: false },
  });

  const id = useId();
  const checked = ref(props.startValue);
  const emit = defineEmits(['change']);

  watch(() => props.startValue, (startValue) => {
    if (checked.value === startValue) return;
    checked.value = startValue;
    emit('change', startValue);
  });

  const hanldeChange = () => {
    emit('change', checked.value);
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

  .checkBox {
    appearance: none;
    z-index: 2;
    cursor: pointer;
    border: 2px solid white;
    background-color: transparent;
    color: black;
    width: 20px;
    height: 20px;
    padding: 0;
    margin: 5px;
    box-shadow: 0 0 0 5px black;
  }

  .checkBox:disabled {
    cursor: not-allowed;
    box-shadow: 0 0 0 5px #444;
  }

  .checkBox:hover {
    box-shadow: 0 0 0 5px #444;
    color: white;
    border-color: white;
  }

  .checkBox:active {
    box-shadow: 0 0 0 5px white;
    color: black;
    border-color: black;
  }
 
  .checkBox:disabled:active {
    color: white;
    border-color: white;
    box-shadow: 0 0 0 5px #444;
  }

  .checkMark {
    /* ugly. whatever. */
    position: relative;
    opacity: 1;
    z-index: 1;
    width: 16px;
    height: 16px;
    margin-left: -16px;
    top: 7px; 
    right: 7px;
    color: black;
    background-color: black;
  }

  .checkBox:checked + .checkMark {
    color: white;
    background-color: black;
  }


  .checkBox:checked:hover + .checkMark {
    background-color: #444;
    color: white;
  }

  .checkBox:hover + .checkMark {
    background-color: #444;
    color: #444;
  }

  .checkBox:checked:active + .checkMark {
    color: black;
    background-color: white;
  }

  .checkBox:active + .checkMark {
    color: white;
    background-color: white;
  }

  .checkBox:checked:disabled + .checkMark {
    cursor: not-allowed;
    color: white;
    background-color: #444;
  }

  .checkBox:disabled + .checkMark {
    cursor: not-allowed;
    color: #444;
    background-color: #444;
  }
</style>
