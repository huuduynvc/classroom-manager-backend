const db = require('../utils/db');

module.exports = {
  all() {
    return db('gradeboard');
  },

  async findById(id) {
    const gradeObj = await db('gradeboard').where('id', id);
    if (gradeObj.length === 0) {
      return null;
    }

    return gradeObj[0];
  },

  findByUserId(id) {
    return db('gradeboard').where('id_user',id);
  },

  findByClassId(id) {
    return db('gradeboard').leftJoin('grade','gradeboard.id_grade','grade.id').leftJoin('user','gradeboard.id_user','user.id').where('grade.id_class',id);
  },

  findByClassIdAndUserId(id_class,id_user) {
    return db('gradeboard').leftJoin('grade','gradeboard.id_grade','grade.id').leftJoin('user','gradeboard.id_user','user.id').where({'grade.id_class':id_class,'gradeboard.id_user':id_user});
  },

  add(gradeObj) {
    return db('gradeboard').insert(gradeObj);
  },

  patch(id, gradeWithoutId) {
    return db('gradeboard').update(gradeWithoutId).where('id', id);
  },

  del(id) {
    return db('gradeboard')
      .where('id', id)
      .del();
  }
};