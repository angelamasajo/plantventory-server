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
  .route('/')
  //get all users
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })

usersRouter
  .route('/plants')
  //get all plants from user
  .get((req,res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllPlantUsers(knexInstance)
      .then(users => {
        res.json(users.rows)
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
    
    UsersService.insertUserPlant(
      req.app.get('db'),
      newUserPlant
    )
      .then(plant => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${plant.plant_id}`))
          .json(serializeUserPlants(plant))
      })
      .catch(next)
  })

usersRouter
  .route('/plants/:plant_id')
  //get specific plant from user list
  .all((req, res, next) => {
    UsersService.getUserPlantById(
      req.app.get('db'),
      req.params.plant_id,
    )
      .then(plant => {
        if (!plant) {
          return res.status(404).json({
            error: { message: `Plant doesn't exist` }
          })
        }
        res.plant = plant //save the article for the next middleware
        next() //don't forget to call next so the next middleware happens
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUserPlants(res.plant))
  })
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