
import { Block } from "blockly";
import { BlockTypes, BlockDescriptor } from "../IBlocklyBlock";
import { VariableHypothesis } from "../../DatabaseParser/MMStatements/VariableHypothesis";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { StatementContext } from "../BlockRegistry";

class FloatingHypo implements BlockDescriptor {

  readonly type: string | null;
  private readonly label: string | undefined;
  private readonly originalStatement: string | undefined;
  private readonly constant: string | undefined;
  private readonly variable: string | undefined;
  private readonly context: StatementContext;

  constructor(parsedStatement: VariableHypothesis, context : StatementContext) {
    this.type = parsedStatement.constant ? parsedStatement.constant : null;
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;

    this.constant = parsedStatement.constant;
    this.variable = parsedStatement.variable;
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
    // block.setFieldValue(this.constant, 'CONST');
    block.setFieldValue(this.variable, 'VAR');

    block.setColour(this.context.getHueColor())
    block.setTooltip(() => {
      return this.originalStatement ? this.originalStatement : "No tooltip provided.";
    });
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