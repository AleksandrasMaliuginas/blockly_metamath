/**
 * This code is taken from https://mm.ivank.net/
 * Author: Ivan Kerin (https://github.com/ivank)
 */

var MM = {};

MM.load = function (path, resp) {
  var request = new XMLHttpRequest();
  request.open("GET", path, true);
  //request.responseType = "arraybuffer";
  request.onload = function (e) { resp(e.target.response); };
  request.send();
}

MM.save = function (str, path) {
  var dataURI = "data:application/octet-stream;base64," + btoa(str);
  window.location.href = dataURI;
}

MM.clone = function (o) { return JSON.parse(JSON.stringify(o)); }

MM.eqArray = function (a, b) {
  var al = a.length, bl = b.length;
  if (al != bl) return false;
  for (var i = 0; i < al; i++) if (a[i] != b[i]) return false;
  return true;
  //return JSON.stringify(a)==JSON.stringify(b);
}

MM._tokenize = function (str) {
  var tokens = [], slen = str.length;
  for (var i = 0; i < slen; i++) {
    var c = str[i];

    if (c == "$" && str[i + 1] == "(") { while (str[i] != "$" || str[i + 1] != ")") { i++; } i++; }
    //if(c=="$" && str[i+1]=="(")  while(i<slen) {  i++;  if(str[i]=="$" && str[i+1]==")") { i++; break; }  }
    else if (c == " " || c == "\n" || c == "\r" || c == "\t") { }
    else {
      var start = i;
      while (c != " " && c != "\n" && c != "\r" && c != "\t" && i < slen) { i++; c = str[i]; }
      tokens.push(str.substring(start, i));
    }
  }
  return tokens;
}

MM.parse = function (buff) {
  var tokens = MM._tokenize(buff);

  var segs = [], cseg = null, ctype = null, label = null, phead = true;

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var c0 = token[0], c1 = token[1];
    if (c0 == "$") {
      if (c1 == "c" || c1 == "v" || c1 == "d") { cseg = { type: c1, cont: [] }; ctype = c1; }
      if (c1 == "f" || c1 == "a" || c1 == "e") { cseg = { type: c1, cont: [], lab: label }; ctype = c1; }
      if (c1 == "p") { cseg = { type: c1, cont: [], body: [], lab: label }; ctype = c1; phead = true; }
      if (c1 == "=") { phead = false; }

      if (c1 == "{" || c1 == "}") { segs.push({ type: c1 }); };
      if (c1 == ".") { segs.push(cseg); cseg = null; ctype = null; }
    }
    else {
      if (ctype == null) label = token;
      if (ctype == "c" || ctype == "v" || ctype == "d" || ctype == "f" || ctype == "a" || ctype == "e") cseg.cont.push(token);
      if (ctype == "p") if (phead) cseg.cont.push(token); else cseg.body.push(token);
    }
  }
  return segs;
}

MM.decompress = function (proof, hyp, segs, lmap) {
  var labs = [], i = 1;
  while (proof[i] != ")") { labs.push(proof[i]); i++; }

  var nums = [], num = 0;
  var steps = [], tss = [];

  i++;
  while (i < proof.length) {
    var wrd = proof[i];
    for (var j = 0; j < wrd.length; j++) {
      var c = wrd.charCodeAt(j);
      if (65 <= c && c <= 84) { nums.push(num * 20 + (c - 64)); num = 0; } // A .. T
      else if (85 <= c && c <= 89) num = num * 5 + (c - 84);   // U .. Y
      else if (c == 90) { steps.push(nums.length); tss.push(0); }  // Z
      else if (c == 63) nums.push(0);
      else throw c;
    }
    i++;
  }

  var proof = [];
  for (var i = 0; i < nums.length; i++) {
    var num = nums[i];
    if (num == 0) proof.push("?");
    else if (num <= hyp.length) proof.push(hyp[num - 1]);
    else if (num <= hyp.length + labs.length) proof.push(labs[num - hyp.length - 1]);
    else {
      var ind = num - hyp.length - labs.length - 1;
      if (tss[ind] == 0) tss[ind] = MM.treeSize(proof, steps[ind], segs, lmap);
      var tsize = tss[ind];
      var plen = proof.length;
      for (var j = 0; j < tsize; j++) proof.push(proof[steps[ind] - tsize + j]);
      for (var j = 0; j < steps.length; j++) if (steps[j] > plen) steps[j] += tsize - 1;
    }
  }
  return proof;
}

MM.treeSize = function (proof, ind, segs, lmap) {
  var lab = proof[ind - 1];
  if (lab == "?") return 1;
  var seg = segs[lmap[lab]];
  if (seg.type == "f" || seg.type == "e") return 1;
  var tsize = 1;
  for (var i = 0; i < seg.hyp.length; i++) tsize += MM.treeSize(proof, ind - tsize, segs, lmap);
  return tsize;
}

