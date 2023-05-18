
import { Blocks, Generator, WorkspaceSvg } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { SegmentDefinition } from "./SegmentDefinition";
import { SegmentReference } from "./SegmentReference";

class SegmentManager {

  private readonly workspace: WorkspaceSvg;
  private readonly definitionBlocks: Map<String, ExtendedBlocklyBlock> = new Map();

  constructor(workspace : WorkspaceSvg, codeGenerator: Generator) {
    this.workspace = workspace;

    // Register blockly segment blocks
    Blocks[BlockTypes.SegmentDef] = this.createDefinitionBlock(workspace);
    Blocks[BlockTypes.SegmentRef] = this.createReferenceBlock(workspace);

    this.registerCodeGenerators(codeGenerator);
  }

  public toolboxCallback() : any {

    console.log(this.definitionBlocks)

    const segmentDefinitions = this.workspace.getBlocksByType(BlockTypes.SegmentDef, false)
      .map(segmentBlock => segmentBlock.getFieldValue("NAME"));

    const segmentReferences = segmentDefinitions
      .map(segmentName => SegmentReference.toolboxInstance(segmentName));

    if (!segmentDefinitions || segmentDefinitions.length === 0)
      return [SegmentDefinition.toolboxInstance()];

    return [SegmentDefinition.toolboxInstance(), ...segmentReferences]
  }

  private registerCodeGenerators(codeGenerator: any) {
    const generationCallback = (block: ExtendedBlocklyBlock) => {
      return block.mmBlock?.toCode();
    };

    codeGenerator[BlockTypes.SegmentDef] = generationCallback;
    codeGenerator[BlockTypes.SegmentRef] = generationCallback;
  }

  public createDefinitionBlock(workspace: WorkspaceSvg): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new SegmentDefinition(this, workspace);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = undefined;

    return blocklyBlock;
  }

  public createReferenceBlock(workspace: WorkspaceSvg): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new SegmentReference(this, workspace);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = undefined;

    return blocklyBlock;
  }
}

export { SegmentManager }