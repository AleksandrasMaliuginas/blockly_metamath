
import { Block } from "blockly";
import { BlockTypes, MMBlock, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { Constant as ConstantMMStatement } from "../../DatabaseParser/MMStatements/Constant";
import { StatementContext } from "../StatementContext";

class Constant implements MMBlock {

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
    this.block.setFieldValue(this.label, CONST);

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
const CONST = 'CONST';

const jsonBlockTemplate = {
  "type": BlockTypes.Constant,
  "message0": '%1 %2',
  "args0": [
    {
      "type": "field_label_serializable",
      "name": CONST,
      "text": "NO_LABEL"
    },
    {
      "type": "input_value",
      "name": NEXT,
      "check": [BlockTypes.Constant, BlockTypes.Variable]
    }
  ],
  "inputsInline": false,
  "output": BlockTypes.Constant,
  "colour": 160
};

export { Constant }