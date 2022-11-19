import { MM } from "../MMToken";

export const blocks = [
  {
    "type": MM.Constant,
    "message0": '%1 %2',
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "CONST",
        "text": "NO_LABEL"
      },
      {
        "type": "input_value",
        "name": "NEXT",
        "check": [MM.Constant, MM.Variable]
      }
    ],
    "inputsInline": false,
    "output": MM.Constant,
    "colour": 160
  },

  {
    "type": MM.Variable,
    "message0": '%1 %2',
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "VAR",
        "text": "NO_LABEL"
      },
      {
        "type": "input_value",
        "name": "NEXT",
        "check": [MM.Constant, MM.Variable]
      }
    ],
    "output": MM.Variable,
    "colour": 330,
  },
  {
    "type": MM.FloatingHypo,
    "message0": '%1 %2',
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "CONST",
        "text": "NO_LABEL"
      },
      {
        "type": "field_label_serializable",
        "name": "VAR",
        "text": "NO_LABEL"
      },
    ],
    "output": MM.FloatingHypo,
    "colour": 230,
  },
  {
    "type": MM.Axiom,
    "message0": '%1',
    "args0": [
      {
        "type": "input_value",
        "name": "DEF",
        "check": [MM.Constant] // Starts with constant
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "output": MM.Axiom,
    "colour": 210,
  },
  {
    "type": MM.EssentialHypo,
    "message0": '%1',
    "args0": [
      {
        "type": "input_value",
        "name": "DEF",
        "check": [MM.Constant] // Starts with constant
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "output": MM.EssentialHypo,
    "colour": 20,
  },
  {
    "type": MM.Block,
    "message0": 'b_axiom %1',
    "args0": [
      {
        "type": "input_statement",
        "name": "DEF"
      }
    ],
    "colour": 230,
  },
  {
    "type": MM.Proof,
    "message0": 'Proof %1 %2',
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "ASSERTION",
        "text": "NO_LABEL"
      },
      {
        "type": "input_statement",
        "name": "PROOF"
      },
    ],
    "colour": 20,
  },
  
]

export const toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "Constants",
      "colour": 160,
      "custom": "MM_CONSTANTS"
    },
    {
      "kind": "category",
      "name": "Variables",
      "colour": 330,
      "custom": "MM_VARIABLES"
    },
    {
      "kind": "category",
      "name": "Floating-point Hypo",
      "colour": 230,
      "custom": "MM_FLOATING_HYPOS"
    },
    {
      "kind": "category",
      "name": "Axioms",
      "colour": 210,
      "custom": "MM_AXIOMS"
    },
    {
      "kind": "category",
      "name": "Blocks",
      "colour": 60,
      "custom": "MM_BLOCKS"
    },
    {
      "kind": "category",
      "name": "Proofs",
      "colour": 20,
      "custom": "MM_PROOFS"
    },
  ],
};