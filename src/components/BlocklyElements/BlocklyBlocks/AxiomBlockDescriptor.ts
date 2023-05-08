
import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { ScopingBlock } from "../../DatabaseParser/MMStatements/ScopingBlock";
import { StatementContext } from "../StatementContext";
import { AxiomBlock } from "./AxiomBlock";

class AxiomBlockDescriptor implements BlockDescriptor {

  private readonly statement: ScopingBlock;

  constructor(statement: ScopingBlock) {
    this.statement = statement
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
        this.mmBlock = new AxiomBlock(this, statement, context);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = new AxiomBlockDescriptor(statement);

    return blocklyBlock;
  }
}

export { AxiomBlockDescriptor }