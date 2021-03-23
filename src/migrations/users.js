import { DataTypes, Sequelize } from "sequelize";
import database from "@utils/database";

export default {
  skeleton: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
    email: { type: DataTypes.STRING(60), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(100), allowNull: false },
  },
  options: {
    sequelize: database.init(),
    modelName: "User",
    indexes: [
      {
        name: 'type_index',
        fields: ['type']
      }
    ]
  },
};
