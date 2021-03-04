const path = require('path')
const express = require('express')
// const xss = require('xss')
const logger = require('../logger')
const PlantsService = require('./plants-service')

const plantsRouter = express.Router()
const jsonParser = express.json()

const serializePlant = plant => ({
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
        res.json(users.map(serializePlant))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, plant_type, toxicity, care_details } = req.body
    const newPlant = { name, plant_type, toxicity, care_details }

    for (const [key, value] of Object.entries(newPlant))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    
    PlantsService.insertPlant(
      req.app.get('db'),
      newPlant
    )
      .then(plant => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${plant.id}`))
          .json(serializePlant(plant))
      })
      .catch(next)
  })

module.exports = plantsRouter