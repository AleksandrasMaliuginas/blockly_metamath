import { blocks, toolbox } from "./blockTemplates";
import * as Blockly from "blockly/core";

export default class ToolboxBuilder {

  constructor(workspace, token_array) {
    this.workspace = workspace;
    this.tokens = token_array;

    Blockly.defineBlocksWithJsonArray(blocks);
  }

  build() {
    for (const token of this.tokens) {
      token.createBlocks(this.workspace);
    }

    return toolbox;
  }
}