const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makePlantsArray } = require('./plants.fixtures')
// const { makePlantsArray, makeMaliciousPlant } = require('./plants.fixtures')
const { makeUsersArray, makeUserPlantsArray } = require('./users.fixtures')

describe('Users Endpoints', function() {
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


  //----all plants with user
  describe(`GET /api/users/1/plants`, () => {
    context(`Given no plants with user`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/users/1/plants')
          .expect(200, [])
      })
    })

    context(`Given there are plants with user`, () => {
      const testUsers = makeUsersArray()
      const testUserPlants = makeUserPlantsArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('user_plants')
              .insert(testUserPlants)
          }) 
      })

      it('responds with 200 and all of the user plants', () => {
        return supertest(app)
          .get('/api/users/1/plants')
          .expect(200, testUserPlants)
      })
    }) 

  })

  describe(`POST /api/users/1/plants`, () => {
    const testUserPlants = makeUserPlantsArray();
    beforeEach('insert plant', () => {
      return db
        .into('user_plants')
        .insert(testUserPlants)
    })
    
    it(`creates a user plant, responding with 201 and the new plant`, function() {
      this.retries(3)
      const newUserPlant = {
        plant_id: 100000,
        user_id: 1
      }
      return supertest(app)
        .post('/api/users/1/plants')
        .send(newUserPlant)
        .expect(201)
        .expect(res => {
          expect(res.body.plant_id).to.eql(newUserPlant.plant_id)
          expect(res.body.user_id).to.eql(newUserPlant.user_id)
          // expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/users/1/plants`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/users/1/plants`)
            .expect(res.body)
        )
    })

    const requiredFields = ['plant_id', 'user_id']

    requiredFields.forEach(field => {
      const newUserPlant = {
        plant_id: 100000,
        user_id: 1,
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUserPlant[field]

        return supertest(app)
          .post('/api/users/1/plants')
          .send(newUserPlant)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

  //   it('removes XSS attack content from response', () => {
  //     const { maliciousPlant, expectedPlant } = makeMaliciousPlant()
  //     return supertest(app)
  //       .post(`/api/plants`)
  //       .send(maliciousPlant)
  //       .expect(201)
  //       .expect(res => {
  //         expect(res.body.name).to.eql(expectedPlant.name)
  //         expect(res.body.plant_type).to.eql(expectedPlant.plant_type)
  //         expect(res.body.toxicity).to.eql(expectedPlant.toxicity)
  //         expect(res.body.care_details).to.eql(expectedPlant.care_details)
  //       })
  })
})
