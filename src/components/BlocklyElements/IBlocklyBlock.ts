import { ToolboxItemInfo } from "blockly/core/utils/toolbox";

type BlockDefinitionInicializer = any;

export interface IBlocklyBlock {
  initializer() : BlockDefinitionInicializer
  toolboxInstance() : ToolboxItemInfo

  blockToCode() : string
}

export const enum BlockTypes {
  Constant = 'MMConstant',
  Variable = 'MMVariable',
  FloatingHypo = 'MMFloatingHypo',
  Axiom = 'MMAxiom',
  // EssentialHypo = 'MMEssentialHypo',
  Block = 'MMBlock',
  Proof = 'MMProof',

  /**
   * Dummy token names to group and reuse labels used in proof.
   */
  SegmentDef = 'SegmentDef',
  SegmentRef = 'SegmentRef',
}