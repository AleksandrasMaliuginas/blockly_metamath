
import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { ScopingBlock } from "../../DatabaseParser/MMStatements/ScopingBlock";
import { StatementContext } from "../StatementContext";
import { BlockAxiom } from "./BlockAxiom";

class BlockAxiomDescriptor implements BlockDescriptor {

  readonly statement: ScopingBlock;

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
        this.mmBlock = new BlockAxiom(this, statement, context);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = new BlockAxiomDescriptor(statement);

    return blocklyBlock;
  }
}

export { BlockAxiomDescriptor }