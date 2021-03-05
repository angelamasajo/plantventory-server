const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makePlantsArray } = require('./plants.fixtures')
// const { makeUsersArray } = require('./users.fixtures')

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

  describe(`GET /api/plants`, () => {
    context(`Given no plants`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/plants')
          .expect(200, [])
      })
    })

    // context('Given there are plants in the database', () => {
    //   // const testUsers = makeUsersArray()
    //   const testPlants = makePlantsArray()

    //   beforeEach('insert articles', () => {
    //     return db
    //       .into('blogful_users')
    //       .insert(testUsers)
    //       .then(() => {
    //         return db
    //           .into('blogful_articles')
    //           .insert(testArticles)
    //       }) 
    //   })

    //   it('responds with 200 and all of the articles', () => {
    //     return supertest(app)
    //       .get('/api/articles')
    //       .expect(200, testArticles)
    //   })
    // })
  })
})
