
import { MMAxiom } from "../tokens/MMAxiom";
import { MMBlock } from "../tokens/MMBlock";
import { MMProof } from "../tokens/MMProof";
import { Segment } from "../SegmentManager";
import { MMFloatingHypo } from "../BlocklyElements/BlocklyBlocks/MMFloatingHypo";


export const ToolboxHandler = {
  registerToolboxCategoryCallbacks(workspace) {
    const categoryClass = {
      // 'MM_CONSTANTS': MMConstant,
      // 'MM_VARIABLES': MMVariable,
      'MM_FLOATING_HYPOS': MMFloatingHypo,
      'MM_AXIOMS': MMAxiom,
      'MM_BLOCKS': MMBlock,
      'MM_PROOFS': MMProof,
      // 'MM_SEGMENTS': Segment,
      'MM_SEGMENTS': Segment,
    }

    for (const key of Object.keys(categoryClass)) {
      console.log("REGISTER: " + key)
      workspace.registerToolboxCategoryCallback(
        key,
        categoryClass[key]._toolboxFlyoutCallback
      );

      // TO DELETE AFTER BLOCK CREATION UPDATE
      categoryClass[key]._toolboxFlyoutCallback(null)
    }
    
  },
}