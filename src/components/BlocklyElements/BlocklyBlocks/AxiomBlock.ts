
import { Block } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { ScopingBlock } from "../../DatabaseParser/MMStatements/ScopingBlock";
import { IMMStatement } from "../../DatabaseParser/IMMStatement";
import { AxiomaticAssertion } from "../../DatabaseParser/MMStatements/AxiomaticAssertion";
import { MultiLineField } from "../../BlockRenderer/MultiLineFieldLabel";
import { ProvableAssertion } from "../../DatabaseParser/MMStatements/ProvableAssertion";
import { StatementContext } from "../StatementContext";

class AxiomBlock implements MMBlock {

  private readonly block: Block;

  readonly type: string | null;
  readonly originalStatement: string;
  
  private readonly label: string;

  private readonly innerStatements: IMMStatement[] = [];
  private readonly context : StatementContext;

  private readonly expectedStatements : IMMStatement[] = [];
  private readonly resultingStatement : AxiomaticAssertion | ProvableAssertion;

  constructor(block: ExtendedBlocklyBlock, statement: ScopingBlock, context : StatementContext) {
    this.block = block;

    this.label = statement.label;
    this.originalStatement = statement.originalStatement;
    this.innerStatements = statement.statements;
    this.context = context;

    this.resultingStatement = statement.statements[statement.statements.length - 1] as AxiomaticAssertion;
    this.type = this.resultingStatement.constant ? this.resultingStatement.constant : null;

    this.expectedStatements = this.buildExpectedStatements();
  }

  init(): void {
    // Init expected hypos
    const expectedStatementDescriptors : string[] = [];
    this.expectedStatements.forEach(st => {
      if (st.mathSymbols) {
        expectedStatementDescriptors.push(st.mathSymbols.join(' '));
      }
    });

    this.block.jsonInit(jsonBlockTemplate);

    const field = new MultiLineField(expectedStatementDescriptors.join(MultiLineField.NEW_LINE_INDICATOR));
    this.block.appendStatementInput(INNER_STATEMENTS).appendField(field);

    const resultLabel = this.resultingStatement.mathSymbols ? this.resultingStatement.mathSymbols.join(' ') : '???';
    this.block.appendDummyInput('RESULT').appendField(resultLabel);

    this.block.setColour(this.context.getHueColor(this.type));
    this.block.setTooltip(this.context.getStatementContext());
  }

  toCode(): string {
    const firstBlock = this.block.getInput(INNER_STATEMENTS)?.connection?.targetBlock() as ExtendedBlocklyBlock;

    if (!firstBlock) {
      return this.expectedStatements.reduce((str, _) => str += '? ', '') + this.label;
    } 
    
    return this.innerBlockToCode(firstBlock) + ' ' + this.label;
  }

  private innerBlockToCode(block: ExtendedBlocklyBlock): string {
    const code = block.mmBlock?.toCode();

    if (block.nextConnection.isConnected()) {
      const nextBlock = block.nextConnection.targetBlock() as ExtendedBlocklyBlock;
      return code + ' ' + this.innerBlockToCode(nextBlock);
    }

    return code ? code : '???';
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

const INNER_STATEMENTS = 'INPUT';

const jsonBlockTemplate = {
  "type": BlockTypes.Axiom,
  "output": BlockTypes.Axiom,
  "colour": 210,

  "previousStatement": null,
  "nextStatement": null,
};

export { AxiomBlock }