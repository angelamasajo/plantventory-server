const UsersService = {
  getAllUsers(knex) {
    return knex
      .select('*')
      .from('users')
  },
  // getAllPlantUsers(knex) {
  //   return knex
  //     .select('*')
  //     .from('user_plants')
  // },
  getAllPlantUsers(knex) {
    return knex.raw(`
      SELECT 
        plants.name as plant_name,
        users.user_name as user
      FROM 
        plants 
        JOIN 
        user_plants
        ON plants.id = user_plants.plant_id
        JOIN 
        users
        ON user_plants.user_id = users.id;
    `)
  },
  deleteFromUserPlants(knex, plant_id) {
    return knex('user_plants')
      .where({ plant_id })
      .delete()
  },
}


module.exports = UsersService