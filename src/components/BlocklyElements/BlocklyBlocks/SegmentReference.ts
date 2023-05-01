
import { Block } from "blockly";
import { BlockTypes, IBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";

class SegmentReference implements IBlocklyBlock {

  constructor() { }

  initializer(): any {
    const thisObject = this;
    return {
      init: function () {
        thisObject.blockInit(this);
      }
    };
  }

  toolboxInstance(): ToolboxItemInfo {
    return {
      "kind": "block",
      "type": BlockTypes.SegmentRef
    };
  }

  blockToCode(): string {
    return "";
  }

  static toolboxInstance(name : string): ToolboxItemInfo {
    return {
      'kind': 'block',
      'type': BlockTypes.SegmentRef,
      'fields': {
        'NAME': name,
      }
    }
  }

  private blockInit(block: Block): void {
    block.jsonInit(jsonBlockTemplate);
  }
}

const jsonBlockTemplate = {
  "type": BlockTypes.SegmentRef,
  "message0": "%1",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": "my_segment_name"
    }
  ],
  "output": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
};

export { SegmentReference }