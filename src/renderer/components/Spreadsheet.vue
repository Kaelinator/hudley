<template>
  <table v-if="datalog" :class="$style.table">
    <thead>
      <tr :class="$style.headerRow">
        <th :class="$style.headerCell" v-for="point in ['point', ...Object.keys(datalog.units)]">{{ point }}</th>
      </tr>
    </thead>
    <tbody>
      <tr :class="$style.row" v-for="(point, row) in datalog.points">
        <td
          :class="[
            $style.cell,
            selected[row * columnCount + col] && $style.selected,
            (lastClick === row * columnCount + col) && $style.lastSelected,
          ]"
          v-for="(value, col) in [row, ...Object.values(point)]"
          @click="select(row, col)"
        >
        {{ value.toFixed(0) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { inject, ref, watchEffect } from 'vue';
  // import { defineEmits, defineProps, inject, ref } from 'vue';

  const datalog = inject('datalog');

  const selected = ref([]); // left to right, top to bottom
  const columnCount = ref(0);
  const rowCount = ref(0);
  watchEffect(() => {
    if (!datalog.value) return;
    columnCount.value = Object.keys(datalog.value.units).length + 1; // + 1 because we add index
    rowCount.value = datalog.value.points.length;
    selected.value = Array(columnCount.value * rowCount.value).fill(false);
  });

  const lastClick = ref(-1);
  const select = (row, col) => {
    const clickedCell = row * columnCount.value + col;
    if (!keyIsDown.value['Control'] && !keyIsDown.value['Shift']) {
      selected.value = Array(columnCount.value * rowCount.value).fill(false);
      selected.value[clickedCell] = true;
      lastClick.value = clickedCell;
      return;
    }

    if (keyIsDown.value['Shift']) {
      if (!keyIsDown.value['Control']) {
        selected.value = Array(columnCount.value * rowCount.value).fill(false);
      }
      const cellA = Math.min(clickedCell, lastClick.value);
      const rowA = Math.floor(cellA / columnCount.value);
      const colA = cellA % columnCount.value;

      const cellB = Math.max(clickedCell, lastClick.value);
      const rowB = Math.floor(cellB / columnCount.value);
      const colB = cellB % columnCount.value;

      const fromRow = Math.min(rowA, rowB);
      const toRow = Math.max(rowA, rowB);
      const fromCol = Math.min(colA, colB);
      const toCol = Math.max(colA, colB);

      for (let r = fromRow; r <= toRow; r += 1) {
        for (let c = fromCol; c <= toCol; c += 1) {
          selected.value[r * columnCount.value + c] = true;
        }
      }
      return;
    };

    if (keyIsDown.value['Control']) {
      selected.value[clickedCell] = true;
      lastClick.value = clickedCell;
      return;
    };

  };

  const keyIsDown = ref({});
  const setKeyDown = ({ key }, held) => {
    keyIsDown.value = {
      ...keyIsDown.value,
      [key]: held,
    };
  };

  window.addEventListener('keydown', (e) => setKeyDown(e, true));
  window.addEventListener('keyup', (e) => setKeyDown(e, false));
</script>

<style module>
  .table {
    display: block;
    border-spacing: 0;
    margin-top: 40px;
    overflow: scroll;
    height: calc(100vh - 40px);
    cursor: crosshair;
    user-select: none;
  }

  .headerRow {
    background: white;
  }

  .headerCell {
    min-width: 100px;
    padding: 3px;
  }

  .headerRow .headerCell:first-child {
    border: 1px solid black;
  }

  .headerRow .headerCell {
    border: 1px solid black;
    border-left: none;
  }

  .cell:first-child {
    border: 1px solid black;
    border-top: none;
  }

  .cell {
    border: 1px solid black;
    border-top: none;
    border-left: none;
    padding: 3px;
    background: white;
  }

  .selected {
    background: #444;
    color: white;
  }

  .lastSelected {
    padding: 1px;
    border: 2px solid white;
  }
</style>
