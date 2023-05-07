
import { Block } from "blockly";
import { BlockTypes, BlockDescriptor } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { Constant as ConstantMMStatement } from "../../DatabaseParser/MMStatements/Constant";

class Constant implements BlockDescriptor {

  readonly type: string | null = null;
  readonly originalStatement: string;
  
  private readonly label: string | undefined;

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
    block.setFieldValue(this.label, 'CONST');

    block.setTooltip(this.originalStatement);
  }
}

const jsonBlockTemplate = {
  "type": BlockTypes.Constant,
  "message0": '%1 %2',
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "CONST",
      "text": "NO_LABEL"
    },
    {
      "type": "input_value",
      "name": "NEXT",
      "check": [BlockTypes.Constant, BlockTypes.Variable]
    }
  ],
  "inputsInline": false,
  "output": BlockTypes.Constant,
  "colour": 160
};

export { Constant }