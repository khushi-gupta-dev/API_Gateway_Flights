const crudRepository = require('./crud-repository');
const {User} = require('../models');
class userRepository extends crudRepository {
  constructor() {
    super(User);

  }
}

module.exports = userRepository;