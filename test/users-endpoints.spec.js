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

  // describe(`POST /api/users/1/plants`, () => {
  //   const testUsers = makeUsersArray();
  //   beforeEach('insert malicious plant', () => {
  //     return db
  //       .into('users')
  //       .insert(testUsers)
  //   })
    
  //   it(`creates a plant, responding with 201 and the new plant`, function() {
  //     this.retries(3)
  //     const newPlant = {
  //       name: 'Test new plant',
  //       plant_type: 'Succulent',
  //       toxicity: 'Toxic',
  //       care_details: 'Care detail here'
  //     }
  //     return supertest(app)
  //       .post('/api/plants')
  //       .send(newPlant)
  //       .expect(201)
  //       .expect(res => {
  //         expect(res.body.name).to.eql(newPlant.name)
  //         expect(res.body.plant_type).to.eql(newPlant.plant_type)
  //         expect(res.body.toxicity).to.eql(newPlant.toxicity)
  //         expect(res.body.care_details).to.eql(newPlant.care_details)
  //         expect(res.body).to.have.property('id')
  //         expect(res.headers.location).to.eql(`/api/plants/${res.body.id}`)
  //       })
  //       .then(res =>
  //         supertest(app)
  //           .get(`/api/plants/${res.body.id}`)
  //           .expect(res.body)
  //       )
  //   })

  //   const requiredFields = ['name', 'plant_type', 'toxicity', 'care_details']

  //   requiredFields.forEach(field => {
  //     const newPlant = {
  //       name: 'Test new plant',
  //       plant_type: 'Succulent',
  //       toxicity: 'Toxic',
  //       care_details: 'Care detail here'
  //     }

  //     it(`responds with 400 and an error message when the '${field}' is missing`, () => {
  //       delete newPlant[field]

  //       return supertest(app)
  //         .post('/api/plants')
  //         .send(newPlant)
  //         .expect(400, {
  //           error: { message: `Missing '${field}' in request body` }
  //         })
  //     })
  //   })

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
