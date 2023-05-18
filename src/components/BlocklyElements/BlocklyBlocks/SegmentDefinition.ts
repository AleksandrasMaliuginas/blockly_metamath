
import { Block, Events, WorkspaceSvg } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { BlockChange } from "blockly/core/events/events_block_change";
import { BlockCreate } from "blockly/core/events/events_block_create";
import { Selected } from "blockly/core/events/events_selected";

class SegmentDefinition implements MMBlock {

  private readonly block: Block;
  private readonly workspace: WorkspaceSvg;

  private selectedReferences: Block[] = [];

  constructor(block: ExtendedBlocklyBlock, workspace: WorkspaceSvg) {
    this.block = block;
    this.workspace = workspace;
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);
    this.block.onchange = (event) => {
      if (event.type === Events.SELECTED) {
        this.onSelect(event as Selected);
      }

      if (event.type === Events.BLOCK_CREATE) {
        this.onCreate(event as BlockCreate);
      }

      if (event.type === Events.BLOCK_CHANGE) {
        this.onChange(event as BlockChange);
      }
    };
  }

  toCode(): string {
    return "";
  }

  private onSelect(event: Selected): void {
    if (event.newElementId === this.block.id) {
      this.selectedReferences = this.workspace.getBlocksByType(BlockTypes.SegmentRef, false)
        .filter(ref => ref.getFieldValue(NAME_FIELD) === this.block.getFieldValue(NAME_FIELD));
    }
  }

  private onChange(event: BlockChange): void {
    if (event.blockId !== this.block.id) return;

    if (this.definitionExists()) {
      this.block.getField(NAME_FIELD)?.setValue(this.block.getFieldValue(NAME_FIELD) + '_new')
    }

    this.selectedReferences.forEach(blockRef => {
      blockRef.getField(NAME_FIELD)?.setValue(this.block.getFieldValue(NAME_FIELD));
    });
  }

  private onCreate(event: BlockCreate): void {
    if (this.definitionExists()) {
      this.block.getField(NAME_FIELD)?.setValue(this.block.getFieldValue(NAME_FIELD) + '_new')
    }
  }

  private definitionExists(): boolean {
    return this.workspace
      .getBlocksByType(BlockTypes.SegmentDef, false)
      .some(other =>
        other.id !== this.block.id &&
        other.getFieldValue(NAME_FIELD) === this.block.getFieldValue(NAME_FIELD)
      );
  }

  public static toolboxInstance(): ToolboxItemInfo {
    return {
      "kind": "block",
      "type": BlockTypes.SegmentDef
    };
  }
}

const NAME_FIELD = "NAME";
const BODY_INPUT = "BODY";

const jsonBlockTemplate = {
  "type": BlockTypes.SegmentDef,
  "message0": "%1 %2 %3",
  "args0": [
    {
      "type": "field_input",
      "name": NAME_FIELD,
      "text": "my_segment_name"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": BODY_INPUT
    },
  ],
  "colour": 270,
  "tooltip": "Function block for reuse",
  "helpUrl": ""
};

export { SegmentDefinition, NAME_FIELD, BODY_INPUT }