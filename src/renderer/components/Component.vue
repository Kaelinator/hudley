<template>
  <div :class="$style.wrapper">
    <div :class="$style.barWrapper">
      <div>
        {{ props.dataPoint }}
      </div>
      <div :class="$style.buttonWrapper">
        <button v-if="props.editable" @click="toggleEditing" :class="$style.button">
          <BsPencilFill />
        </button>
      </div>
    </div>
    <div :class="[ $style.contentWrapper, !editing && $style.displayNone ]">
      <Select @change="p => component.dataPoint = p" label="Data point:" :startValue="component.dataPoint">
        <option v-for="point in Object.keys(datalog.units)" :value="point">{{ point }}</option>
      </Select>
      <NumericUpDown @change="x => component.x = x" :startValue="component.x" label="X:" />
      <NumericUpDown @change="y => component.y = y" :startValue="component.y" label="Y:" />
      <NumericUpDown @change="n => component.decimalPlaces = n" :min="0" :startValue="component.decimalPlaces" label="Decimal places:" />
      <Select @change="u => component.unitOfMeasure = Symbol.for(u)" label="Unit of measure:" :startValue="Symbol.keyFor(component.unitOfMeasure)">
        <option v-for="u in Object.values(units)" :value="Symbol.keyFor(u)">{{ Symbol.keyFor(u) }}</option>
      </Select>
      <CheckBox @change="b => component.showUnitOfMeasure = b" :startValue="component.showUnitOfMeasure" label="Show unit of measure:" />
      <TextBox @change="t => component.label = t" label="Label:" :startValue="component.label" />
      <Select @change="f => component.font = f" label="Font:" :startValue="component.font">
        <option v-for="font in fonts" :value="font.postscriptName">{{ font.fullName }}</option>
      </Select>
      <NumericUpDown @change="n => component.size = n" :min="0" :startValue="component.size" label="Size:" />
      <Select @change="j => component.justify = j" label="Justify:" :startValue="component.justify">
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </Select>
      <Select @change="a => component.align = a" label="Align:" :startValue="component.align">
        <option value="top">Top</option>
        <option value="middle">Middle</option>
        <option value="bottom">Bottom</option>
      </Select>
      <ColorPicker @change="c => component.fill = c" :startValue="component.fill" label="Fill:" />
      <ColorPicker @change="c => component.stroke = c" :startValue="component.stroke" label="Stroke:" />
      <NumericUpDown @change="n => component.strokeWeight = n" :min="0" :startValue="component.strokeWeight" label="Stroke weight:" />
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
  import NumericUpDown from './NumericUpDown.vue';
  import TextBox from './TextBox.vue';
  import CheckBox from './CheckBox.vue';
  import ColorPicker from './ColorPicker.vue';

  import { units } from '../../shared/units';

  const props = defineProps({
    editable: { type: Boolean, default: false },
    dataPoint: String, 
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    decimalPlaces: { type: Number, default: 1 },
    unitOfMeasure: { type: Symbol, default: units.DIMENSIONLESS },
    showUnitOfMeasure: { type: Boolean, default: true },
    label: { type: String, default: '' }, 
    font: { type: String, default: 'sans-serif' },
    size: { type: Number, default: 24 },
    justify: { type: String, default: 'center' },
    align: { type: String, default: 'middle' },
    fill: { type: String, default: '#000000' }, 
    stroke: { type: String, default: '#000000' }, 
    strokeWeight: { type: Number, default: 0 },
  });

  const datalog = inject('datalog');
  const fonts = inject('fonts');

  const emit = defineEmits(['update', 'remove']);

  const editing = ref(false);
  const toggleEditing = () => {
    editing.value = !editing.value;
    if (!editing.value) {
      // revert changes
      const { editable, ...componentProps } = props;
      component.value = componentProps;
    }
  };

  const component = ref({
    dataPoint: props.dataPoint,
    x: props.x,
    y: props.y,
    decimalPlaces: props.decimalPlaces,
    unitOfMeasure: props.unitOfMeasure,
    showUnitOfMeasure: props.showUnitOfMeasure,
    label: props.label,
    font: props.font,
    size: props.size,
    justify: props.justify,
    align: props.align,
    fill: props.fill,
    stroke: props.stroke,
    strokeWeight: props.strokeWeight,
  });

  const remove = () => {
    editing.value = false;
    emit('remove');
  };

  const update = () => {
    editing.value = false;
    emit('update', component.value);
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
