const { User } = require('../models');

const userData = [{
        username: 'JohnDoe',
        password: 'jkohn'

    },
    {
        username: 'Toni',
        password: 'Tay'
    },
    {
        username: 'Jota',
        password: 'Jota'
    }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;