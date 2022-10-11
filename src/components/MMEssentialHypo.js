import { MMToken } from "./MMToken";


export class MMEssentialHypo extends MMToken {
  
  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    
    let params = fileStr.slice(idx, end - 1).split(' ');
    this.label = params[0];
    this.params = params.slice(2);

    return end + 2;
  }
}