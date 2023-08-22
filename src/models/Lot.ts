import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  return sequelize.define('Lot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'lots', // Table name in your database
    timestamps: false, // Disable automatic timestamp fields
  });
};
