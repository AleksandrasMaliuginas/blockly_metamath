
import { Block, Events, WorkspaceSvg } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { BODY_INPUT, NAME_FIELD } from "./SegmentDefinition";

class SegmentReference implements MMBlock {

  private readonly block: Block;
  private readonly workspace: WorkspaceSvg;

  constructor(block: ExtendedBlocklyBlock, workspace: WorkspaceSvg) {
    this.block = block;
    this.workspace = workspace;
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);
  }

  toCode(): string {
    const referenceName = this.block.getFieldValue(NAME_FIELD);
    const definition = this.workspace.getBlocksByType(BlockTypes.SegmentDef, false)
      .find(def => def.getFieldValue(NAME_FIELD) === referenceName) as ExtendedBlocklyBlock;

    if (!definition) {
      throw `No definition found for Segment reference block: ${referenceName}.`;
    }

    const definitionBody = definition.getInput(BODY_INPUT);
    const targetBlock = definitionBody?.connection?.targetConnection?.getSourceBlock() as ExtendedBlocklyBlock;

    if (targetBlock && targetBlock.mmBlock) {
      return targetBlock.mmBlock.toCode();
    }

    return "";
  }

  public static toolboxInstance(name : string): ToolboxItemInfo {
    return {
      'kind': 'block',
      'type': BlockTypes.SegmentRef,
      'fields': {
        'NAME': name,
      }
    }
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
  "colour": 270,
  "tooltip": "",
  "helpUrl": "",

  "previousStatement": null,
  "nextStatement": null,
};

export { SegmentReference }