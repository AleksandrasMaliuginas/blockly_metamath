import { IMMStatement } from "../IMMStatement";
import { Keywords, WHITESPACE } from "../MM";

class Constant implements IMMStatement {
  label: string;
  keyword: string = Keywords.CONSTANT;
  mathSymbols: string[];
  originalStatement: string;

  context: IMMStatement[] = [];

  constructor(label: string, originalStatement: string) {
    this.label = label;
    this.originalStatement = originalStatement;

    this.mathSymbols = [label];
  }

  parse(dbStr: string, startIndex: number): number {
    const endIdx = dbStr.indexOf(Keywords.END_OF_STATEMENT, startIndex) + 2;
    this.originalStatement = dbStr.slice(startIndex, endIdx).trim();

    const params = this.originalStatement.split(WHITESPACE);
    this.mathSymbols = params.slice(1, -1);

    return endIdx;
  }
}

export { Constant }