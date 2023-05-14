
import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { ScopingBlock } from "../../DatabaseParser/MMStatements/ScopingBlock";
import { StatementContext } from "../StatementContext";
import { BlockProof } from "./BlockProof";

class BlockProofDescriptor implements BlockDescriptor {

  readonly statement: ScopingBlock;
  readonly random: number= 10;

  constructor(statement: ScopingBlock) {
    this.statement = statement;
  }

  blockName(): string {
    return this.statement.label;
  }

  toolboxInstance() : ToolboxItemInfo {
    return {
      "kind": "block",
      "type": this.blockName()
    };
  }

  public static create(statement: ScopingBlock, context: StatementContext): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new BlockProof(this, statement, context);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = new BlockProofDescriptor(statement);

    return blocklyBlock;
  }
}

export { BlockProofDescriptor }