import { Blocks, Events } from "blockly";
import { MM } from "./MMToken";


const definitionBlock = {
  'kind': 'block',
  'type': MM.SegmentDef,
};

const referenceBlock = (name) => {
  return {
    'kind': 'block',
    'type': MM.SegmentRef,
    'fields': {
      'NAME': name,
    }
  }
};


export class Segment {

  parse(fileStr, idx) {
    return idx + 1;
  }

  static _toolboxFlyoutCallback(workspace) {
    /**
     * TODO: move to block registration 
     */
    if (Blocks[MM.SegmentDef] && !Blocks[MM.SegmentDef].onchange) {
      Blocks[MM.SegmentDef].onchange = (event) => {
        validateSegmentNames(workspace, event);
      };
    }

    const segmentBlockNames = workspace?.getBlocksByType(MM.SegmentDef)
      .map(segmentBlock => getSegmentBlockName(segmentBlock))
      .map(segmentName => referenceBlock(segmentName));

    if (!segmentBlockNames)
      return [definitionBlock];

    return [definitionBlock, ...segmentBlockNames];
  }
}


const validateSegmentNames = (workspace, event) => {
  // If Block is selected
  if (event.type === Events.SELECTED && event.newElementId) {
    setSelectedSegmentBlock(workspace, event.newElementId);
  }

  if (event.type !== Events.SELECTED && event.type !== Events.BLOCK_CHANGE) return;

  validateOnChange(workspace);
};

const selectedSegment = {
  definition: null,
  references: []
};

const setSelectedSegmentBlock = (workspace, blockId) => {
  const block = workspace.getBlockById(blockId);
  if (!block) return;

  const blockName = getSegmentBlockName(block);
  selectedSegment.definition = block;
  selectedSegment.references = workspace.getBlocksByType(MM.SegmentRef)
    .filter(el => getSegmentBlockName(el) === blockName);
};

const validateOnChange = (workspace) => {
  const block = selectedSegment.definition;
  if (!block || block.type !== MM.SegmentDef) return;

  const blockName = getSegmentBlockName(block);

  if (segmentDefinitionBlockAlreadyExists(workspace, block)) {
    setSegmentBlockName(block, blockName + '_new');
    block.markDirty();
    block.render();
  }

  // Update block references to match new name
  selectedSegment.references.forEach(refBlock => {
    setSegmentBlockName(refBlock, blockName);
    refBlock.markDirty();
    refBlock.render();
  });

};


const getSegmentBlockName = (block) => {
  return block.inputList[0].fieldRow[0].value_;
};

const setSegmentBlockName = (block, name) => {
  return block.inputList[0].fieldRow[0].value_ = name;
};

const segmentDefinitionBlockAlreadyExists = (workspace, block) => {
  const existingBlocks = workspace.getBlocksByType(MM.SegmentDef);
  const blockName = getSegmentBlockName(block);

  return existingBlocks.some(el =>
    el.id !== block.id && getSegmentBlockName(el) === blockName
  );
}