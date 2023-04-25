import { IMMStatement } from "../IMMStatement";
import { Keywords, WHITESPACE } from "../MM";

class Constant implements IMMStatement {
  label: string | undefined;
  keyword: string | undefined;
  originalStatement: string | undefined;

  mathSymbols: string[] = [];

  constructor(label : string, originalStatement : string) {
    this.label = label;
    this.keyword = Keywords.CONSTANT;
    this.originalStatement = originalStatement;

    this.mathSymbols = [label];
  }

  parse(dbStr: string, startIndex: number): number {
    const endIdx = dbStr.indexOf(Keywords.END_OF_STATEMENT, startIndex) + 2;
    this.originalStatement = dbStr.slice(startIndex, endIdx).trim();

    const params = this.originalStatement.split(WHITESPACE);
    this.keyword = params[0];
    this.mathSymbols = params.slice(1, -1);

    return endIdx;
  }
}

export { Constant }