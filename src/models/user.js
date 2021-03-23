import { Model } from "sequelize";
import bcrypt from "bcrypt";
import migrations from "@migrations/users";

/**
 * @typedef {Object} UserParam
 * @property {String} name
 * @property {String} email
 * @property {String} password
 * @property {String} type
 */

class User extends Model {
  /**
   *
   * @param {UserParam} data
   * @returns {Promise<User>}
   */
  static register(data) {
    data.password = bcrypt.hashSync(data.password, 10);
    return User.create(data);
  }

  tokenPayload() {
    return {
      email: this.email,
      id: this.id,
      name: this.name,
      type: this.type,
    };
  }

  static findById(id) {
    return User.findOne({
      attributes: ["id", "name", "email", "type"],
      where: {id}
    });
  }
}

User.init(migrations.skeleton, migrations.options);

export default User;
