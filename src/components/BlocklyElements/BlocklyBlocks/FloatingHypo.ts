
import { Block } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { VariableHypothesis } from "../../DatabaseParser/MMStatements/VariableHypothesis";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { StatementContext } from "../StatementContext";

class FloatingHypo implements MMBlock {

  private readonly block: Block;

  readonly type: string | null;
  readonly originalStatement: string;

  private readonly label: string;
  private readonly constant: string;
  private readonly variable: string;
  private readonly context: StatementContext;

  constructor(block: ExtendedBlocklyBlock, statement: VariableHypothesis, context: StatementContext) {
    this.block = block;

    this.type = statement.constant ? statement.constant : null;
    this.label = statement.label;
    this.originalStatement = statement.originalStatement;

    this.constant = statement.constant;
    this.variable = statement.variable;
    this.context = context;
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);
    // block.setFieldValue(this.constant, 'CONST');
    this.block.setFieldValue(this.variable, 'VAR');

    this.block.setColour(this.context.getHueColor())
    this.block.setTooltip(this.context.getStatementContext());
  }

  toCode(): string {
    return this.label;
  }
}

const jsonBlockTemplate = {
  "type": BlockTypes.FloatingHypo,
  "message0": '%1', // '%1 %2',
  "args0": [
    // {
    //   "type": "field_label_serializable",
    //   "name": "CONST",
    //   "text": ""
    // },
    {
      "type": "field_label_serializable",
      "name": "VAR",
      "text": "NO_LABEL"
    },
  ],
  "output": BlockTypes.FloatingHypo,
  "colour": 230,
};

export { FloatingHypo }