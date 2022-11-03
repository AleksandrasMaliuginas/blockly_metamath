import { MMToken } from "../MMToken";


export class MMComment extends MMToken {
  
  parse(fileStr, idx) {
    const end = fileStr.indexOf('$)', idx);
    return end + 2;
  }
}