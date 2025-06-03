<template>
  <div :class="$style.wrapper">
    <div :class="$style.barWrapper">
      <div>
        {{ props.displayName }}
      </div>
      <div :class="$style.buttonWrapper">
        <button v-if="props.editable" @click="editing = !editing" :class="$style.button">
          <BsPencilFill />
        </button>
        <button @click="console.log" :class="$style.button">
          <MdAdd />
        </button>
      </div>
    </div>
    <div :class="[ $style.contentWrapper, !editing && $style.displayNone ]">content</div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, ref } from 'vue';
  import { BsPencilFill } from 'vue-icons-plus/bs';
  import { MdAdd } from 'vue-icons-plus/md'

  const props = defineProps({
    name: String, 
    displayName: String,
    unit: Symbol,
    editable: { type: Boolean, default: false },
  });

  const emit = defineEmits(['addToView']);

  const editing = ref(false);
</script>

<style module>
  .barWrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }

  .contentWrapper {
    background-color: #b5b5b5;
  }

  .buttonWrapper {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
  }

  .button {
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

  .button:hover {
    background-color: #444;
    color: white;
  }

  .button:active {
    background-color: white;
    color: black;
  }

  .displayNone {
    height: 0;
    overflow: hidden;
  }
</style>
