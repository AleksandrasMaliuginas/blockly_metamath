
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
        "variableTypes": ["variable"], // Specifies what types to put in the dropdown
        "defaultType": "variable"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "String"
      }
    ],
    "output": null,
    "colour": 130,
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
      "colour": 130,
      "custom": "MM_VARIABLES"
    },
  ]
};