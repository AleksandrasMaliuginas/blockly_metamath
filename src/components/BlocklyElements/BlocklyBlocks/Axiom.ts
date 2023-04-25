
import { Block } from "blockly";
import { BlockTypes as BlockType, IBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { AxiomaticAssertion } from "../../DatabaseParser/MMStatements/AxiomaticAssertion";
import { StatementContext } from "../BlockRegistry";
import { Keywords } from "../../DatabaseParser/MM";
import { Constant } from "../../DatabaseParser/MMStatements/Constant";
import { Variable } from "../../DatabaseParser/MMStatements/Variable";

class Axiom implements IBlocklyBlock {

  private readonly label: string | undefined;
  private readonly originalStatement: string | undefined;
  private readonly constant: string | undefined;
  private readonly mathSymbols: string[] | undefined;
  private readonly context : StatementContext;

  constructor(parsedStatement: AxiomaticAssertion, context : StatementContext) {
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;

    this.constant = parsedStatement.constant;
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
  }


  // TODO: Leaking logic | Context should be in the Database parser
  private isConstant(symbol : string) {
    return this.context.mmStatements.some(statement => statement.label === symbol && statement.keyword === Keywords.CONSTANT);
  }

  private isVariable(symbol : string) {
    return this.context.mmStatements.some(statement => statement.label === symbol && statement.keyword === Keywords.VARIABLE);
  }
}

const jsonBlockTemplate = {
  "type": BlockType.Axiom,
  "message0": '',
  "args0": [],
  "inputsInline": true,
  "output": BlockType.Axiom,
  "colour": 210,
  // "mutator": MM.Axiom + '_mutator'
};

export { Axiom }