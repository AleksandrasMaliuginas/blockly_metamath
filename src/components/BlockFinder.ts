import { BlockDescriptor } from "./BlocklyElements/IBlocklyBlock";

type MMTypes = {
  selected: string, 
  options: {
    text: string, 
    value: string
  }[]
};

class BlockFinder {
  public searchString: string;
  public mmTypes: MMTypes;

  private selected = {
    searchQuery: '',
    keyword: '',
    variableType: ''
  };

  constructor() {
    this.searchString = '';
    this.mmTypes = {
      selected: '',
      options: [],
    };
  }

  setMMTypes(mmTypes: Set<string>) {
    this.mmTypes.options = Array.from(mmTypes).map(type => ({
      text: type, value: type
    }));
  }

  updateSearchKey(value: string) {
    this.selected.searchQuery = value;
  }

  updateSelectedMMType(value: string) {
    this.selected.variableType = value;
  }

  updateSelectedKeyword(value: string) {
    this.selected.keyword = value;
  }

  match(blockDescriptor: BlockDescriptor) : boolean {
    // if (this.selected.keyword && this.selected.keyword !== blockDescriptor.keyword) {
    //   return false;
    // }

    if (this.selected.variableType && this.selected.variableType !== blockDescriptor.statement.type) {
      return false;
    }

    if (this.selected.searchQuery && !blockDescriptor.statement.originalStatement?.includes(this.selected.searchQuery)) {
      return false;
    }

    return true;
  }
}

export { BlockFinder }