const path = require('path')
const express = require('express')
// const xss = require('xss')
const logger = require('../logger')
const UsersService = require('./users-service')
const app = require('../app')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.id,
  user_name: user.user_name,
  user_password: user.user_password
})

const serializeUserPlants = user_plants => ({
  plant_id: user_plants.plant_id,
  user_id: user_plants.user_id
})

usersRouter
  .route('/1/plants')
  //get all plants from user
  .get((req,res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUserPlants(knexInstance)
      .then(plants => {
        res.json(plants.rows)
      })
      .catch(next)
  })
  //post new plant to user list
  .post(jsonParser, (req, res, next) => {
    const { plant_id, user_id } = req.body
    const newUserPlant = { plant_id, user_id }

    for (const [key, value] of Object.entries(newUserPlant))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    //edit
    UsersService.getAllUserPlants(req.app.get('db'))
      .then(plant => {
        console.log(plant.rows, 'sfasdkfajdifajdsofa=========')
        if (plant_id === plant.rows) {
          return res.status(400).json({
            error: { message: 'Plant already in your list' }
          })
        }
        res.status(201)
      })
      .catch(next)
    //getting all plants, add condition if plant already in list, send error/message
    
    UsersService.insertUserPlant(
      req.app.get('db'),
      newUserPlant
    )
      .then(plant => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl))
          .json(serializeUserPlants(plant))
      })
      .catch(next)
  })

usersRouter
  .route('/1/plants/:plant_id')
  .delete((req, res, next) => {
  UsersService.deleteFromUserPlants(
    req.app.get('db'),
    req.params.plant_id
  )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)
})

  

module.exports = usersRouter