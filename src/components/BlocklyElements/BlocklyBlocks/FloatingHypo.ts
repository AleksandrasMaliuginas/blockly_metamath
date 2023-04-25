
import { Block } from "blockly";
import { BlockTypes as BlockType, IBlocklyBlock } from "../IBlocklyBlock";
import { VariableHypothesis } from "../../DatabaseParser/MMStatements/VariableHypothesis";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";

class FloatingHypo implements IBlocklyBlock {

  private readonly label: string | undefined;
  private readonly originalStatement: string | undefined;
  private readonly constant: string | undefined;
  private readonly variable: string | undefined;

  constructor(parsedStatement: VariableHypothesis) {
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;

    this.constant = parsedStatement.constant;
    this.variable = parsedStatement.variable;
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
    block.setFieldValue(this.constant, 'CONST');
    block.setFieldValue(this.variable, 'VAR');

    block.setTooltip(() => {
      return this.originalStatement ? this.originalStatement : "No tooltip provided.";
    });
  }
}

const jsonBlockTemplate = {
  "type": BlockType.FloatingHypo,
  "message0": '%1 %2',
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "CONST",
      "text": "NO_LABEL"
    },
    {
      "type": "field_label_serializable",
      "name": "VAR",
      "text": "NO_LABEL"
    },
  ],
  "output": BlockType.FloatingHypo,
  "colour": 230,
};

export { FloatingHypo }