'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Review,{
        foreignKey:'imageableId',
        constraints:false
      }),
      Image.belongsTo(models.Spot,{
        foreignKey:'imageableId',
        constraints:false
      })
    }
  }
  Image.init({
    url: {
      type:DataTypes.STRING,
      allowNull:false
    },
    previewImage: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    imageableId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    imageableType: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        spotOrReview(val){
          if((!val === 'SpotPics')|| (!val === 'ReviewPics')){
            throw new Error('Needs to be for a Spot or a Review')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Image',
    defaultScope:{
      attributes:{
        exclude:['imageableId', 'imageableType', 'createdAt', 'updatedAt']
      }
    }
  });
  return Image;
};