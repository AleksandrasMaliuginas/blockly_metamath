
import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { VariableHypothesis } from "../../DatabaseParser/MMStatements/VariableHypothesis";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { FloatingHypo } from "./FloatingHypo";
import { StatementContext } from "../StatementContext";

class FloatingHypoDescriptor implements BlockDescriptor {

  private readonly statement: VariableHypothesis;

  constructor(statement: VariableHypothesis) {
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

  public static create(statement: VariableHypothesis, context: StatementContext): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new FloatingHypo(this, statement, context);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = new FloatingHypoDescriptor(statement);

    return blocklyBlock;
  }
}

export { FloatingHypoDescriptor }