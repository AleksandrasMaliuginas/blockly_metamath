import { MMToken } from "../MMToken";


export class MMComment extends MMToken {
  
  parse(fileStr, startIdx) {
    const endIdx = fileStr.indexOf('$)', startIdx);
    return endIdx + 2;
  }
}