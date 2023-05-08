<script setup lang="ts">
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blockly Vue Component.
 * @author dcoodien@gmail.com (Dylan Coodien)
 */

import { onMounted, ref, shallowRef } from "vue";
import Blockly from "blockly";

import { DatabaseParser } from "./DatabaseParser/DatabaseParser";
import { BlockRegistry } from "./BlocklyElements/BlockRegistry";
import { ToolboxBuilder } from "./BlocklyElements/Toolbox/ToolboxBuilder";
import { MMRenderer, RENDERER_NAME } from "./BlockRenderer/MMRenderer";
import { SegmentManager } from "./BlocklyElements/BlocklyBlocks/SegmentManager";
import FilterComponent from "./FilterComponent.vue";
import { BlockFinder } from "./BlockFinder";

const props = defineProps(["options"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const filterComponent = ref();
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

</script>

<template>
  <div>
    <FilterComponent class="block-filter" :blockFinder="mmBlockFinder" ref="filterComponent"></FilterComponent>
    
    <div class="blocklyDiv" ref="blocklyDiv"></div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.block-filter {
  height: 2.3em;
}
.blocklyDiv {
  height: calc(100% - 2.3em);
  width: 100%;
  text-align: left;
}
</style>
