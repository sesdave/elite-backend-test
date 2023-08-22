import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the UserAttributes interface
export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  email: string;
}


// Extend the Model type with UserAttributes
export interface UserModel extends Model<UserAttributes>, UserAttributes {}

export const UserModelDefinition = (sequelize: Sequelize) => {
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
