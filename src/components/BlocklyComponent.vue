<script setup lang="ts">

import { onMounted, ref, shallowRef } from "vue";
import Blockly, { WorkspaceSvg } from "blockly";

import { DatabaseParser } from "./DatabaseParser/DatabaseParser";
import { BlockRegistry } from "./BlocklyElements/BlockRegistry";
import { ToolboxBuilder } from "./BlocklyElements/Toolbox/ToolboxBuilder";
import { MMRenderer, RENDERER_NAME } from "./BlockRenderer/MMRenderer";
import { SegmentManager } from "./BlocklyElements/BlocklyBlocks/SegmentManager";
import FilterComponent from "./FilterComponent.vue";
import { BlockFinder } from "./BlockFinder";
import ExecutionComponent from "./Execution/ExecutionComponent.vue";
import WorkspaceLoadComponent from "./WorkspaceLoadComponent.vue";

const props = defineProps(["options"]);
const blocklyDiv = ref();
const filterComponent = ref();
const executionComponent = ref();
const loaderComponent = ref();
const workspace = shallowRef();

const codeGenerator = new Blockly.Generator('metamath');
const mmBlockFinder = new BlockFinder();
let currentDatabase: string;

defineExpose({ workspace, codeGenerator });

onMounted(async () => {
  // Register custom Blockly renderer for metamath
  Blockly.blockRendering.register(RENDERER_NAME, MMRenderer);

  // Setup blockly workspace
  const options = props.options || {};

  options.renderer = RENDERER_NAME;
  workspace.value = Blockly.inject(blocklyDiv.value, options);

  await loadDefaultDatabase();
});

function loadWorkspace(mmDatabaseString: string) {
  currentDatabase = mmDatabaseString;

  // Parse MM database file
  const databaseParser = new DatabaseParser(mmDatabaseString);
  const parsedStatements = databaseParser.parse();
  console.table(parsedStatements);

  // Create block filter
  const types = new Set(parsedStatements.map((statement: any) => statement.constant));
  types.delete(undefined);
  mmBlockFinder.setMMTypes(types);
  filterComponent.value.setMMTypes(Array.from(types));

  // Create blockly blocks
  const segmentManager = new SegmentManager(workspace.value, codeGenerator);
  const toolboxBuilder = new ToolboxBuilder(workspace.value, segmentManager, mmBlockFinder);
  const blockRegistry = new BlockRegistry(toolboxBuilder, codeGenerator);
  blockRegistry.registerMMStatements(parsedStatements);

  // Create Blockly toolbox
  workspace.value.updateToolbox(toolboxBuilder.getToolboxJson());
}

async function loadDefaultDatabase(): Promise<void> {
  const file = await fetch('demo0.mm');
  const databaseString = await file.text();

  loadWorkspace(databaseString);
}

function workspaceToCode(): string {
  return codeGenerator.workspaceToCode(workspace.value);
}

function getWorkspace(): WorkspaceSvg {
  return workspace.value;
}

function getCurrentDatabase() {
  return currentDatabase;
}

const mm_database_list: string[] = [
  'demo0.mm', 'hol.mm', 'peano.mm'//, 'nf.mm'
];

const cssVars = {
  headerRow: '2.3em',
  executionComponent: '200px'
};
</script>

<template>
  <main>

    <header>
      <section class="filter-component">
        <FilterComponent :blockFinder="mmBlockFinder" ref="filterComponent"></FilterComponent>
      </section>

      <section>
        <WorkspaceLoadComponent 
          :getWorkspace="getWorkspace" 
          :metamathDatabaseList="mm_database_list"
          :loadMetamathDatabase="loadWorkspace" 
          ref="loaderComponent"></WorkspaceLoadComponent>
      </section>
    </header>

    <div class="blocklyDiv" ref="blocklyDiv"></div>

    <ExecutionComponent :workspaceToCode="workspaceToCode" :getCurrentDatabase="getCurrentDatabase" ref="executionComponent"></ExecutionComponent>

  </main>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

header {
  height: v-bind('cssVars.headerRow');
  padding: 0 1em;

  display: flex;
  flex-flow: row nowrap;
  justify-content:space-between;
  align-items: center;
}

.filter-component {
  flex-grow: 2;
}

.blocklyDiv {
  height: calc(100% - v-bind('cssVars.headerRow') - v-bind('cssVars.executionComponent'));
  width: 100%;
  text-align: left;
}


</style>
