<template>
  <div :class="$style.wrapper">
    <div :class="$style.bar">
      <CollapsibleSection title="Project Settings">
        <li v-for="index in 10" :key="index">
          {{ index }}
        </li>
      </CollapsibleSection>
      <CollapsibleSection title="Data Points">
        <li v-for="index in 50" :key="index">
          {{ index }}
        </li>
      </CollapsibleSection>
    </div>

    <div :class="$style.content">
      <button @click="changeTab">Change Tab</button>
      <Tabulator tabKey="main-content">
        <h1 id="tab0">yuh0</h1>
        <h1 id="tab1">yuh1</h1>
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
</template>

<script setup>
  import { ref, provide } from 'vue';
  import CollapsibleSection from './components/CollapsibleSection.vue';
  import Tabulator from './components/Tabulator.vue';

  const tab = ref('tab0');
  provide('main-content', tab);
  const changeTab = () => {
    tab.value = 'tab' + (+tab.value.slice(-1)[0] + 1) % 2;
  }
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
  }
</style>
