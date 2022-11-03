export default {
  _tokens: null,
  _elementSet: {},

  setTokens(tokenList) { this._tokens = tokenList; },
  getTokens() { return this._tokens; },

  getTokensByType(...typeNames) {
    return this._tokens.filter(t => typeNames.indexOf(t.constructor.name) > -1);
  },

  
  getElements() {
    return this._elementSet;
  },

  push(key, value) {
    this._elementSet[key] = value;
  },

}