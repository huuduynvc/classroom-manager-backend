const db = require('../utils/db');

module.exports = {
  all() {
    return db('class');
  },

  // findByUserId(userId) {
  //   return db('tasks').where('user_id', userId);
  // },

  async findById(id) {
    const classObj = await db('class').where('id', id);
    if (classObj.length === 0) {
      return null;
    }

    return task[0];
  },

  add(classObj) {
    return db('class').insert(classObj);
  },

  patch(id, classWithoutId) {
    return db('class').update(classWithoutId).where('id', id);
  },

  del(id) {
    return db('class')
      .where('id', id)
      .del();
  }
};