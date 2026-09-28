const crudRepository = require('./crud-repository');
const {User, Role} = require('../models');
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

  async getUserWithRoles(id) {
    return User.findByPk(id, {
      attributes: ['id', 'email'],
      include: [{ model: Role, as: 'role', attributes: ['name'], through: { attributes: [] } }],
    });
  }
}

module.exports = userRepository;
