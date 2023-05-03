import { Block } from "blockly";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";

type BlockDefinitionInicializer = any;

export type ExtendedBlocklyBlock = {
  init?: () => void,
  mmBlock?: MMBlock,
} & Block // &Block  it is an option but not everywhere

export interface MMBlock {
  readonly descriptor: BlockDescriptor;

  init(): void
}

export interface BlockDescriptor {
  readonly type: string | null;

  initializer(): BlockDefinitionInicializer
  toolboxInstance(): ToolboxItemInfo

  blockToCode(): string
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