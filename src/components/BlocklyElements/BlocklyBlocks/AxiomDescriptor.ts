import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { AxiomaticAssertion } from "../../DatabaseParser/MMStatements/AxiomaticAssertion";
import { StatementContext } from "../StatementContext";
import { Axiom } from "./Axiom";

class AxiomDescriptor implements BlockDescriptor {

  private readonly statement: AxiomaticAssertion;

  constructor(statement: AxiomaticAssertion) {
    this.statement = statement;
  }

  blockName(): string {
    return this.statement.label;
  }

  toolboxInstance(): ToolboxItemInfo {
    return {
      "kind": "block",
      "type": this.blockName()
    };
  }

  public static create(statement: AxiomaticAssertion, context: StatementContext): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new Axiom(this, statement, context);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = new AxiomDescriptor(statement);

    return blocklyBlock;
  }
}

export { AxiomDescriptor }