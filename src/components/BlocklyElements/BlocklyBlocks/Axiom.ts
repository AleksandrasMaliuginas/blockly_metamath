import { WorkspaceSvg } from "blockly";
import { BlockDescriptor, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { AxiomaticAssertion } from "../../DatabaseParser/MMStatements/AxiomaticAssertion";
import { AxiomSvg } from "./AxiomSvg";
import { StatementContext } from "../StatementContext";

class Axiom implements BlockDescriptor {

  readonly type: string | null;
  readonly originalStatement: string;
  
  private readonly label: string;
  public readonly mathSymbols: string[] | undefined;
  public readonly context: StatementContext;

  constructor(parsedStatement: AxiomaticAssertion, context: StatementContext, workspace: WorkspaceSvg) {
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;

    this.type = parsedStatement.mathSymbols ? parsedStatement.mathSymbols[0] : null;
    this.mathSymbols = parsedStatement.mathSymbols.slice(1);
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