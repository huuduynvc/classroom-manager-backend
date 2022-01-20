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
    console.log(users);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async findByStudentId(studentid) {
    const users = await db('user').whereNot('ban',1).andWhere('studentid', studentid);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async findByEmail(email) {
    const users = await db('user').whereNot('ban', 1).andWhere('email', email);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async add(user) {
    const ids = await db('user').insert(user);
    return ids[0];
  },

  ban(id) {
    return db('user').where('id', id).update('ban',1);
  },

  patch(id, userWithoutId) {
    return db('user').where('id', id).update(userWithoutId);
  },

  del(id) {
    return db('user')
      .where('id', id)
      .del();
  },

  updateRefreshToken(id, refreshToken) {
    return db('user').whereNot('ban', 1).andWhere('id', id).update('rfToken', refreshToken);
  },

  updateStudentId(id, studentid) {
    return db('user').whereNot('ban', 1).andWhere('id', id).update('studentid', studentid);
  },

  async isValidRefreshToken(id, refreshToken) {
    const list = await db('user').whereNot('ban', 1).andWhere('id', id).andWhere('rfToken', refreshToken);
    if (list.length > 0) {
      return true;
    }

    return false;
  }
};