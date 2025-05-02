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
    <div v-for="(dataPoint, index) in viewPoints">
      <select v-model="viewPoints[index].point">
        <option v-for="point in availablePoints" :value="point">{{ point }}</option>
      </select>
      at
      <select v-model="viewPoints[index].location">
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
      with 
      <input v-model="viewPoints[index].precision" type="number" min="0" step="1" />
      decimal place{{ viewPoints[index].precision === 1 ? '' : 's' }}
      <button @click="viewPoints.splice(index, 1)">delete</button>
    </div>
    <button @click="viewPoints.push({ point: '', location: '', precision: 0 })">Add datapoint to view</button>
    <br/>
    <input v-model="renderPath" placeholder="path/to/output.webm" @keyup.enter="renderFile(renderPath)" />
    <button @click="renderFile(renderPath)">Render</button>
    <div class="checkered">
      <canvas ref="renderer" :width="canvasWidth" :height="canvasHeight" />
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, watch, watchEffect, useTemplateRef } from 'vue';
  import { renderFrame, render } from './webm-renderer/renderer';

  const datalogPath = ref('/home/kael/Code/hudley/test-data/small-datalog-0.dl');
  const renderPath = ref('/home/kael/Code/hudley/test-data/out.webm');
  const datalog = ref(null);
  const availablePoints = ref([]);
  const canvasHeight = ref(1080);
  const canvasWidth = ref(1920);
  const viewPoints = reactive([]);

  const canvas = useTemplateRef('renderer');

  const readDatalog = () => {
    window.hudley.readDatalog(datalogPath.value)
      .then((parsedDatalog) => {
        if (parsedDatalog.points?.length <= 0) {
          throw new Error('No data points in datalog');
        }
        datalog.value = parsedDatalog;
        console.log(parsedDatalog);
        availablePoints.value = Object.keys(parsedDatalog.points[0]);
        watchEffect(() => {
          if (canvas.value) {
            // component is mounted
            watch(viewPoints, renderFrame(datalog.value.points[0], canvas.value.getContext('2d')));
          }
        })
      })
      .catch(console.log);
  };

  const renderFile = (path) => {
    render(path, datalog.value.points, canvas.value.getContext('2d'), viewPoints);
  }

</script>
