import { DatabaseParser } from "../DatabaseParser";
import { IMMStatement } from "../IMMStatement";
import { Keywords } from "../MM";

class ScopingBlock implements IMMStatement {
  label: string;
  keyword: string = Keywords.START_OF_SCOPING_BLOCK;
  mathSymbols: string[];
  originalStatement: string;

  context: IMMStatement[] = [];
  type: string;

  statements: IMMStatement[] = [];

  parse(dbStr: string, startIndex: number): number {
    startIndex = dbStr.indexOf(Keywords.START_OF_SCOPING_BLOCK, startIndex) + 2;

    const innerParser = new DatabaseParser(dbStr);
    this.statements = innerParser.parse(startIndex);
    const endIndex = dbStr.indexOf(Keywords.END_OF_SCOPING_BLOCK, innerParser.endIndex);

    this.label = this.statements.findLast(s => s)?.label;
    this.type = this.statements.findLast(s => s)?.mathSymbols[0];
    this.originalStatement = dbStr.slice(startIndex, endIndex).trim();

    return endIndex + 2;
  }
}

export { ScopingBlock }