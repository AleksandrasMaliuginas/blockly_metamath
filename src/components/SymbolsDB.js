export default {
  _symbols: [],

  initSymbols(tokens) {
    for (const token of tokens) {
      const symbol = token.create();
      if (Array.isArray(symbol)) {
        this._symbols = [...this._symbols, ...symbol];
      } else {
        this._symbols.push(symbol);
      }

    }
    console.table(this._symbols);
  },

  getSymbol(key, currentKey= null) {
    return this._symbols.find(el => el.key === key);
  },

  getSymbolsByType(type) {
    return this._symbols.filter(el => el?.type === type);
  },

  getSymbolContext(key= null) {

  },
}