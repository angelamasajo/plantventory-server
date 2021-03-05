const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makePlantsArray } = require('./plants.fixtures')
const { makeUsersArray } = require('./users.fixtures')

describe('Plants Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE plants, users, user_plants RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE plants, users, user_plants RESTART IDENTITY CASCADE'))

  //-----all plants
  describe(`GET /api/plants`, () => {
    context(`Given no plants`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/plants')
          .expect(200, [])
      })
    })

    //not sure what's really happening here
    context('Given there are plants in the database', () => {
      const testUsers = makeUsersArray()
      const testPlants = makePlantsArray()

      beforeEach('insert plants', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('plants')
              .insert(testPlants)
          }) 
      })

      it('responds with 200 and all of the plants', () => {
        return supertest(app)
          .get('/api/plants')
          .expect(200, testPlants)
      })
    })
  })




  //----specific plants
  describe(`GET /api/plants/:plant_id`, () => {
    context(`Given no plants`, () => {
      it(`responds with 404`, () => {
        const plantId = 123456
        return supertest(app)
          .get(`/api/plants/${plantId}`)
          .expect(404, { error: { message: `Plant doesn't exist` } })
      })
    })
  })
})
