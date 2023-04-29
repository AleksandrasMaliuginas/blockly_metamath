import Blockly from "blockly";
import { BlockSvg } from "blockly";
import { MMRenderInfo } from "./MMRenderInfo";

const RENDERER_NAME = 'metamath';

class MMRenderer extends Blockly.geras.Renderer {
  constructor() {
    super(RENDERER_NAME);
  }

  override makeRenderInfo_(block : BlockSvg) : Blockly.geras.RenderInfo {
    return new MMRenderInfo(this, block);
  }
}

export { MMRenderer, RENDERER_NAME }
