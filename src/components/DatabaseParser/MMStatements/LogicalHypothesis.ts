import { IMMStatement } from "../IMMStatement";
import { Keywords, WHITESPACE } from "../MM";

/**
 * Logical (“essential”) hypothesis
 */
class LogicalHypothesis implements IMMStatement {
  label: string;
  keyword: string = Keywords.LOGICAL_HYPOTHESIS;
  mathSymbols: string[];
  originalStatement: string;

  context: IMMStatement[] = [];
  type: string;

  constant: string;

  parse(dbStr: string, startIndex: number): number {
    const endIdx = dbStr.indexOf(Keywords.END_OF_STATEMENT, startIndex) + 2;
    this.originalStatement = dbStr.slice(startIndex, endIdx).trim();

    const params = this.originalStatement.split(WHITESPACE);
    this.label = params[0];
    this.constant = params[2]
    this.mathSymbols = params.slice(2, -1);
    this.type = this.mathSymbols[0];

    return endIdx;
  }
}

export { LogicalHypothesis }