const db = require('../utils/db');

module.exports = {
  all() {
    const list = db('admin').leftJoin('user','admin.userid','user.id');
    for (element in list) {
      delete element.password;
      delete element.rfToken;
      // code block to be executed
    }
    return list;
  },

  async single(id) {
    const users = await db('admin')
      .where('id', id);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  async add(user) {
    const ids = await db('admin').insert(user);
    return ids[0];
  },

  async findByUserId(id){
    const users = await db('admin')
    .where('userid', id);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  patch(id, userWithoutId) {
    return db('admin').update(userWithoutId).where('id', id);
  },

  del(id) {
    return db('admin')
      .where('id', id)
      .del();
  },
};