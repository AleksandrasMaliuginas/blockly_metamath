<script setup lang="ts">

import { onMounted, ref } from "vue";

const props = defineProps({
  workspaceToCode: {
    type: Function,
    required: true
  },
});

const metamathCode = ref();
const showCode = () => {
  metamathCode.value = props.workspaceToCode();
}

const runMetamathValidator = () => {
  
}


</script>

<template>
  <div class="flex">

    <section id="code" class="flex-50">
      <button v-on:click="showCode">Show Metamath</button>

      <textarea v-model="metamathCode" />
    </section>

    <section class="flex-50">
      <button v-on:click="runMetamathValidator">Validate Code</button>
    </section>

  </div>
</template>

<style scoped>
.flex {
  display: flex;
}
.flex-50 {
  flex: 1 1 auto;
  padding: 1em;
}

#code > * {
  display: flex;
  flex-direction: column;
}

textarea {
  margin-top: 10px;
  width: 100%;
}
</style>
