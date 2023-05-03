import { WorkspaceSvg } from "blockly";
import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { AxiomaticAssertion } from "../../DatabaseParser/MMStatements/AxiomaticAssertion";
import { StatementContext } from "../BlockRegistry";
import { AxiomSvg } from "./AxiomSvg";
// import { duplicate } from "blockly/core/clipboard";


class Axiom implements BlockDescriptor {

  public readonly type: string | null;
  private readonly label: string;
  public readonly originalStatement: string | undefined;

  public readonly mathSymbols: string[] | undefined;
  public readonly context: StatementContext;

  constructor(parsedStatement: AxiomaticAssertion, context: StatementContext, workspace: WorkspaceSvg) {
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;

    this.type = parsedStatement.mathSymbols ? parsedStatement.mathSymbols[0] : null;
    this.mathSymbols = parsedStatement.mathSymbols;
    this.context = context;
  }
  
  initializer(): ExtendedBlocklyBlock {
    const descriptor = this;

    return {
      init: function () {
        this.mmBlock = new AxiomSvg(this, descriptor);
        this.mmBlock?.init();
      }
    };
  }

  toolboxInstance(): ToolboxItemInfo {
    return {
      "kind": "block",
      "type": this.label
    };
  }

  blockToCode(): string {
    return "";
  }
}

export { Axiom }