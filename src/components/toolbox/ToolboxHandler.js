import { MMConstant } from "../tokens/MMConstant";
import { MMVariable } from "../tokens/MMVariable";
import { MMFloatingHypo } from "../tokens/MMFloatingHypo";
import { MMAxiom } from "../tokens/MMAxiom";
import { MMBlock } from "../tokens/MMBlock";
import { MMProof } from "../tokens/MMProof";


export const ToolboxHandler = {
  registerToolboxCategoryCallbacks(workspace) {
    const categoryClass = {
      'MM_CONSTANTS': MMConstant,
      'MM_VARIABLES': MMVariable,
      'MM_FLOATING_HYPOS': MMFloatingHypo,
      'MM_AXIOMS': MMAxiom,
      'MM_BLOCKS': MMBlock,
      'MM_PROOFS': MMProof,
    }

    for (const key of Object.keys(categoryClass)) {
      workspace.registerToolboxCategoryCallback(
        key,
        categoryClass[key]._toolboxFlyoutCallback
      );

      // TESTING   TO DELETE
      categoryClass[key]._toolboxFlyoutCallback(null)
    }
    
  },
}