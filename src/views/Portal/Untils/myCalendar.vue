<template>
    <div style="overflow: hidden;">
      <a-calendar v-model:value="value" @panelChange="onPanelChange" lang="es" :fullscreen="false" style="height: 65vh;"/>
    </div>
  </template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Dayjs } from 'dayjs';
const value = ref<Dayjs>();
const onPanelChange = (value: Dayjs, mode: string) => {
  console.log(value, mode);
};
</script>