import { Block } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { AxiomaticAssertion } from "../../DatabaseParser/MMStatements/AxiomaticAssertion";
import { StatementContext } from "../StatementContext";
import { BindedInput } from "../BindedInput";
import { IMMStatement } from "../../DatabaseParser/IMMStatement";
import { Variable } from "../../DatabaseParser/MMStatements/Variable";
import { Constant } from "../../DatabaseParser/MMStatements/Constant";

class Axiom implements MMBlock {

  private readonly block: Block;

  readonly type: string | null;
  readonly originalStatement: string;

  private readonly label: string;
  public readonly mathSymbols: string[] | undefined;
  public readonly context: StatementContext;

  private readonly inputs: Map<string, BindedInput> = new Map();

  constructor(block: ExtendedBlocklyBlock, parsedStatement: AxiomaticAssertion, context: StatementContext) {
    this.block = block;
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;

    this.type = parsedStatement.mathSymbols ? parsedStatement.mathSymbols[0] : null;
    this.mathSymbols = parsedStatement.mathSymbols.slice(1);
    this.context = context;


    this.mathSymbols?.forEach(symbol => {
      const definition: IMMStatement | undefined = this.context.getDefinitionOf(symbol);

      if (definition instanceof Variable) {
        this.inputs.set(definition.label, new BindedInput(definition.label, block));
      }
    });
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);

    this.mathSymbols?.forEach((symbol, index) => {

      const symbolDef = this.context.getDefinitionOf(symbol);

      if (symbolDef instanceof Constant) {
        this.block.appendDummyInput(`C${index}`).appendField(symbol);
      }

      if (symbolDef instanceof Variable && this.inputs.has(symbol)) {
        const namePostfix = `V${index}`;
        const name = this.inputs.get(symbol)?.getNextInputName();
        const input = this.block.appendValueInput(name ? name : namePostfix);

        this.inputs.get(symbol)?.addInput(input);
      }
    });

    this.block.setColour(this.context.getHueColor());
    this.block.setTooltip(this.context.getStatementContext());
  }

  toCode(): string {
    const inputsToCode: string[] = [];

    this.inputs.forEach((value: BindedInput) => {
      const connectedBlock = value.getConnectedBlock()?.mmBlock;

      inputsToCode.push(connectedBlock ? connectedBlock.toCode() : '?');
    });

    return inputsToCode.join(' ') + ' ' + this.label;
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