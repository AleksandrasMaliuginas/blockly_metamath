
import { WorkspaceSvg } from "blockly";
import { BlockTypes as BlockType } from "../IBlocklyBlock";
import { SegmentDefinition } from "./SegmentDefinition";
import { SegmentReference } from "./SegmentReference";

// TODO: refactor manager, so that segmentDefinitions will be persisted in block registry and segmentDefinitions will have all existing segmentReferences 
class SegmentManager {

  private readonly segmentDefinition: SegmentDefinition;
  private readonly segmentReference: SegmentReference;

  constructor(workspace : WorkspaceSvg) {
    this.segmentDefinition = new SegmentDefinition(workspace);
    this.segmentReference = new SegmentReference();
  }

  public toolboxCallback(workspace : WorkspaceSvg) : any {
    const segmentDefinitions = workspace?.getBlocksByType(BlockType.SegmentDef, false)
      .map(segmentBlock => segmentBlock.getFieldValue("NAME"));

    const segmentReferences = segmentDefinitions
      .map(segmentName => SegmentReference.toolboxInstance(segmentName));

    if (!segmentDefinitions)
      return [this.segmentDefinition.toolboxInstance()];

    console.log(segmentReferences)
    return [this.segmentDefinition.toolboxInstance(), ...segmentReferences]
  }

  public segmentDefinitionBlock() {
    return this.segmentDefinition.initializer();
  }

  public segmentReferenceBlock() {
    return this.segmentReference.initializer();
  }

}

export { SegmentManager }