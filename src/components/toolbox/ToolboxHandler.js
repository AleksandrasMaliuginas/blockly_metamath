import { MMConstant } from "../tokens/MMConstant";
import { MMVariable } from "../tokens/MMVariable";
import { MMFloatingHypo } from "../tokens/MMFloatingHypo";
import { MMAxiom } from "../tokens/MMAxiom";
import { MMBlock } from "../tokens/MMBlock";


export const ToolboxHandler = {
  registerToolboxCategoryCallbacks(workspace) {
    const categoryClass = {
      'MM_CONSTANTS': MMConstant,
      'MM_VARIABLES': MMVariable,
      'MM_FLOATING_HYPOS': MMFloatingHypo,
      'MM_AXIOMS': MMAxiom,
      'MM_BLOCKS': MMBlock,
    }

    for (const key of Object.keys(categoryClass)) {
      workspace.registerToolboxCategoryCallback(
        key,
        categoryClass[key]._toolboxFlyoutCallback
      );
    }
    
  },
}