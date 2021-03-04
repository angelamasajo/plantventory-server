const path = require('path')
const express = require('express')
// const xss = require('xss')
const logger = require('../logger')
const PlantsService = require('./plants-service')

const plantsRouter = express.Router()
const jsonParser = express.json()

const serializePlants = plant => ({
  id: plant.id,
  name: plant.name,
  plant_type: plant.plant_type,
  toxicity: plant.toxicity, 
  care_details: plant.care_details
})

plantsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    PlantsService.getAllPlants(knexInstance)
      .then(users => {
        res.json(users.map(serializePlants))
      })
      .catch(next)
  })

module.exports = plantsRouter