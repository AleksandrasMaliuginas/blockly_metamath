
import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { Variable as MMVariable } from "../../DatabaseParser/MMStatements/Variable";
import { Variable } from "./Variable";
import { StatementContext } from "../StatementContext";

class VariableDescriptor implements BlockDescriptor {

  readonly statement: MMVariable;

  constructor(statement: MMVariable) {
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

  public static create(statement: MMVariable, context: StatementContext): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new Variable(this, statement, context);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = new VariableDescriptor(statement);

    return blocklyBlock;
  }
}

export { VariableDescriptor }