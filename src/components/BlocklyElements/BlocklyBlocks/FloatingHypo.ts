
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
  private readonly constant: string | undefined;
  private readonly variable: string | undefined;
  private readonly context: StatementContext;

  constructor(block: ExtendedBlocklyBlock, parsedStatement: VariableHypothesis, context: StatementContext) {
    this.block = block;

    this.type = parsedStatement.constant ? parsedStatement.constant : null;
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;

    this.constant = parsedStatement.constant;
    this.variable = parsedStatement.variable;
    this.context = context;
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);
    // block.setFieldValue(this.constant, 'CONST');
    this.block.setFieldValue(this.variable, 'VAR');

    this.block.setColour(this.context.getHueColor())
    this.block.setTooltip(this.context.getStatementContext());
  }

  toolboxInstance(): ToolboxItemInfo {
    return {
      "kind": "block",
      "type": this.label
    };
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