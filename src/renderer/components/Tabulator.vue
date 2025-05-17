<template>
  <div ref="tabs">
    <slot></slot>
  </div>
</template>

<script setup>
  import { defineProps, inject, useTemplateRef, onMounted, watch } from 'vue';

  const props = defineProps({ tabKey: String });
  const tab = inject(props.tabKey);
  const tabs = useTemplateRef('tabs');

  onMounted(() => {
    [...tabs.value.children].forEach((e, i) => {
      if (i != 0) {
        e.classList.add('display-none');
      }
    });
  });

  watch(tab, () => {
    [...tabs.value.children].forEach(e => {
      if (e.id === tab.value) {
        e.classList.remove('display-none');
      } else {
        e.classList.add('display-none');
      }
    })
  });
</script>

<style>
.display-none {
  display: none;
}
</style>
