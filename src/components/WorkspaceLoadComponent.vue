<script setup lang="ts">

import Blockly, { WorkspaceSvg } from "blockly";
import { ref } from "vue";
import { State } from "blockly/core/serialization/blocks";

const props = defineProps({
  getWorkspace: {
    type: Function,
    required: true
  },
  metamathDatabaseList: {
    type: Array<string>,
    required: true
  },
  loadMetamathDatabase: {
    type: Function,
    required: true
  },
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

function onPickFile() {
  fileInput.value.click();
}

function onFilePicked(event: any) {
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

function onMMDatabaseChanged(event: any) {

  if (!ensureEmptyWorkspace()) return;

  getMetamathDatabase(event.target.value).then(
    databaseString => props.loadMetamathDatabase(databaseString)
  ).catch( () => {
    window.alert("Something went wrong while loading database.")
  });
}

async function getMetamathDatabase(name: string): Promise<string> {
  const file = await fetch(name);
  return file.text();
}

function ensureEmptyWorkspace(): boolean {
  if (props.getWorkspace().getAllBlocks(false).length === 0) {
    return true;
  }

  return window.confirm("Are you sure you what to switch database without save you progress?");
}


function onMounted(arg0: () => void) {
throw new Error("Function not implemented.");
}
</script>

<template>
  <div class="main">
    
    <label for="mm-database">MM database:</label>
    <select id="mm-database" @input="onMMDatabaseChanged">
      <option v-for="option in props.metamathDatabaseList" :value="option">
        {{ option }}
      </option>
    </select>

    <img v-on:click="saveWorkspace" src="images/save.png" class="button" alt="Save workspace as JSON" title="Save workspace as JSON" />
    <img v-on:click="onPickFile" src="images/download.png" class="button" alt="Load workspace form JSON" title="Load workspace form JSON" />
    <input
      type="file"
      style="display: none"
      ref="fileInput"
      accept=".json"
      @change="onFilePicked"/>

  </div>
</template>

<style scoped>
div.main {
  display: flex;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
}

.button {
  height: 20px;
  padding: 7px 10px;
  cursor: pointer;
}

#mm-database {
  margin: 0 7px;
}
</style>
