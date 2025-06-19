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
      <Select @change="dataPoint => update({ dataPoint })" label="Data point:" :startValue="props.dataPoint">
        <option v-for="point in Object.keys(datalog.units)" :value="point">{{ point }}</option>
      </Select>
      <NumericUpDown @change="x => update({ x })" :startValue="props.x" label="X:" />
      <NumericUpDown @change="y => update({ y })" :startValue="props.y" label="Y:" />
      <NumericUpDown @change="decimalPlaces => update({ decimalPlaces })" :min="0" :startValue="props.decimalPlaces" label="Decimal places:" />
      <Select @change="u => update({ unitOfMeasure: Symbol.for(u) })" label="Unit of measure:" :startValue="Symbol.keyFor(props.unitOfMeasure)">
        <option v-for="u in Object.values(units)" :value="Symbol.keyFor(u)">{{ Symbol.keyFor(u) }}</option>
      </Select>
      <CheckBox @change="showUnitOfMeasure => update({ showUnitOfMeasure })" :startValue="props.showUnitOfMeasure" label="Show unit of measure:" />
      <TextBox @change="label => update({ label })" label="Label:" :startValue="props.label" />
      <Select @change="font => update({ font })" label="Font:" :startValue="props.font">
        <option v-for="font in fonts" :value="font.postscriptName">{{ font.fullName }}</option>
      </Select>
      <NumericUpDown @change="size => update({ size })" :min="0" :startValue="props.size" label="Size:" />
      <Select @change="justify => update({ justify })" label="Justify:" :startValue="props.justify">
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </Select>
      <Select @change="align => update({ align })" label="Align:" :startValue="props.align">
        <option value="top">Top</option>
        <option value="middle">Middle</option>
        <option value="bottom">Bottom</option>
      </Select>
      <ColorPicker @change="fill => update({ fill })" :startValue="props.fill" label="Fill:" />
      <ColorPicker @change="stroke => update({ stroke })" :startValue="props.stroke" label="Stroke:" />
      <NumericUpDown @change="strokeWeight => update({ strokeWeight })" :min="0" :startValue="props.strokeWeight" label="Stroke weight:" />
      <div :class="$style.editControlWrapper">
        <button @click="remove" :class="$style.button">
          <AiFillDelete />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, inject, ref  } from 'vue';
  import { BsPencilFill } from 'vue-icons-plus/bs';
  import { AiFillDelete } from 'vue-icons-plus/ai';

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
    showUnitOfMeasure: { type: Boolean, default: false },
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
  emit('update', component.value); // sync with props

  const remove = () => {
    editing.value = false;
    emit('remove');
  };

  const update = (content) => {
    component.value = {
      ...component.value,
      ...content
    };
    console.log('update', content);
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
