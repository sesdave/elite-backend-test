"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelDefinition = void 0;
const sequelize_1 = require("sequelize");
const UserModelDefinition = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'users',
        timestamps: false,
    });
};
exports.UserModelDefinition = UserModelDefinition;
// ... (same as before)
// Export the UserModel instance
/*const UserModelInstance = (sequelize: Sequelize) => {
    return sequelize.define<UserModel>('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
    }, {
      tableName: 'users',
      timestamps: false,
    });
  };
  
  export { UserModelInstance as UserModel };
  

// Define the User model function
/*export default (sequelize: Sequelize) => {
  return sequelize.define<UserModel>('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'users', // Table name in your database
    timestamps: false, // Disable automatic timestamp fields
  });
};*/
