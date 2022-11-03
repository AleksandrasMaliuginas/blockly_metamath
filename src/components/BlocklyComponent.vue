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
import SymbolsDB from "./SymbolsDB";
import { MMConstant } from "./tokens/MMConstant";
import { MMVariable } from "./tokens/MMVariable";
import { MMFloatingHypo } from "./tokens/MMFloatingHypo";
import { MMAxiom } from "./tokens/MMAxiom";
import { blocks, toolbox } from "./toolbox/blockTemplates";
import { MMBlock } from "./tokens/MMBlock";


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
  
  SymbolsDB.initSymbols(parser.getParsedTokens());

  Blockly.defineBlocksWithJsonArray(blocks);
  registerToolboxCategoryCallbacks();
  
  workspace.value.updateToolbox(toolbox);
});

function registerToolboxCategoryCallbacks() {
  workspace.value.registerToolboxCategoryCallback('MM_CONSTANTS', MMConstant._toolboxFlyoutCallback);
  workspace.value.registerToolboxCategoryCallback('MM_VARIABLES', MMVariable._toolboxFlyoutCallback);
  workspace.value.registerToolboxCategoryCallback('MM_FLOATING_HYPOS', MMFloatingHypo._toolboxFlyoutCallback);
  workspace.value.registerToolboxCategoryCallback('MM_AXIOMS', MMAxiom._toolboxFlyoutCallback);
  
  workspace.value.registerToolboxCategoryCallback('MM_BLOCKS', MMBlock._toolboxFlyoutCallback);
}

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
