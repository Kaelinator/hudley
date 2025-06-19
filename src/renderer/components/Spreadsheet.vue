<template>
  <table v-if="datalog" :class="$style.table">
    <thead>
      <tr :class="$style.headerRow">
        <th :class="$style.headerCell" v-for="point in ['point', ...Object.keys(datalog.units)]">{{ point }}</th>
      </tr>
    </thead>
    <tbody>
      <tr :class="$style.row" v-for="(point, index) in datalog.points">
        <td :class="$style.cell" v-for="value in [index, ...Object.values(point)]">{{ value.toFixed(0) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { inject } from 'vue';
  // import { defineEmits, defineProps, inject, ref } from 'vue';

  const datalog = inject('datalog');
</script>

<style module>
  .table {
    display: block;
    border-spacing: 0;
    margin-top: 40px;
    overflow: scroll;
    height: calc(100vh - 40px);
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

</style>