MM.encode = function (segs) {
  var s = "";
  var depth = 0;
  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i], t = seg.type;

    if (t == "}") depth--;
    for (var j = 0; j < depth; j++) s += "    ";
    if (t == "{") depth++;

    if (t == "f" || t == "a" || t == "p" || t == "e") s += seg.lab + " ";

    s += "$" + t;
    if (t == "{" || t == "}") { }
    else if (t == "(") s += " " + seg.cont.join(" ") + " $)";
    else if (t == "p") s += " " + seg.cont.join(" ") + " $= " + seg.body.join(" ") + " $.";
    else s += " " + seg.cont.join(" ") + " $.";
    s += "\n";
  }
  return s;
}

MM.preprocess = function (segs, data, elab) {
  var i = 0, cs = [], vs = [], es = [], ds = {}, lmap = {}, vmap = {};
  var res = MM._preprocess(segs, i, cs, vs, es, ds, lmap, vmap, elab);
  data.vmap = vmap; data.lmap = lmap;
  return res;
}

MM.concatTo = function (a, b) { var bl = b.length, i = 0; while (i < bl) { a.push(b[i]); i++; } }

MM._preprocess = function (segs, i, cs, vs, es, ds, lmap, vmap, elab) {
  var ocsl = cs.length;
  var ovsl = vs.length;
  var oesl = es.length;
  ds = MM.clone(ds);

  var out = 0;

  while (i < segs.length) {
    var seg = segs[i];
    if (seg.type == "c") MM.concatTo(cs, seg.cont);
    if (seg.type == "v") MM.concatTo(vs, seg.cont);
    if (seg.type == "e") es.push(seg.lab);
    if (seg.type == "d") {
      var cont = seg.cont;
      for (var j = 0; j < cont.length; j++)
        for (var k = 0; k < cont.length; k++) {
          var cj = cont[j], ck = cont[k];
          //if(j==k) continue;
          if (cj >= ck) continue;
          if (ds[cj] == null) ds[cj] = [];
          ds[cj].push(ck);
        }
    }
    if (seg.type == "f") vmap[seg.cont[1]] = i;
    if (seg.type == "f" || seg.type == "e" || seg.type == "a" || seg.type == "p") lmap[seg.lab] = i;
    if (seg.type == "a" || seg.type == "p") {
      MM.prepareAssertion(segs, seg, es, lmap, vmap);
      seg.ds = MM.clone(ds);
      if (seg.lab == elab) { out = -1; break; }
    }
    if (seg.type == "{") { var res = MM._preprocess(segs, i + 1, cs, vs, es, ds, lmap, vmap, elab); if (res == -1) { out = -1; break; } i = res; }
    if (seg.type == "}") { out = i; break; }
    i++;
  }

  while (cs.length > ocsl) cs.pop();
  while (vs.length > ovsl) vs.pop();
  while (es.length > oesl) es.pop();
  return out;
}

MM.prepareAssertion = function (segs, seg, es, lmap, vmap) {
  var vdata = MM._getVars(segs, seg.cont, es, lmap, vmap);
  var vars = vdata.vars, rows = vdata.rows;
  var hyp = [];
  for (var j = 0; j < rows.length; j++) hyp.push(segs[rows[j]].lab);
  for (var j = 0; j < es.length; j++) hyp.push(es[j]);
  seg.hyp = hyp; seg.vars = vars; seg.rows = rows; seg.vtypes = vdata.types;
}

MM.verifyAll = function (segs, lmap, vmap, printf) {
  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i];
    if (seg.type == "p") {
      //console.log("Verifying "+seg.lab);
      var res = MM.verifyProof(segs, seg.lab, lmap, vmap, printf);
      if (res != 0) return "Error while verifying " + seg.lab + "! " + res;
    }
  }
  return 0;
}

