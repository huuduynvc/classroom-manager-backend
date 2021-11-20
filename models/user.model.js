const db = require('../utils/db');

module.exports = {
  all() {
    return db('user');
  },

  async single(id) {
    const users = await db('user')
      .where('id', id);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async findByUserName(username) {
    const users = await db('user').where('username', username);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async findByEmail(email) {
    const users = await db('user').where('email', email);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async add(user) {
    const ids = await db('user').insert(user);
    return ids[0];
  },

  patch(id, userWithoutId) {
    return db('user').update(userWithoutId).where('id', id);
  },

  del(id) {
    return db('user')
      .where('id', id)
      .del();
  },

  updateRefreshToken(id, refreshToken) {
    return db('user').where('id', id).update('rfToken', refreshToken);
  },

  async isValidRefreshToken(id, refreshToken) {
    const list = await db('user').where('id', id).andWhere('rfToken', refreshToken);
    if (list.length > 0) {
      return true;
    }

    return false;
  }
};