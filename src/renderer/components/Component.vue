<template>
  <div :class="$style.wrapper">
    <div :class="$style.barWrapper">
      <div>
        {{ dataPoint }}
      </div>
      <div :class="$style.buttonWrapper">
        <button v-if="props.editable" @click="toggleEditing" :class="$style.button">
          <BsPencilFill />
        </button>
      </div>
    </div>
    <div :class="[ $style.contentWrapper, !editing && $style.displayNone ]">
      <Select @change="setDataPoint" label="Data point:" :startValue="dataPoint">
        <option v-for="point in Object.keys(datalog.units)" :value="point">{{ point }}</option>
      </Select>
      <div :class="$style.editControlWrapper">
        <button @click="remove" :class="$style.button">
          <AiFillDelete />
        </button>
        <button @click="update" :class="$style.button">
          <AiOutlineCheck />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, inject, ref } from 'vue';
  import { BsPencilFill } from 'vue-icons-plus/bs';
  import { AiFillDelete, AiOutlineCheck } from 'vue-icons-plus/ai';

  import Select from './Select.vue';

  const props = defineProps({
    dataPoint: String, 
    editable: { type: Boolean, default: false },
  });

  const datalog = inject('datalog');

  const emit = defineEmits(['update', 'remove']);

  const editing = ref(false);
  const toggleEditing = () => {
    editing.value = !editing.value;
    if (!editing.value) {
      // revert changes
      dataPoint.value = props.dataPoint;
    }
  };

  const dataPoint = ref(props.dataPoint);
  const setDataPoint = (point) => {
    dataPoint.value = point;
  };

  const remove = () => {
    editing.value = false;
    emit('remove');
  };

  const update = () => {
    editing.value = false;
    emit('update', {
      dataPoint: dataPoint.value,
    });
  };
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
    padding: 10px;
    display: flex;
    flex-flow: column nowrap;
    gap: 10px;
  }

  .buttonWrapper {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
  }

  .editControlWrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
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
    padding: 0;
    overflow: hidden;
  }
</style>
