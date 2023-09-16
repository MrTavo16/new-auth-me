'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING,
        allowNull:false
      },
      previewImage: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      imageableId: {
        type: Sequelize.INTEGER,
        // references:{
        //   model:'Spots',
        //   model:'Reviews'
        // },
        allowNull:false
      },
      imageableType: {
        type: Sequelize.ENUM('SpotPics', 'ReviewPics'),
        allowNull:false,
        // validate:{
        //   spotOrReview(val){
        //     if(!(val === 'SpotPics')|| !(val === 'ReviewPics')){
        //       throw new Error('Needs to be for a Spot or a Review')
        //     }
        //   }
        // }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Images";
    return queryInterface.dropTable(options);
  }
};