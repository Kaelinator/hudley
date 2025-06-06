<template>
  <div :class="$style.wrapper">
    <div :class="$style.bar">
      <CollapsibleSection title="Project Settings">
        <div :class="$style.projectSettingsForm">
          <FilePicker @change="setDatalogPath" placeholder="select your datalog.dl" :options="openDatalogOptions" action="open" />
          <NumericUpDown @change="setStartPoint" :min="0" :max="endPoint" :disabled="!datalogPath" label="Start point:" />
          <NumericUpDown @change="setEndPoint" :startValue="datalog?.points.length" :min="startPoint" :max="datalog?.points.length" :disabled="!datalogPath" label="End point:" />
          <Select @change="setFramerate" label="Framerate:" :startValue="framerate.toFixed()">
            <option value="23.976">23.976</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="29.97">29.97</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="59.94">59.94</option>
            <option value="60">60</option>
          </Select>
          <NumericUpDown @change="w => canvasWidth = w" :min="0" :startValue="canvasWidth" label="Canvas width:" />
          <NumericUpDown @change="h => canvasHeight = h" :min="0" :startValue="canvasHeight" label="Canvas height:" />
          <FilePicker @change="setRenderPath" placeholder="select your output.webm" :options="saveVideoOptions" action="save" />
          <Button v-if="!renderInProgress" @click="render" :disabled="!datalog">Render</Button>
          <ProgressBar v-else :progress="progress.progress" @cancel="cancelRender" cancellable>
            Rendering: {{ (progress.progress * 100).toFixed(0) }}%
            {{ new Date(progress.elapsedTime).toISOString().substring(11, 19) }}
            /
            {{ new Date(progress.estimatedRunTime).toISOString().substring(11, 19) }}
          </ProgressBar>
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Data Points">
        <li v-for="index in 50" :key="index">
          {{ index }}
        </li>
      </CollapsibleSection>
    </div>

    <div :class="$style.content">
      <div :class="$style.tabChangeWrapper">
        <button :class="[$style.tabChangeButton, tab === 'tab0' && $style.current]" @click="changeTab('tab0')"><BsEasel /></button>
        <button :class="[$style.tabChangeButton, tab === 'tab1' && $style.current]" @click="changeTab('tab1')"><ImTable /></button>
      </div>
      <Tabulator tabKey="main-content-tab-id">
        <div id="tab0" :class="$style.canvasWrapper">
          <Canvas :width="canvasWidth" :height="canvasHeight" />
        </div>
        <div id="tab1">Table</div>
      </Tabulator>
    </div>

    <div :class="$style.bar">
      <CollapsibleSection title="Component List">
        <li v-for="index in 10" :key="index">
          {{ index }}
        </li>
      </CollapsibleSection>
    </div>
  </div>
  <canvas :class="$style.virtualCanvas" ref="virtualCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
</template>

<script setup>
  import { ref, provide, useTemplateRef, watchEffect } from 'vue';
  import { ImTable } from 'vue-icons-plus/im';
  import { BsEasel } from 'vue-icons-plus/bs';

  import CollapsibleSection from './components/CollapsibleSection.vue';
  import Tabulator from './components/Tabulator.vue';
  import Canvas from './components/Canvas.vue';
  import FilePicker from './components/FilePicker.vue';
  import NumericUpDown from './components/NumericUpDown.vue';
  import Select from './components/Select.vue';
  import Button from './components/Button.vue';
  import ProgressBar from './components/ProgressBar.vue';
  import * as canvasUtil from './utils/canvas';

  const tab = ref('tab0');
  provide('main-content-tab-id', tab);
  const changeTab = (tabName) => {
    tab.value = tabName;
  }

  const openDatalogOptions = {
    filters: [
      { name: 'Decompressed Datalog', extensions: ['dl'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile']
  };

  const saveVideoOptions = {
    filters: [
      { name: 'WebM Video', extensions: ['webm'] },
    ],
    properties: ['showOverwriteConfirmation']
  }

  const datalogPath = ref();
  const datalog = ref();
  const setDatalogPath = async (path) => {
    datalogPath.value = path;
    datalog.value = await window.hudley.readDatalog(path);
  };
  
  const startPoint = ref(0);
  const setStartPoint = (point) => {
    startPoint.value = point;
  };

  const endPoint = ref(0);
  const setEndPoint = (point) => {
    endPoint.value = point;
  };

  const canvasWidth = ref(1280);
  const canvasHeight = ref(720);

  const framerate = ref(30);
  const setFramerate = (rate) => {
    framerate.value = +rate;
  };

  const renderPath = ref();
  const setRenderPath = (path) => {
    renderPath.value = path;
  };

  const virtualCanvas = useTemplateRef('virtualCanvas');
  watchEffect(() => {
    if (virtualCanvas.value) {
      // canvas is mounted
      // do something about it
    }
  });

  const defaultProgress = {
    frame: 0,
    totalFrames: 0,
    progress: 0,
    elapsedTime: 0,
    estimatedRunTime: 0,
  };
  const progress = ref(defaultProgress);
  const renderInProgress = ref(false);
  let cancelRender;
  const render = () => {

    const context = virtualCanvas.value.getContext('2d', { willReadFrequently: true });

    const options = {
      startPoint: startPoint.value,
      endPoint: endPoint.value,
      framerate: framerate.value,
      renderPath: renderPath.value,
    };

    const { cancel } = canvasUtil.render(context, options)
      .onProgress((p) => progress.value = p)
      .onDone(() => {
        renderInProgress.value = false;
        progress.value = defaultProgress;
      });

    cancelRender = cancel;
    renderInProgress.value = true;
  };

</script>

<style module>
  .wrapper {
    display: grid;
    grid-template-columns: 300px auto 300px;
    height: 100vh;
  }

  .bar {
    background: #D9D9D9;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .content {
    background: #E2E2E2;
    height: 100vh;
    display: grid;
  }

  .tabChangeWrapper {
    position: absolute;
  }

  .tabChangeButton {
    color: white;
    background: black;
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  .canvasWrapper {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    margin: 10px 10px;
  }

  .current {
    color: black;
    background: white;
  }

  .projectSettingsForm {
    padding: 0 10px;
    display: flex;
    flex-flow: column nowrap;
    gap: 10px;
  }

  .virtualCanvas {
    display: none;
  }
</style>

<style>
  .tabulator {
    display: grid;
    align-self: stretch;
  }
</style>
