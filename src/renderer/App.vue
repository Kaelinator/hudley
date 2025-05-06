<template>
  <div class="wrapper">
    <div class="bar">
    </div>

    <div class="content">
    </div>

    <div class="bar">
    </div>
  </div>
</template>

<script setup>
</script>

<style>
.wrapper {
  display: grid;
  grid-template-columns: 300px auto 300px;
  height: 100vh;
}

.bar {
  background: #d9d9d9;
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
}

.content {
  background: #E2E2E2;
}
</style>
