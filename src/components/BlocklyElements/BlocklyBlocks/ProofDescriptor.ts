
import { BlockTypes, BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { Proof } from "./Proof";

class ProofDescriptor implements BlockDescriptor {

  blockName(): string {
    return BlockTypes.Proof
  }

  toolboxInstance(): ToolboxItemInfo {
    return {
      "kind": "block",
      "type": this.blockName()
    };
  }

  public static create(): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new Proof(this);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = new ProofDescriptor();

    return blocklyBlock;
  }
}

export { ProofDescriptor }