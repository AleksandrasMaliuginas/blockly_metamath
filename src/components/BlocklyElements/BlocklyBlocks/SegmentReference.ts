
import { Block } from "blockly";
import { BlockTypes as BlockType, IBlocklyBlock } from "../IBlocklyBlock";
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
      "type": BlockType.SegmentRef
    };
  }

  static toolboxInstance(name : string): ToolboxItemInfo {
    return {
      'kind': 'block',
      'type': BlockType.SegmentRef,
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
  "type": BlockType.SegmentRef,
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