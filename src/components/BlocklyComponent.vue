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

import { Parser } from './Parser'
import { TokenManager } from "./TokenManager";
import { MMBlockTemplates, toolbox } from "./toolbox/blockTemplates";
import { ToolboxHandler } from "./toolbox/ToolboxHandler";
import { WorkspaceInitializer } from "./WorkspaceInitializer";


const props = defineProps(["options"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();

defineExpose({ workspace });

onMounted(async () => {
  const options = props.options || {};

  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  workspace.value = Blockly.inject(blocklyDiv.value, options);


  const file = await fetch('demo0.mm');
  const fileStr = await file.text();
  const parser = new Parser(fileStr);
  const fileTokens = parser.parse();

  TokenManager.initTokens(fileTokens);
  ToolboxHandler.registerToolboxCategoryCallbacks(workspace.value);

  Blockly.defineBlocksWithJsonArray(MMBlockTemplates);
  workspace.value.updateToolbox(toolbox);

  // For DEMO purposes
  const initializer = new WorkspaceInitializer(workspace.value);
  initializer.loadInitialState();
});

</script>

<template>
  <div>
    <div class="blocklyDiv" ref="blocklyDiv"></div>
    <!-- <xml ref="blocklyToolbox" style="display: none">
      <slot></slot>
    </xml> -->
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blocklyDiv {
  height: 100%;
  width: 100%;
  text-align: left;
}
</style>
