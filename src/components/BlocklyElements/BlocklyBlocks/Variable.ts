
import { Block } from "blockly";
import { BlockTypes, BlockDescriptor } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { Constant as ConstantMMStatement } from "../../DatabaseParser/MMStatements/Constant";

class Variable implements BlockDescriptor {

  readonly type: string | null = null;
  private readonly label: string | undefined;
  private readonly originalStatement: string | undefined;

  constructor(parsedStatement: ConstantMMStatement) {
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;
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
    block.setFieldValue(this.label, 'VAR');

    block.setTooltip(() => {
      return this.originalStatement ? this.originalStatement : "No tooltip provided.";
    });
  }
}

const jsonBlockTemplate = {
  "type": BlockTypes.Variable,
  "message0": '%1 %2',
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "VAR",
      "text": "NO_LABEL"
    },
    {
      "type": "input_value",
      "name": "NEXT",
      "check": [BlockTypes.Constant, BlockTypes.Variable]
    }
  ],
  "output": BlockTypes.Variable,
  "colour": 330,
};

export { Variable }