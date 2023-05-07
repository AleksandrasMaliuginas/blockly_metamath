
import { Block } from "blockly";
import { BlockTypes, BlockDescriptor } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { ProvableAssertion } from "../../DatabaseParser/MMStatements/ProvableAssertion";

class Proof implements BlockDescriptor {

  readonly type: string | null = null;
  readonly originalStatement: string = '';
  
  private readonly label: string | undefined;

  constructor(parsedStatement?: ProvableAssertion) {
    if (parsedStatement) {
      this.label = parsedStatement.label;
      this.originalStatement = parsedStatement.originalStatement;
    }
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
    
    block.setTooltip(() => {
      return this.originalStatement ? this.originalStatement : "No tooltip provided.";
    });
  }


}

const jsonBlockTemplate = {
  "type": BlockTypes.Proof,
  "message0": "Label: %1 Assertion: %2 Proof: %3",
  "args0": [
    {
      "type": "field_input",
      "name": "LABEL",
      "text": "default"
    },
    {
      "type": "input_value",
      "name": "ASSERTION"
    },
    {
      "type": "input_statement",
      "name": "PROOF"
    }
  ],
  "inputsInline": true,
  "colour": 20,
  "tooltip": "",
  "helpUrl": ""
};

export { Proof }