
export interface IMMStatement {
  label: string;
  keyword: string;
  mathSymbols: string[];

  originalStatement: string;

  type?: string;
  context: IMMStatement[];

  /**
   * Parse statement starting at 'startIndex'.
   * @param databaseString Metamath database string
   * @param startIndex Start index of a statement
   * @returns End index of a parsed statement
   */
  parse(databaseString: string, startIndex: number): number;
}