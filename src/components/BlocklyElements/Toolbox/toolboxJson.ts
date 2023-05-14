import { BlockTypes } from "../IBlocklyBlock";

export const toolboxJson : any = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "sep",
    },
    {
      "kind": "category",
      "name": "Constants",
      "custom": "MM_CONSTANTS"
    },
    {
      "kind": "category",
      "name": "Variables",
      "custom": "MM_VARIABLES"
    },
    {
      "kind": "sep",
    },
    {
      "kind": "category",
      "name": "Floating-point Hypo",
      "custom": "MM_FLOATING_HYPOS"
    },
    {
      "kind": "category",
      "name": "Axioms",
      "custom": "MM_AXIOMS"
    },
    {
      "kind": "category",
      "name": "Axiom blocks",
      "custom": "MM_BLOCK_AXIOMS"
    },
    {
      "kind": "category",
      "name": "Prooven axioms",
      "custom": "MM_BLOCK_PROOFS"
    },
    {
      "kind": "category",
      "name": "Proofs",
      "contents": [
        {
          "kind": "block",
          "type": BlockTypes.Proof
        }
      ]
    },
    {
      "kind": "sep",
    },
    {
      "kind": "category",
      "name": "Segments",
      "custom": "SEGMENTS"
    },
  ],
};