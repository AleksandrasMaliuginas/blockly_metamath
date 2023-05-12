<script setup lang="ts">

import { onMounted, ref, shallowRef } from "vue";
import Blockly from "blockly";

import { DatabaseParser } from "./DatabaseParser/DatabaseParser";
import { BlockRegistry } from "./BlocklyElements/BlockRegistry";
import { ToolboxBuilder } from "./BlocklyElements/Toolbox/ToolboxBuilder";
import { MMRenderer, RENDERER_NAME } from "./BlockRenderer/MMRenderer";
import { SegmentManager } from "./BlocklyElements/BlocklyBlocks/SegmentManager";
import FilterComponent from "./FilterComponent.vue";
import { BlockFinder } from "./BlockFinder";
import ExecutionComponent from "./Execution/ExecutionComponent.vue";

const props = defineProps(["options"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const filterComponent = ref();
const executionComponent = ref();
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
  const file = await fetch("demo0.mm");
  // const file = await fetch("hol.mm");
  const fileStr = await file.text();

  // Parse MM database file
  const databaseParser = new DatabaseParser(fileStr);
  const parsedStatements = databaseParser.parse();
  console.table(parsedStatements);

  // Create block filter
  const types = new Set(parsedStatements.map(statement => statement.constant));
  types.delete(undefined);
  mmBlockFinder.setMMTypes(types);
  filterComponent.value.setMMTypes(Array.from(types));

  // Create blockly blocks
  const segmentManager = new SegmentManager(workspace.value);
  const toolboxBuilder : ToolboxBuilder = new ToolboxBuilder(workspace.value, segmentManager, mmBlockFinder);
  const blockRegistry : BlockRegistry = new BlockRegistry(toolboxBuilder, segmentManager, codeGenerator);
  blockRegistry.registerMMStatements(parsedStatements);

  // Create Blockly toolbox
  // TODO: move to toolbox builder. toolboxBuilder.updateToolbox()
  workspace.value.updateToolbox(toolboxBuilder.getToolboxJson());

  

  // For DEMO purposes
  // const initializer = new WorkspaceInitializer(workspace.value);
  // initializer.loadInitialState();
});

function workspaceToCode(): string {
  return codeGenerator.workspaceToCode(workspace.value);
}




const cssVars = {
  filterComponent: '2.3em',
  executionComponent: '200px'
};
</script>

<template>
  <div>
    <FilterComponent :blockFinder="mmBlockFinder" ref="filterComponent"></FilterComponent>
    
    <div class="blocklyDiv" ref="blocklyDiv"></div>

    <ExecutionComponent :workspaceToCode="workspaceToCode" ref="executionComponent"></ExecutionComponent>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

FilterComponent {
  height: v-bind('cssVars.filterComponent');
}

.blocklyDiv {
  height: calc(100% - v-bind('cssVars.filterComponent') - v-bind('cssVars.executionComponent'));
  width: 100%;
  text-align: left;
}

ExecutionComponent {
  height: v-bind('cssVars.executionComponent');
}
</style>
