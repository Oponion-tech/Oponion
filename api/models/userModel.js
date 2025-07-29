class UserModel {
    constructor(id, name, email, points) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.points = points;
    }
}

export default UserModel;

export function convertJsonToUserModel(json) {
  return new UserModel(json.id, json.name, json.email, json.points);
}