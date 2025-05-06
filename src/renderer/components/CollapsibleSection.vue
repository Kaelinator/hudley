<template>
  <div :class="$style.wrapper">
    <div :class="$style.header" @click="toggleCollapsed">
      <h1>{{ title }}</h1>
      <div :class="$style.collapsedStatus">
        {{ collapsed ? '+' : '-' }}
      </div>
    </div>
    <div :class="$style.content">
      <div :class="{ [$style.hidden]: collapsed }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const props = defineProps({
    title: String
  });
  const collapsed = ref(false);
  const toggleCollapsed = () => collapsed.value = !collapsed.value;
</script>

<style module>
  .wrapper {
    overflow: hidden;
  }

  .header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    cursor: pointer;
  }

  .content {
    
  }

  .hidden {
    height: 0;
  }

  .collapsedStatus {
    align-self: center;
  }
</style>

