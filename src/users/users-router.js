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

usersRouter
  .route('/')
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
  .get((req,res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllPlantUsers(knexInstance)
      .then(users => {
        res.json(users.rows)
      })
      .catch(next)
  })

usersRouter
  .route('/plants/:plant_id')
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