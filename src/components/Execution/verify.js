/**
 * This code is inspired by https://mm.ivank.net/
 * Author: Ivan Kerin (https://github.com/ivank)
 */

import { MM_VERIFIER as MM } from "./MM.js";

export const mm_tool = {
  verify: (mmFileStr, thms) => {

    let result = [];

    const print = (string) => {
      result.push(string);
    };

    try {
      var time = Date.now();
      var str = mmFileStr;
      var segs = MM.parse(str);
      var data = {};
      var res = MM.preprocess(segs, data);
      result.push(res == 0 ? "Preprocess OK" : res);

      if (!thms) {
        res = MM.verifyAll(segs, data.lmap, data.vmap, print);
        result.push(res == 0 ? "Verification OK" : res);
      }
      else {
        for (var i = 0; i < thms.length; i++) {
          res = MM.verifyProof(segs, thms[i], data.lmap, data.vmap, print);
          result.push(res == 0 ? "Verification of " + thms[i] + " OK" : thms[i] + ": " + res);
        }
      }

      result.push("Time: " + (Date.now() - time) + " ms");
    } catch (e) {
      result.push(e);
      // throw e;
    }

    return result.join('\n');
  }
};