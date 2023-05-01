
import { Block } from "blockly";
import { BlockTypes, IBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { AxiomaticAssertion } from "../../DatabaseParser/MMStatements/AxiomaticAssertion";
import { StatementContext } from "../BlockRegistry";
import { Keywords } from "../../DatabaseParser/MM";

class Axiom implements IBlocklyBlock {

  public readonly type: string | null;
  private readonly label: string | undefined;
  private readonly originalStatement: string | undefined;

  private readonly mathSymbols: string[] | undefined;
  private readonly context: StatementContext;

  constructor(parsedStatement: AxiomaticAssertion, context: StatementContext) {
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;

    this.type = parsedStatement.mathSymbols ? parsedStatement.mathSymbols[0] : null;
    this.mathSymbols = parsedStatement.mathSymbols;
    this.context = context;
  }

  initializer(): any {
    const thisObject = this;
    return {
      init: function () {
        thisObject.blockInit(this);
      }
    };
  }

  toolboxInstance() : ToolboxItemInfo {
    return {
      "kind": "block",
      "type": this.label
    };
  }

  blockToCode(): string {
    return "";
  }

  private blockInit(block: Block): void {
    block.jsonInit(jsonBlockTemplate);

    this.mathSymbols?.forEach((symbol, index) => {

      if (this.isConstant(symbol)) {
        block.appendDummyInput(`C${index}`).appendField(symbol);
      }

      if (this.isVariable(symbol)) {
        block.appendValueInput(`V${index}`);
        // .setCheck([MM.Variable, MM.FloatingHypo, MM.Axiom]);
      }
    });

    block.setTooltip(() => {
      return this.originalStatement ? this.originalStatement : "No tooltip provided.";
    });

    block.setColour(this.context.getHueColor())
  }


  // TODO: Leaking logic | Context should be in the Database parser
  private isConstant(symbol: string) {
    return this.context.mmStatements.some(statement => statement.label === symbol && statement.keyword === Keywords.CONSTANT);
  }

  private isVariable(symbol: string) {
    return this.context.mmStatements.some(statement => statement.label === symbol && statement.keyword === Keywords.VARIABLE);
  }
}

const jsonBlockTemplate = {
  "type": BlockTypes.Axiom,
  "message0": '',
  "args0": [],
  "inputsInline": true,
  "output": BlockTypes.Axiom,
  "colour": 210,

  "previousStatement": null,
  "nextStatement": null,
};

export { Axiom }