const path = require('path')
const express = require('express')
// const xss = require('xss')
const logger = require('../logger')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUsers = user => ({
  id: user.id,
  userName: user.userName,
  userPassword: user.userPassword
})

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUsers))
      })
      .catch(next)
  })

module.exports = usersRouter