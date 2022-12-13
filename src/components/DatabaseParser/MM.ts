const enum Keywords {
  CONSTANT = "$c",
  DISJOINT = "$d",
  VARIABLE = "$v",
  VARIABLE_HYPOTHESIS = "$f",
  LOGICAL_HYPOTHESIS = "$e",
  AXIOMATIC_ASSERTION = "$a",
  PROOVABLE_ASSERTION = "$p",
  START_OF_PROOF = "$=",
  END_OF_STATEMENT = "$.",
  START_OF_SCOPING_BLOCK = "${",
  END_OF_SCOPING_BLOCK = "$}",

  START_OF_COMMENT = "$(",
  END_OF_COMMENT = "$)",
  START_OF_FILE = "$[",
  END_OF_FILE = "$]",
};

const WHITESPACE = /\s+/;

export { Keywords, WHITESPACE }