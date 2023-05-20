<script setup lang="ts">

import { ref } from "vue";
import { verifyProof } from "./Executor";

const props = defineProps({
  workspaceToCode: {
    type: Function,
    required: true
  },
  getCurrentDatabase: {
    type: Function,
    required: true
  },
});

const metamathCode = ref();
const verifierOutput = ref();

const showCode = () => {
  metamathCode.value = props.workspaceToCode();
}

const runMetamathValidator = () => {
  showCode();

  const databaseToValidate = props.getCurrentDatabase() + props.workspaceToCode();
  verifierOutput.value = verifyProof(databaseToValidate);
}


</script>

<template>
  <div class="flex">

    <section id="code" class="flex-50">
      <button v-on:click="showCode">Show Metamath</button>

      <textarea v-model="metamathCode" rows="8" readonly/>
    </section>

    <section class="flex-50">
      <button v-on:click="runMetamathValidator">Validate Code</button>

      <textarea v-model="verifierOutput" rows="8" readonly/>
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
  resize: vertical;

}
</style>
