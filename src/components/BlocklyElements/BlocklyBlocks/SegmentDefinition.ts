
import { Block, Events, WorkspaceSvg } from "blockly";
import { BlockTypes, IBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { BlockChange } from "blockly/core/events/events_block_change";
import { BlockCreate } from "blockly/core/events/events_block_create";
import { Selected } from "blockly/core/events/events_selected";

class SegmentDefinition implements IBlocklyBlock {

  private readonly workspace: WorkspaceSvg;
  // TODO: should be replaced with activeReferences (active in workspace)
  private selectedReferences : Block[] = [];

  constructor(workspace: WorkspaceSvg) {
    this.workspace = workspace;
  }

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
      "type": BlockTypes.SegmentDef
    };
  }

  blockToCode(): string {
    return "";
  }

  private blockInit(block: Block): void {
    block.jsonInit(jsonBlockTemplate);
    block.onchange = (event) => {
      if (event.type === Events.SELECTED) {
        this.onSelect(event as Selected, block);
      }

      if (event.type === Events.BLOCK_CREATE) {
        this.onCreate(event as BlockCreate, block);
      }

      if (event.type === Events.BLOCK_CHANGE) {
        this.onChange(event as BlockChange, block);
      }
    };
  }

  private onSelect(event : Selected, block : Block) : void {
    if (event.newElementId === block.id) {
      this.selectedReferences = this.workspace.getBlocksByType(BlockTypes.SegmentRef, false)
        .filter(ref => ref.getFieldValue(NAME_FIELD) === block.getFieldValue(NAME_FIELD));
    }
  }

  private onChange(event : BlockChange, block : Block) : void {
    if (event.blockId !== block.id) return;

    if (this.definitionExists(block)) {
      block.getField(NAME_FIELD)?.setValue(block.getFieldValue(NAME_FIELD) + '_new')
    }

    this.selectedReferences.forEach(blockRef => {
      blockRef.getField(NAME_FIELD)?.setValue(block.getFieldValue(NAME_FIELD));
    });
  }

  private onCreate(event : BlockCreate, block : Block) : void {
    if (this.definitionExists(block)) {
      block.getField(NAME_FIELD)?.setValue(block.getFieldValue(NAME_FIELD) + '_new')
    }
  }

  private definitionExists(block: Block): boolean {
    return this.workspace
      .getBlocksByType(BlockTypes.SegmentDef, false)
      .some(other =>
        other.id !== block.id && 
        other.getFieldValue(NAME_FIELD) === block.getFieldValue(NAME_FIELD)
      );
  }
}

const NAME_FIELD = "NAME";

const jsonBlockTemplate = {
  "type": BlockTypes.SegmentDef,
  "message0": "%1 %2",
  "args0": [
    {
      "type": "field_input",
      "name": NAME_FIELD,
      "text": "my_segment_name"
    },
    {
      "type": "input_value",
      "name": "BODY"
    },
  ],
  "colour": 120,
  "tooltip": "Function block for reuse",
  "helpUrl": ""
};

export { SegmentDefinition }