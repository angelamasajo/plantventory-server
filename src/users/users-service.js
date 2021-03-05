const UsersService = {
  getAllUsers(knex) {
    return knex
      .select('*')
      .from('users')
  },
  getAllPlantUsers(knex) {
    return knex
      .select('*')
      .from('user_plants')
  },
  deleteFromUserPlants(knex, plant_id) {
    return knex('user_plants')
      .where({ plant_id })
      .delete()
  },
}


module.exports = UsersService