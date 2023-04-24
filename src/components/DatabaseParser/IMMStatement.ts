
export interface IMMStatement {
  label: string | undefined;
  keyword: string | undefined;
  originalStatement: string | undefined;
  mathSymbols: string[] | undefined;

  /**
   * Parse statement starting at 'startIndex'.
   * @param databaseString Metamath database string
   * @param startIndex Start index of a statement
   * @returns End index of a parsed statement
   */
  parse(databaseString : string, startIndex : number) : number;
}