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
const blocklyToolbox = ref();
const blocklyDiv = ref();
const filterComponent = ref();
const executionComponent = ref();
const loaderComponent = ref();
const workspace = shallowRef();

const codeGenerator = new Blockly.Generator('metamath');
const mmBlockFinder = new BlockFinder();


defineExpose({ workspace, codeGenerator });

onMounted(async () => {
  // Register custom Blockly renderer for metamath
  Blockly.blockRendering.register(RENDERER_NAME, MMRenderer);

  // Setup blockly workspace
  const options = props.options || {};

  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  options.renderer = RENDERER_NAME;
  workspace.value = Blockly.inject(blocklyDiv.value, options);

  // Open MM file
  const fileStr = await getCurrentMMDatabase();

  // Parse MM database file
  const databaseParser = new DatabaseParser(fileStr);
  const parsedStatements = databaseParser.parse();
  console.table(parsedStatements);

  // Create block filter
  const types = new Set(parsedStatements.map((statement: any) => statement.constant));
  types.delete(undefined);
  mmBlockFinder.setMMTypes(types);
  filterComponent.value.setMMTypes(Array.from(types));

  // Create blockly blocks
  const segmentManager = new SegmentManager(workspace.value, codeGenerator);
  const toolboxBuilder : ToolboxBuilder = new ToolboxBuilder(workspace.value, segmentManager, mmBlockFinder);
  const blockRegistry : BlockRegistry = new BlockRegistry(toolboxBuilder, codeGenerator);
  blockRegistry.registerMMStatements(parsedStatements);

  // Create Blockly toolbox
  // TODO: move to toolbox builder. toolboxBuilder.updateToolbox()
  workspace.value.updateToolbox(toolboxBuilder.getToolboxJson());

});

async function getMetamathDatabase(name: string): Promise<string> {
  const file = await fetch(name);
  return file.text();
}

async function getCurrentMMDatabase(): Promise<string> {
  return await getMetamathDatabase('demo0.mm');
  // return await getMetamathDatabase('hol.mm');
}

function workspaceToCode(): string {
  return codeGenerator.workspaceToCode(workspace.value);
}

function getWorkspace(): WorkspaceSvg {
  return workspace.value;
}

const cssVars = {
  headerRow: '2.3em',
  executionComponent: '200px'
};
</script>

<template>
  <div>
    <section class="header">
      <FilterComponent :blockFinder="mmBlockFinder" ref="filterComponent"></FilterComponent>

      <WorkspaceLoadComponent :getWorkspace="getWorkspace" ref="loaderComponent"></WorkspaceLoadComponent>
    </section>
    
    <div class="blocklyDiv" ref="blocklyDiv"></div>

    <ExecutionComponent :workspaceToCode="workspaceToCode" :getCurrentMMDatabase="getCurrentMMDatabase()" ref="executionComponent"></ExecutionComponent>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

section.header {
  height: v-bind('cssVars.headerRow');
}

FilterComponent {
  display: inline-block;
  width: 70%;
  min-width: none;
}

WorkspaceLoadComponent {
  display: inline-block;
  width: 30%;
  min-width: none;
}

.blocklyDiv {
  height: calc(100% - v-bind('cssVars.headerRow') - v-bind('cssVars.executionComponent'));
  width: 100%;
  text-align: left;
}

ExecutionComponent {
  height: v-bind('cssVars.executionComponent');
}
</style>
