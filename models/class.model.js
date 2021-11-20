const db = require('../utils/db');

module.exports = {
  all() {
    return db('class');
  },

  async findByUserId(id) {
    return await db('class').leftJoin('membership','class.id','membership.id_class').where('membership.id_user',id);
  },

  async findById(id) {
    const classObj = await db('class').where('id', id);
    if (classObj.length === 0) {
      return null;
    }

    return classObj[0];
  },

  async membersOfClass(id){
    return await db('membership').where('id_class',id).leftJoin('user','membership.id_user','user.id');
  },

  async teachersOfClass(id){
    return await db('membership').where({'id_class':id,'role_member': 1}).leftJoin('user','membership.id_user','user.id');
  },

  async studentsOfClass(id){
    return await db('membership').where({'id_class':id,'role_member': 2}).leftJoin('user','membership.id_user','user.id');
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