'use strict';

const { User, Spot, Review, Image, Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName:'Test',
        lastName:'Tester',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:'Test',
        lastName:'Tester',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName:'Test',
        lastName:'Tester',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
    // await Spot.bulkCreate([
    //   {
    //     "address": "123 universal st",
    //     "city": "Maimi",
    //     "state": "Florida",
    //     "country": "United States of America",
    //     "lat": 37.7645358,
    //     "lng": -122.4730327,
    //     "name": "App Academy",
    //     "description": "Place where web developers are created",
    //     "price": 123
    //   }
    // ],{validate:true})
    // await Review.bulkCreate()
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};