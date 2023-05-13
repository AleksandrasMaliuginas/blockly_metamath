import { IMMStatement } from "../IMMStatement";
import { Keywords, WHITESPACE } from "../MM";

/**
 * Variable-type (“floating”) hypothesis
 */
class VariableHypothesis implements IMMStatement {
  label: string;
  keyword: string = Keywords.VARIABLE_HYPOTHESIS;
  mathSymbols: string[];
  originalStatement: string;

  context: IMMStatement[] = [];
  type: string;

  constant: string;
  variable: string;

  parse(dbStr: string, startIndex: number): number {
    const endIdx = dbStr.indexOf(Keywords.END_OF_STATEMENT, startIndex) + 2;
    this.originalStatement = dbStr.slice(startIndex, endIdx).trim();

    const params = this.originalStatement.split(WHITESPACE);
    this.label = params[0];

    this.mathSymbols = params.slice(2, -1);
    this.constant = params[2];
    this.variable = params[3];
    this.type = this.constant;

    return endIdx;
  }
}

export { VariableHypothesis }