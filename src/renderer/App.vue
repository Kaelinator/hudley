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
      <div :class="$style.tabChangeWrapper">
        <button @click="changeTab('tab0')">Tab0</button>
        <button @click="changeTab('tab1')">Tab1</button>
      </div>
      <Tabulator tabKey="main-content-tab-id">
        <div id="tab0">yuh0</div>
        <div id="tab1">yuh1</div>
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
  provide('main-content-tab-id', tab);
  const changeTab = (tabName) => {
    tab.value = tabName;
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

  .tabChangeWrapper {
    background: red;
    width: 100%;
  }
</style>
