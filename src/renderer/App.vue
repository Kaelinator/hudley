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
      and apply
      <select v-model="viewPoints[index].f">
        <option value="kpaToAbsolutePsi">kPa to absolute psi</option>
        <option value="kpaToGuagePsi">kPa to guage psi</option>
        <option value="gasolinePoundsPerHourToGallonsPerHour">gas lbs/hr to gal/hr</option>
        <option value="fahrenheitToCelsius">&#176;F to &#176;C</option>
        <option value="celsiusToFahrenheit">&#176;C to &#176;F</option>
      </select>
      function
      and
      <input v-model="viewPoints[index].includeUnitOfMeasure" type="checkbox" /> 
      include unit of measure
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

  const KPA_TO_PSI = 0.1450377;
  const PSI_ATMOSPHERIC = 14.696;
  const POUNDS_PER_GALLON_GAS = 6.073;
  const WATER_FREEZE_POINT_FAHRENHEIGHT = 32;
  const CELSIUS_TO_FAHRENHEIT_RATIO = 1.8;

  const noOp = (x) => x;

  const functions = {
    kpaToAbsolutePsi: (x) => x * KPA_TO_PSI,
    kpaToGuagePsi: (x) => x * KPA_TO_PSI - PSI_ATMOSPHERIC,
    gasolinePoundsPerHourToGallonsPerHour: (x) => x / POUNDS_PER_GALLON_GAS,
    fahrenheitToCelsius: (x) => x / CELSIUS_TO_FAHRENHEIT_RATIO - WATER_FREEZE_POINT_FAHRENHEIGHT,
    celsiusToFahrenheit: (x) => x * CELSIUS_TO_FAHRENHEIT_RATIO + WATER_FREEZE_POINT_FAHRENHEIGHT,
  };

  const unitsOfMeasure = {
    kpaToAbsolutePsi: 'psia',
    kpaToGuagePsi: 'psig',
    gasolinePoundsPerHourToGallonsPerHour: 'gal/hr',
    fahrenheitToCelsius: '&#176;C',
    celsiusToFahrenheit: '&#176;F',
    rtc: 'ms',
    rpm: 'rpm',
    injPW: 'ms',
    dutyCycle: '%',
    targetAFR: ':1',
    afr: ':1',
    fuelFlow: 'lb/hr',
    estimatedVE: '% VE',
    ignitionTiming: '&#176;',
    map: 'kPa',
    mat: '&#176;F',
    cts: '&#176;F',
    battery: 'V',
    oilPressure: 'psi',
    tps: '% throttle',
  };

  const toText = (point, value, precision, f, includeUnitOfMeasure) => {
    const displayValue = (functions[f] || noOp)(value);
    const unitOfMeasure = f ? unitsOfMeasure[f] : unitsOfMeasure[point];
    return displayValue.toFixed(precision) + (includeUnitOfMeasure ? unitOfMeasure : '');
  };

  const renderFrame = (pointValues, context) => (viewPoints) => {
    const { width } = context.canvas;
    const { height } = context.canvas;
    console.log('rendering', pointValues, viewPoints, width, height);
    context.clearRect(0, 0, width, height);
    context.font = 'bold 144px sans-serif';
    context.fillStyle = 'white';
    context.shadowColor = 'rgb(0 0 0 / 50%)';
    context.shadowBlur = 8;
    viewPoints.forEach(({
      point, location, precision, f, includeUnitOfMeasure,
    }) => {
      if (point === '' || location === '') {
        return;
      }
      const [x, y, textAlign, textBaseline] = {
        topLeft: [0, 0, 'left', 'top'],
        topMiddle: [width / 2, 0, 'center', 'top'],
        topRight: [width, 0, 'right', 'top'],
        middleLeft: [0, height / 2, 'left', 'middle'],
        middleMiddle: [width / 2, height / 2, 'center', 'middle'],
        middleRight: [width, height / 2, 'right', 'middle'],
        bottomLeft: [0, height, 'left', 'bottom'],
        bottomMiddle: [width / 2, height, 'center', 'bottom'],
        bottomRight: [width, height, 'right', 'bottom'],
      }[location];
      context.textAlign = textAlign;
      context.textBaseline = textBaseline;
      context.fillText(toText(point, pointValues[point], precision, f, includeUnitOfMeasure), x, y);
    });
  };

  const render = async (path, allPointValues, context, viewPoints) => {
    console.log('finna render', path);
    const webmWriter = await window.hudley.createWebmWriter(path);
    const step = 1000 / 30; // ms between frames
    let { rtc } = allPointValues[0];
    let pointIndex = 0;

    while (pointIndex < allPointValues.length - 1) {
      renderFrame(allPointValues[pointIndex], context)(viewPoints);
      webmWriter.addFrame(context.canvas);
      if (rtc > allPointValues[pointIndex + 1].rtc) {
        pointIndex += 1;
      }
      rtc += step;
    }

    await webmWriter.complete();
    console.log('done rendering', path);
  };
</script>
