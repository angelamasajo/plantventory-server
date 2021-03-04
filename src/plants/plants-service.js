const PlantsService = {
  getAllPlants(knex) {
    return knex
      .select('*')
      .from('plants')
  }
}

module.exports = PlantsService