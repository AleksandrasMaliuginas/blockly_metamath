export const TokenManager = {
  _symbols: [],

  initTokens(tokens) {
    for (const token of tokens) {
      const symbol = token.create();
      if (Array.isArray(symbol)) {
        this._symbols = [...this._symbols, ...symbol];
      } else {
        this._symbols.push(symbol);
      }

    }
    // console.table(this._symbols);
  },

  getToken(key) {
    return this._symbols.find(el => el.key === key);
  },

  getTokensByType(type) {
    return this._symbols.filter(el => el?.type === type);
  },
}