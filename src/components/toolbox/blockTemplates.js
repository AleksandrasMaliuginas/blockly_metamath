
export const blocks = [
  {
    "type": "mm_constant",
    "message0": '%1 %2',
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": ["constant"], // Specifies what types to put in the dropdown
        "defaultType": "constant"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "String"
      }
    ],
    "output": null,
    "colour": 160,
  },
  {
    "type": "mm_variable",
    "message0": '%1 %2',
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": ["variable"],
        "defaultType": "variable"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "String"
      }
    ],
    "output": null,
    "colour": 330,
  },
  {
    "type": "mm_floating_hypo",
    "message0": '%1 %2 %3',
    "args0": [
      {
        "type": "field_variable",
        "name": "CONST",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": ["constant"],
        "defaultType": "constant"
      },
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": ["variable"],
        "defaultType": "variable"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "String"
      }
    ],
    "output": null,
    "colour": 230,
  },
  {
    "type": "mm_axiom",
    "message0": '%1',
    "args0": [
      {
        "type": "input_value",
        "name": "DEF",
        "variableTypes": ["constant", "variable"],
        // "defaultType": "constant"
      }
    ],
    "inputsInline": true,
    "output": null,
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
      "custom": "MM_FLOATING_HYPO"
    },
    {
      "kind": "category",
      "name": "Axioms",
      "colour": 210,
      "custom": "MM_AXIOMS"
    },
  ],
};