<script setup lang="ts">

import Blockly from "blockly";
import { ref } from "vue";
import { State } from "blockly/core/serialization/blocks";

const props = defineProps({
  getWorkspace: {
    type: Function,
    required: true
  }
});

const fileInput = ref();
const serializer = new Blockly.serialization.blocks.BlockSerializer();

function saveWorkspace() {
  const state = serializer.save(props.getWorkspace());
  if (!state) return;

  const dummyDownloadLink = document.createElement('a');
  dummyDownloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(state)));
  dummyDownloadLink.setAttribute('download', 'mm_workspace.json');
  dummyDownloadLink.click();
  dummyDownloadLink.remove();
}

function onPickFile () {
  fileInput.value.click();
}

function onFilePicked (event: any) {
  const file = event.target.files[0];
  const fileReader = new FileReader();

  fileReader.addEventListener('load', () => {
    const result = fileReader.result as string;
    loadWorkspaceState(JSON.parse(result));
  });

  fileReader.readAsText(file);
}

function loadWorkspaceState(workspaceState: { languageVersion: number; blocks: State[]; }) {
  serializer.load(workspaceState, props.getWorkspace());
}

</script>

<template>
  <div>
    <img v-on:click="saveWorkspace" src="images/save.png" class="button" alt="Save workspace as JSON" title="Save workspace as JSON">
    <img v-on:click="onPickFile" src="images/download.png" class="button" alt="Load workspace form JSON" title="Load workspace form JSON">
    <input
      type="file"
      style="display: none"
      ref="fileInput"
      accept=".json"
      @change="onFilePicked"/>
  </div>
</template>

<style scoped>
div {
  float: right;
}

.button {
  height: 20px;
  padding: 7px 10px;
  margin: 1px 5px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
