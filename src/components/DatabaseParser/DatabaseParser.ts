import { IDatabaseParser } from './IDatabaseParser'
import { IMMStatement } from './IMMStatement';
import { Keywords } from './MM';
import { StatementBuilder } from './StatementBuilder';

class DatabaseParser implements IDatabaseParser {

  private databaseString: string;
  private activeMathSymbols: string[];
  private _parsedStatements: IMMStatement[] = [];
  private _endIndex = 0;

  constructor(databaseString: string, activeMathSymbols: string[] = []) {
    this.databaseString = databaseString;
    this.activeMathSymbols = activeMathSymbols;
  }

  public parse(startIndex: number = 0): Array<IMMStatement> {
    this.preprocess();
    this.parseNext(startIndex);

    return this._parsedStatements;
  }

  /**
   * Parses statement at startIndex position in Database
   * @param startIndex 
   * @returns Nothing or endIdx if reaches END_OF_SCOPING_BLOCK '$}'
   */
  private parseNext(startIndex: number): void {
    const nextKeywordIndex = this.databaseString.indexOf('$', startIndex);
    const nextKeyword = this.databaseString
      .slice(nextKeywordIndex, nextKeywordIndex + 2);

    if (!nextKeyword || nextKeyword === Keywords.END_OF_SCOPING_BLOCK)
      return;

    const statement = StatementBuilder.build(nextKeyword);
    this._endIndex = statement.parse(this.databaseString, startIndex);

    this.parsedStatements.push(statement);
    // console.log(this._endIndex, statement);

    return this.parseNext(this._endIndex);
  }

  private preprocess() {
    const commentsRegex = /\$\((.+?)\$\)/gs;

    this.databaseString = this.databaseString
      .replace(commentsRegex, '')
      .trim();
  }

  public get parsedStatements() {
    return this._parsedStatements;
  }

  public get endIndex() {
    return this._endIndex;
  }
}

export { DatabaseParser }