MM.verifyProof = function (segs, lab, lmap, vmap, printf) {
  var seg = segs[lmap[lab]];
  if (seg.body[0] == "(") seg.body = MM.decompress(seg.body, seg.hyp, segs, lmap);  //console.log("compressed proof", cseg.body);
  if (seg.body.indexOf("?") != -1) { printf("--- incomplete proof of " + seg.lab + "!"); return 0; }

  var body = seg.body;
  var stack = []
  for (var i = 0; i < body.length; i++) {
    var lab = body[i];
    var lseg = segs[lmap[lab]];
    if (lseg.type == "f" || lseg.type == "e") stack.push(lseg.cont);
    else if (lseg.type == "a" || lseg.type == "p") {
      var vars = lseg.vars;
      if (lseg.hyp.length > stack.length) return ("Not enough items on the stack.");

      MM._checkDisjointVars(lseg.ds, seg.ds, stack, stack.length - lseg.hyp.length, vars, vmap);
      var res = MM._checkVarTypes(stack, stack.length - lseg.hyp.length, lseg.vtypes);
      if (res != 0) return res;

      for (var j = vars.length; j < lseg.hyp.length; j++) {
        var rseg = segs[lmap[lseg.hyp[j]]];
        var enew = MM._substitute(rseg.cont, stack, stack.length - lseg.hyp.length, vars, vmap);
        var eonstack = stack[stack.length - lseg.hyp.length + j];
        if (!MM.eqArray(enew, eonstack))
          return ("Couldn't match hypothesis \n" + enew.join(" ") + "\nwith\n" + eonstack.join(" ") + "\non stack.");
      }
      var anew = MM._substitute(lseg.cont, stack, stack.length - lseg.hyp.length, vars, vmap);
      for (var j = 0; j < lseg.hyp.length; j++) stack.pop();
      stack.push(anew);
    }
  }
  if (stack.length != 1)
    return ("More than one item on the stack!");
  if (!MM.eqArray(seg.cont, stack[0]))
    return ("Couldn't match head of proof \n" + seg.cont.join(" ") + "\nwith\n" + stack[0].join(" ") + "\non on the stack.");
  return 0;
}

MM.wordsToString = function (wds) {
  var s = "";
  for (var i = 0; i < wds.length; i++) s += wds[i].join(" ") + "\n";
  return s;
}

MM._comparator = function (a, b) { return a - b; }

// returns unique variables, order as listed in "segs"
MM._getVars = function (segs, word, es, lmap, vmap) {
  var rows = [];
  var rmap = [];
  for (var i = 0; i < es.length; i++) {
    var hseg = segs[lmap[es[i]]];
    MM._addVars(hseg.cont, rows, vmap, rmap);
  }
  MM._addVars(word, rows, vmap, rmap);
  rows.sort(MM._comparator);
  var vars = [], vtps = [];
  for (var i = 0; i < rows.length; i++) { var vseg = segs[rows[i]]; vtps.push(vseg.cont[0]); vars.push(vseg.cont[1]); }
  return { vars: vars, types: vtps, rows: rows };
}

MM._addVars = function (word, rows, vmap, rmap) {
  for (var i = 0; i < word.length; i++) {
    var rnum = vmap[word[i]];
    if (rnum && rmap[rnum] == null) { rows.push(rnum); rmap[rnum] = 1; }
  }
}

MM._checkVarTypes = function (stack, ind, types) {
  for (var i = 0; i < types.length; i++) if (stack[ind + i][0] != types[i]) return "Hypotheses can't be unified: wrong variable type.";
  return 0;
}

MM._checkDisjointVars = function (ds, pds, stack, ind, vars, vmap) {
  for (var i = 0; i < vars.length; i++) {
    var v = vars[i];
    if (ds[v] == null) continue;
    var ex1 = stack[ind + i];
    for (var j = 0; j < ds[v].length; j++) {
      var v2 = ds[v][j], v2i = vars.indexOf(v2);
      if (v2i == -1) continue;
      var ex2 = stack[ind + v2i];
      // any two substitued expressions must not share a variable
      if (MM.shareVars(ex1, ex2, vmap)) { console.log(ds, v, ex1, v2, ex2); throw ("shared variable!"); }
      // any two variables from two expressions must be in $d of a proof
      for (var k = 0; k < ex1.length; k++) {
        var tok1 = ex1[k];
        if (vmap[tok1] == null) continue;
        for (var l = 0; l < ex2.length; l++) {
          var tok2 = ex2[l];
          if (vmap[tok2] == null) continue;
          if ((tok1 < tok2 && pds[tok1].indexOf(tok2) == -1) ||
            (tok2 < tok1 && pds[tok2].indexOf(tok1) == -1)) throw ("variables " + tok1 + " and " + tok2 + " are not in $d of a proof");
        }
      }
    }
  }
}

MM._substitute = function (word, stack, ind, vars, vmap) {
  // substitute
  var out = [];
  for (var i = 0; i < word.length; i++) {
    var tok = word[i];
    if (vmap[tok] == null) out.push(tok);
    else {
      var vpos = vars.indexOf(tok);
      var rsub = stack[ind + vpos];
      for (var j = 1; j < rsub.length; j++) out.push(rsub[j]);
    }
  }
  return out;
}

MM.shareVars = function (wa, wb, vmap) {
  for (var i = 0; i < wa.length; i++) {
    if (vmap[wa[i]] != null) if (wb.indexOf(wa[i]) != -1) { console.log(wa, wb); return true; }
  }
  return false;
}




export const MM_VERIFIER = MM;