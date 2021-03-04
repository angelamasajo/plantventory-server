const PlantsService = {
  getAllPlants(knex) {
    return knex
      .select('*')
      .from('plants')
  },
  insertPlant(knex, newPlant) {
    return knex
      .insert(newPlant)
      .into('plants')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
}

module.exports = PlantsService