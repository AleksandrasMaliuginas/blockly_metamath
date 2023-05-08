
import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { Constant as MMConstant } from "../../DatabaseParser/MMStatements/Constant";
import { Constant } from "./Constant";
import { StatementContext } from "../StatementContext";

class ConstantDescriptor implements BlockDescriptor {

  private readonly statement: MMConstant;

  constructor(statement: MMConstant) {
    this.statement = statement;
  }

  blockName(): string {
    return this.statement.label
  }

  toolboxInstance(): ToolboxItemInfo {
    return {
      "kind": "block",
      "type": this.blockName()
    };
  }

  public static create(statement: MMConstant, context: StatementContext): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new Constant(this, statement, context);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = new ConstantDescriptor(statement);

    return blocklyBlock;
  }
}

export { ConstantDescriptor }