import { MM } from "../MMBlock";

export const blocks = [
  {
    "type": MM.Constant,
    "message0": '%1 %2',
    "args0": [
      {
        "type": "field_variable",
        "name": "CONST",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": [MM.Constant], // Specifies what types to put in the dropdown
        "defaultType": MM.Constant
      },
      {
        "type": "input_value",
        "name": "NEXT",
        "check": [MM.Constant, MM.Variable]
      }
    ],
    "output": MM.Constant,
    "colour": 160,
    "cssConfig": {
      "container": "AAAAAAAAAAAAAAAAAAAAAAAAAA"
    }
  },

  {
    "type": MM.Variable,
    "message0": '%1 %2',
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": [MM.Variable],
        "defaultType": MM.Variable
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
        "type": "field_variable",
        "name": "CONST",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": [MM.Constant],
        "defaultType": MM.Constant
      },
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": [MM.Variable],
        "defaultType": MM.Variable
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
    "output": MM.Axiom,
    "colour": 210,
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
  ],
};