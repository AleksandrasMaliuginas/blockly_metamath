import { IMMStatement } from "./IMMStatement";

export interface IDatabaseParser {
  parse() : IMMStatement[] 
}