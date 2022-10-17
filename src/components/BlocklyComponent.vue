<script setup>
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

import { Parser } from './Parser.js'
import ToolboxBuilder from "./toolbox/ToolboxBuilder";
import MetamathSet from "./MetamathSet";

const props = defineProps(["options"]);
const blocklyToolbox = ref();
const blocklyDiv = ref();
const createVar = ref();
const workspace = shallowRef();

defineExpose({ workspace });

onMounted(async () => {
  const file = await fetch('demo0.mm');
  const fileStr = await file.text();
  const parser = new Parser(fileStr);
  parser.parse();

  const options = props.options || {};

  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  workspace.value = Blockly.inject(blocklyDiv.value, options);
  
  MetamathSet.setTokens(parser.getParsedTokens());
  
  
  const toolboxBuilder = new ToolboxBuilder(workspace.value, parser.getParsedTokens());
  const newToolbox = toolboxBuilder.build();
  workspace.value.updateToolbox(newToolbox);

});

</script>

<template>
  <div>
    <div class="blocklyDiv" ref="blocklyDiv"></div>
    <xml ref="blocklyToolbox" style="display: none">
      <slot></slot>
    </xml>
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
