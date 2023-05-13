import { Block } from "blockly";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { IMMStatement } from "../DatabaseParser/IMMStatement";

export type ExtendedBlocklyBlock = Block & {
  init?: () => void,
  mmBlock?: MMBlock,
  descriptor?: BlockDescriptor,
}

export interface MMBlock {
  init(): void;
  toCode(): string;
}

export interface BlockDescriptor {
  readonly statement: IMMStatement;

  blockName(): string;
  toolboxInstance(): ToolboxItemInfo;
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