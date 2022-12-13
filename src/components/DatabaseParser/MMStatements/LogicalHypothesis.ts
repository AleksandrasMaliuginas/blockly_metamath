import { IMMStatement } from "../IMMStatement";
import { Keywords, WHITESPACE } from "../MM";

/**
 * Logical (“essential”) hypothesis
 */
class LogicalHypothesis implements IMMStatement {
  label: string | undefined;
  keyword: string | undefined;
  originalStatement: string | undefined;

  constant: string | undefined;
  mathSymbols: string[] = [];

  parse(dbStr: string, startIndex: number): number {
    const endIdx = dbStr.indexOf(Keywords.END_OF_STATEMENT, startIndex) + 2;
    this.originalStatement = dbStr.slice(startIndex, endIdx).trim();

    const params = this.originalStatement.split(WHITESPACE);
    this.label = params[0];
    this.keyword = params[1];
    this.constant = params[2]
    this.mathSymbols = params.slice(2, -1);

    return endIdx;
  }
}

export { LogicalHypothesis }