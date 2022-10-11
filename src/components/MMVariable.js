import { MMToken } from "./MMToken";


export class MMVariable extends MMToken {
  
  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    
    this.params = fileStr.slice(idx + 3, end - 1).split(' ');
    // console.log('VARIABLE', fileStr.slice(idx, end + 2), this.params)

    return end + 2;
  }
}