import { Block } from "blockly";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";

type BlockDefinitionInicializer = any;

export type ExtendedBlocklyBlock = Block & {
  init?: () => void,
  mmBlock?: MMBlock,
  descriptor?: BlockDescriptor,
}

export interface MMBlock {
  readonly descriptor?: BlockDescriptor;

  init(): void;
  toCode(): string;
}

export interface BlockDescriptor {
  blockName(): string;
  toolboxInstance(): ToolboxItemInfo;



  readonly type: string | null;
  readonly originalStatement: string;

  initializer(): BlockDefinitionInicializer

  blockToCode(block?: Block): string
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