'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Spot,{
        hooks:true,
        foreignKey:'spotId'
      })
      Review.belongsTo(models.User,{
        hooks:true,
        foreignKey:'userId'
      }),
      Review.hasMany(models.Image,{
        as:'ReviewImages',
        foreignKey:'imageableId',
        constraints:false,
        scope:{
          imageableType:'ReviewPics'
        }
      })
    }
  }
  Review.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    review: {
      type:DataTypes.STRING,
      allowNull:false
    },
    stars: {
      type:DataTypes.INTEGER,
      allowNull:false,
      isNumeric:true,
      max:5,
      min:1
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};