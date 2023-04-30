
import { Block } from "blockly";
import { IBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { StatementContext } from "../BlockRegistry";
import { ScopingBlock } from "../../DatabaseParser/MMStatements/ScopingBlock";
import { IMMStatement } from "../../DatabaseParser/IMMStatement";
import { AxiomaticAssertion } from "../../DatabaseParser/MMStatements/AxiomaticAssertion";
import { MultiLineField } from "../../BlockRenderer/MultiLineFieldLabel";
import { ProvableAssertion } from "../../DatabaseParser/MMStatements/ProvableAssertion";

class BlockAxiom implements IBlocklyBlock {

  readonly type: string | null;
  private readonly label: string | undefined;
  private readonly originalStatement: string | undefined;

  private readonly innerStatements: IMMStatement[] = [];
  private readonly context : StatementContext;

  private readonly expectedStatements : IMMStatement[] = [];
  private readonly resultingStatement : AxiomaticAssertion | ProvableAssertion;

  constructor(parsedStatement: ScopingBlock, context : StatementContext) {
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;
    this.innerStatements = parsedStatement.statements;
    this.context = context;

    this.resultingStatement = parsedStatement.statements[parsedStatement.statements.length - 1] as AxiomaticAssertion;
    this.type = this.resultingStatement.constant ? this.resultingStatement.constant : null;

    this.expectedStatements = this.buildExpectedStatements();
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
    // Init expected hypos
    const expectedStatementDescriptors : string[] = [];
    this.expectedStatements.forEach(st => {
      if (st.mathSymbols) {
        expectedStatementDescriptors.push(st.mathSymbols.join(' '));
      }
    });

    const field = new MultiLineField(expectedStatementDescriptors.join(MultiLineField.NEW_LINE_INDICATOR));
    block.appendStatementInput("INPUT").appendField(field);

    block.appendDummyInput('RESULT').appendField(this.resultingStatement.mathSymbols.join(' '))

    block.setColour(this.context.getHueColor(this.type));
    block.setTooltip(() => {
      return this.originalStatement ? this.originalStatement : "No tooltip provided.";
    });
  }

  private buildExpectedStatements() : IMMStatement[] {
    const variables : IMMStatement[] = [];
    const statements : IMMStatement[] = [];

    this.innerStatements.forEach((statement, index) => {
      // Skip last statement
      if (index === this.innerStatements.length - 1) return;

      statement.mathSymbols?.forEach(symbol => {
        const variableHypo = this.context.getFloatingHypothesis(symbol);

        if (variableHypo && !variables.includes(variableHypo)) {
          variables.push(variableHypo);
        }
      });

      statements.push(statement);
    });

    return [...variables, ...statements];
  }
}

export { BlockAxiom }