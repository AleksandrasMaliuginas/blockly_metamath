import { MMToken } from "./MMToken";


export class MMFloatingHypo extends MMToken {
  
  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    
    let params = fileStr.slice(idx, end).split(' ');

    this.label = params[0];
    this.constant = params[2];
    this.variable = params[3];

    return end + 2;
  }
}