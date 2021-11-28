const db = require('../utils/db');

module.exports = {
  all() {
    return db('grade');
  },

  async findByClassId(id) {
    return await db('grade').where('id_class',id);
  },

  add(gradeObj) {
    return db('grade').insert(gradeObj);
  },

  patch(id, gradeWithoutId) {
    return db('grade').update(gradeWithoutId).where('id', id);
  },

  del(id) {
    return db('grade')
      .where('id', id)
      .del();
  }
};