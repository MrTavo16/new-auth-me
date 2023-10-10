'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User,{
        as:'Owner',
        hooks:true,
        foreignKey:'ownerId'
      }),
      Spot.hasMany(models.Review,{
        foreignKey:'spotId'
      }),
      Spot.hasMany(models.Booking,{
        foreignKey:'spotId'
      }),
      Spot.hasMany(models.Image,{
        as:'SpotImages',
        foreignKey:'imageableId',
        constraints:false,
        scope:{
          imageableType:'SpotPics'
        }
      })
    }
  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    address: {
      type:DataTypes.STRING,
      unique:true
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false
    },
    country: {
      type:DataTypes.STRING,
      allowNull:false
    },
    lat: {
      type:DataTypes.FLOAT,
      isNumeric:true,
      allowNull:false
    },
    lng: {
      type:DataTypes.FLOAT,
      isNumeric:true,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false
    },
    price: {
      type:DataTypes.INTEGER,
      isNumeric:true,
      allowNull:false
    },
    numReviews:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0,
      min:0
    },
    avgStarRating:{
      type:DataTypes.FLOAT,
      allowNull:false,
      defaultValue:0,
      min:0
    },
    previewImage:{
      type:DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope:{
      attributes:{
        exclude:['previewImage', 'totalStars'],
        include:['createdAt','updatedAt']
      }
    }
  });
  return Spot;
};