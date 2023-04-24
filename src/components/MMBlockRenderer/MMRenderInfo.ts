import Blockly from "blockly";
import { DUMMY_INPUT } from "blockly";
import { Input } from "blockly/core/input";
import { BlockSvg } from "blockly/core/block_svg";

class MMRenderInfo extends Blockly.geras.RenderInfo {

  public static readonly NEW_LINE_INDICATOR = 'ROW';

  constructor(renderer: Blockly.geras.Renderer, block: BlockSvg) {
    super(renderer, block);
  }

  shouldStartNewRow_(input : Input, lastInput : Input) {
    if (input.type == DUMMY_INPUT && input.name == MMRenderInfo.NEW_LINE_INDICATOR) {
      return true;
    }

    return super.shouldStartNewRow_(input, lastInput);
  };
}

export { MMRenderInfo }