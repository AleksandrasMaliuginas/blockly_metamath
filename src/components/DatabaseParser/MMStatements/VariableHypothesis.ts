import { IMMStatement } from "../IMMStatement";
import { Keywords, WHITESPACE } from "../MM";

/**
 * Variable-type (“floating”) hypothesis
 */
class VariableHypothesis implements IMMStatement {
  label: string | undefined;
  keyword: string | undefined;
  mathSymbols: string[] | undefined;
  originalStatement: string | undefined;

  constant: string | undefined;
  variable: string | undefined;

  parse(dbStr: string, startIndex: number): number {
    const endIdx = dbStr.indexOf(Keywords.END_OF_STATEMENT, startIndex) + 2;
    this.originalStatement = dbStr.slice(startIndex, endIdx).trim();

    const params = this.originalStatement.split(WHITESPACE);
    this.label = params[0];
    this.keyword = Keywords.VARIABLE_HYPOTHESIS;

    this.mathSymbols = params.slice(2, -1);
    this.constant = params[2];
    this.variable = params[3];

    return endIdx;
  }
}

export { VariableHypothesis }