<template>
  <div>
    <h1>Enter file path</h1>
    <input v-model="datalogPath" placeholder="path/to/my/datalog.dl" @keyup.enter="readDatalog">
    <button @click="readDatalog">Read</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const datalogPath = ref('')

  const readDatalog = () => {
    console.log(datalogPath.value)
  }
</script>
