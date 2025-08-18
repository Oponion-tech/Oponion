class Category {
    constructor(id, name, shortcut) {
        this.id = id;
        this.name = name;
        this.shortcut = shortcut;
    }
}

export default Category;

export function convertJsonToModel(json) {
    if (Array.isArray(json)) {
      return json.map(item => new Category({
        id: item.id,
        name: item.name,
        shortcut: item.shortcut
      }));
    }
    return new Category({
      id: json.id,
      name: json.name,
      shortcut: json.shortcut
    });
  }