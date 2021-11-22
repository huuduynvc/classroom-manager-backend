const db = require('../utils/db');

module.exports = {
  all() {
    return db('membership');
  },

  async findByUserId(id) {
    return await db('membership').where('id_user',id);
  },

  async findByClassId(id) {
    return await db('membership').where('id_class',id);
  },

  async findByUserIdAndClassId(id_user,id_class) {
    return await db('membership').where({'id_user':id_user,'id_class':id_class});
  },

  add(memberObj) {
    return db('membership').insert(memberObj);
  },

  patch(id, memberWithoutId) {
    return db('membership').update(memberWithoutId).where('id', id);
  },

  del(id) {
    return db('membership')
      .where('id', id)
      .del();
  }
};