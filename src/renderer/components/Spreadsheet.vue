<template>
  <table v-if="datalog" :class="$style.table">
    <thead>
      <tr :class="$style.headerRow">
        <th
          :class="[
            $style.headerCell,
            isReadonly(point) && $style.readonly,
          ]"
          v-for="point in ['point', ...Object.keys(datalog.units)]"
        >
          {{ point }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr :class="$style.row" v-for="(point, row) in datalog.points">
        <td
          :class="[
            $style.cell,
            isReadonly(key) && $style.readonly,
            selected[row * columnCount + col] && $style.selected,
            (lastClick === row * columnCount + col) && $style.lastSelected,
          ]"
          v-for="([key, value], col) in [['index', row], ...Object.entries(point)]"
          @click="select(row, col)"
        >
          <input v-if="(lastClick === row * columnCount + col)"
            type="text"
            v-model="editingCellValue"
            @change="editCellValue"
            ref="editingCell"
            :disabled="(lastClick !== row * columnCount + col)"
            :class="$style.cellInput"
          />
          <template v-else>{{ value.toFixed(0) }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { inject, defineEmits, ref, watch, watchEffect, useTemplateRef } from 'vue';

  const datalog = inject('datalog');
  const emit = defineEmits(['cellEdit']);

  const selected = ref([]); // left to right, top to bottom
  const columnCount = ref(0);
  const rowCount = ref(0);
  watchEffect(() => {
    if (!datalog.value) return;
    columnCount.value = Object.keys(datalog.value.units).length + 1; // + 1 because we add index
    rowCount.value = datalog.value.points.length;
    selected.value = Array(columnCount.value * rowCount.value).fill(false);
  });

  const getClickedCellValue = (row, col, { points, units }) => {
    if (col === 0) return row; // easy return index
    return points[row][Object.keys(units)[col - 1]];
  };

  const lastClick = ref(-1);
  const editingCellValue = ref(''); // lastClicked or something
  const select = (row, col) => {
    const clickedCell = row * columnCount.value + col;
    if (!keyIsDown.value['Control'] && !keyIsDown.value['Shift']) {

      if (col === 0 || isReadonly(Object.keys(datalog.value.units)[col - 1])) {
        return;
      }

      selected.value = Array(columnCount.value * rowCount.value).fill(false);
      selected.value[clickedCell] = true;
      lastClick.value = clickedCell;
      editingCellValue.value = getClickedCellValue(row, col, datalog.value);
      return;
    }

    if (keyIsDown.value['Shift'] && lastClick.value >= 0) {
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
      editingCellValue.value = getClickedCellValue(row, col, datalog.value);
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

  /* automatically select all text in text box upon clicking */
  const editingCell = useTemplateRef('editingCell');
  const selectText = (cell) => {
    if (editingCell.value && editingCell.value[0]) {
      editingCell.value[0].select();
    }
  }
  watch([editingCell, selected, lastClick], () => {
    setTimeout(() => selectText(editingCell));
  });

  const isReadonly = (key) => datalog.value.populationStrategies[key] !== 'manual';

  const editCellValue = () => {
    const udpatedPoints = datalog.value.points.map((point, pointIndex) => {
      const row = selected.value.slice(pointIndex * columnCount.value, pointIndex * columnCount.value + columnCount.value);

      if (row.every(cellIsSelected => !cellIsSelected)) {
        // none of the values in this point are in the user's selection
        return point;
      }

      return Object.entries(point)
        .reduce((result, [key, value], index) => ({
          ...result,
          [key]: row[index + 1] && !isReadonly(key) ? +editingCellValue.value : value,
        }), {});
    });

    emit('cellEdit', udpatedPoints);
    escape();
  };

  const escape = () => {
    editingCellValue.value = '';
    lastClick.value = -1;
    selected.value = [];
  };

  window.addEventListener('keydown', ({ key }) => {
    if (key !== 'Escape') return;
    escape();
  });
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
    background: #BBFFBB;
    color: black;
  }

  .lastSelected {
    padding: 1px;
    border: 2px solid #44FF44;
  }

  .cellInput {
    all: unset;
    min-width: 100px;
    field-sizing: content;
    cursor: text;
  }

  .readonly {
    background: #eee;
  }
</style>
