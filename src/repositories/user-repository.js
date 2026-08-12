const crudRepository = require('./crud-repository');
const {User} = require('../models');
class userRepository extends crudRepository {
  constructor() {
    super(User);

  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email: email } });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = userRepository;