export default {
  _tokens: null,
  setTokens(tokenList) { this._tokens = tokenList; },
  getTokens() { return this._tokens; },
  getTokensByType(typeName) {
    return this._tokens.filter(t => t.constructor.name === typeName);
  },
}