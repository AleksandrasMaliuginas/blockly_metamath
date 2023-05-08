
import { Block } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { Constant as ConstantMMStatement } from "../../DatabaseParser/MMStatements/Constant";
import { StatementContext } from "../StatementContext";

class Variable implements MMBlock {

  private readonly block: Block;

  readonly type: string | null = null;
  readonly originalStatement: string;

  private readonly label: string;

  constructor(block: ExtendedBlocklyBlock, statement: ConstantMMStatement, context?: StatementContext) {
    this.block = block;
    this.label = statement.label;
    this.originalStatement = statement.originalStatement;
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);
    this.block.setFieldValue(this.label, VAR);

    this.block.setTooltip(this.originalStatement);
  }

  toCode(): string {
    const nextBlock = this.block.getInput(NEXT)?.connection?.targetBlock() as ExtendedBlocklyBlock;

    if (nextBlock && nextBlock.mmBlock) {
      return this.label + ' ' + nextBlock.mmBlock.toCode();
    }

    return this.label;
  }
}

const NEXT = 'NEXT';
const VAR = 'VAR';

const jsonBlockTemplate = {
  "type": BlockTypes.Variable,
  "message0": '%1 %2',
  "args0": [
    {
      "type": "field_label_serializable",
      "name": VAR,
      "text": "NO_LABEL"
    },
    {
      "type": "input_value",
      "name": NEXT,
      "check": [BlockTypes.Constant, BlockTypes.Variable]
    }
  ],
  "output": BlockTypes.Variable,
  "colour": 330,
};

export { Variable }