<template>
  <div>
    <h1>Enter file path</h1>
    <input v-model="datalogPath" placeholder="path/to/my/datalog.dl" @keyup.enter="readDatalog" />
    <button @click="readDatalog">Read</button>
  </div>
  <div v-if="datalog !== null">
    Loaded datalog from {{ datalog.tuneFileName }}
    <br/>
    Canvas size: <input v-model="canvasWidth" type="number" /> x <input v-model="canvasHeight" type="number" />
    <br/>
    <div v-for="(dataPoint, index) in dataPoints">
      <select v-model="dataPoints[index].point">
        <option v-for="point in availablePoints" :value="point">{{ point }}</option>
      </select>
      at
      <select v-model="dataPoints[index].location">
        <option value="topLeft">top left</option>
        <option value="topMiddle">top middle</option>
        <option value="topRight">top right</option>
        <option value="middleLeft">middle left</option>
        <option value="middleMiddle">middle middle</option>
        <option value="middleRight">middle right</option>
        <option value="bottomLeft">bottom left</option>
        <option value="bottomMiddle">bottom middle</option>
        <option value="bottomRight">bottom right</option>
      </select>
    </div>
    <button @click="dataPoints.push({ point: '', location: '' })">Add datapoint to view</button>
    <canvas :width="canvasWidth" :height="canvasHeight" style="border:1px solid #000000;" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const datalogPath = ref('/home/kael/Code/hudley/test-data/small-datalog-0.dl');
  const datalog = ref(null);
  const availablePoints = ref([]);
  const canvasHeight = ref(1080);
  const canvasWidth = ref(1920);
  const dataPoints = ref([]);

  const readDatalog = () => {
    window.hudley.readDatalog(datalogPath.value)
      .then((parsedDatalog) => {
        datalog.value = parsedDatalog;
        availablePoints.value = parsedDatalog.points?.length > 0
          ? Object.keys(parsedDatalog.points[0])
          : [];
      })
      .catch(console.log);
  };
</script>
