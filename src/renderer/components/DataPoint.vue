<template>
  <div :class="$style.wrapper">
    <div :class="$style.barWrapper">
      <div>
        {{ props.name }}
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
    <div :class="[ $style.contentWrapper, !editing && $style.displayNone ]">
      <TextBox @change="setDisplayName" label="Name:" :startValue="name" />
      <Select @change="setUnit" label="Unit of measure:" :startValue="Symbol.keyFor(unit)">
        <option v-for="u in Object.values(units)" :value="Symbol.keyFor(u)">{{ Symbol.keyFor(u) }}</option>
      </Select>
      <Select @change="setPopulationStrategy" label="Populate:" :startValue="populationStrategy">
        <option value="manual">Manually</option>
        <option value="formulaic">Formulaically</option>
      </Select>
      <TextBox v-if="populationStrategy == 'formulaic'" @change="setFormula" label="Formula:" :startValue="formula" />
      <div :class="$style.editControlWrapper">
        <button @click="console.log" :class="$style.button">
          <AiFillDelete />
        </button>
        <button @click="console.log" :class="$style.button">
          <AiOutlineCheck />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, ref } from 'vue';
  import { BsPencilFill } from 'vue-icons-plus/bs';
  import { MdAdd } from 'vue-icons-plus/md';
  import { AiFillDelete, AiOutlineCheck } from 'vue-icons-plus/ai';

  import TextBox from './TextBox.vue';
  import Select from './Select.vue';

  import { units } from '../../shared/units';

  const props = defineProps({
    name: String, 
    unit: { type: Symbol, default: units.DIMENSIONLESS },
    editable: { type: Boolean, default: false },
  });

  const emit = defineEmits(['addToView']);

  const editing = ref(false);
  const name = ref(props.name);
  const unit = ref(props.unit);
  const populationStrategy = ref('manual');
  const formula = ref('');

  const setDisplayName = (newName) => {
    name.value = newName;
  };

  const setUnit = (unit) => {
    console.log(unit);
  };

  const setPopulationStrategy = (strat) => {
    populationStrategy.value = strat;
  };

  const setFormula = (f) => {
    formula.value = f;
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
