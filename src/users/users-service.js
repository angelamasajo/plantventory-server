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
        plants.care_details as care_details,
        plants.toxicity as toxicity,
        plants.plant_type as plant_type,
        plants.id as plant_id,
        users.user_name as user,
        users.id as user_id
      FROM 
        plants 
        JOIN 
        user_plants
        ON plants.id = user_plants.plant_id
        JOIN 
        users
        ON user_plants.user_id = users.id
        ;
    `)
  },
  getUserPlantById(knex, plant_id) {
    return knex
      .from('user_plants')
      .select('*')
      .where('plant_id', plant_id)
      .first()
  },
  deleteFromUserPlants(knex, plant_id) {
    return knex('user_plants')
      .where({ plant_id })
      .delete()
  },
  insertUserPlant(knex, newUserPlant) {
    return knex
      .insert(newUserPlant)
      .into('user_plants')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
}
module.exports = UsersService