const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makePlantsArray, makeMaliciousPlant } = require('./plants.fixtures')
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

    context(`Given an XSS attack plant`, () => {
      const testUsers = makeUsersArray()
      const { maliciousPlant, expectedPlant } = makeMaliciousPlant()

      beforeEach('insert malicious article', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('plants')
              .insert([ maliciousPlant ])
          })
      })


      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/plants`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedPlant.name)
            expect(res.body[0].plant_type).to.eql(expectedPlant.plant_type)
            expect(res.body[0].toxicity).to.eql(expectedPlant.toxicity)
            expect(res.body[0].care_details).to.eql(expectedPlant.care_details)
          })
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

      it('responds with 200 and the specified plant', () => {
        const plantId = 2
        const expectedPlant = testPlants [plantId - 1]
        return supertest(app)
          .get(`/api/plants/${plantId}`)
          .expect(200, expectedPlant)
      })
    })
  })

  // describe(`POST /api/plants`, () => {
  //   const testUsers = makeUsersArray();
  //   beforeEach('insert malicious article', () => {
  //     return db
  //       .into('blogful_users')
  //       .insert(testUsers)
  //   })
    
  //   it(`creates an article, responding with 201 and the new article`, function() {
  //     this.retries(3)
  //     const newArticle = {
  //       title: 'Test new article',
  //       style: 'Listicle',
  //       content: 'Test new article content...'
  //     }
  //     return supertest(app)
  //       .post('/api/articles')
  //       .send(newArticle)
  //       .expect(201)
  //       .expect(res => {
  //         expect(res.body.title).to.eql(newArticle.title)
  //         expect(res.body.style).to.eql(newArticle.style)
  //         expect(res.body.content).to.eql(newArticle.content)
  //         expect(res.body).to.have.property('id')
  //         expect(res.headers.location).to.eql(`/api/articles/${res.body.id}`)
  //         const expected = new Date().toLocaleString()
  //         const actual = new Date(res.body.date_published).toLocaleString()
  //         expect(actual).to.eql(expected)
  //       })
  //       .then(res =>
  //         supertest(app)
  //           .get(`/api/articles/${res.body.id}`)
  //           .expect(res.body)
  //       )
  //   })

  //   const requiredFields = ['title', 'style', 'content']

  //   requiredFields.forEach(field => {
  //     const newArticle = {
  //       title: 'Test new article',
  //       style: 'Listicle',
  //       content: 'Test new article content...'
  //     }

  //     it(`responds with 400 and an error message when the '${field}' is missing`, () => {
  //       delete newArticle[field]

  //       return supertest(app)
  //         .post('/api/articles')
  //         .send(newArticle)
  //         .expect(400, {
  //           error: { message: `Missing '${field}' in request body` }
  //         })
  //     })
  //   })

  //   it('removes XSS attack content from response', () => {
  //     const { maliciousArticle, expectedArticle } = makeMaliciousArticle()
  //     return supertest(app)
  //       .post(`/api/articles`)
  //       .send(maliciousArticle)
  //       .expect(201)
  //       .expect(res => {
  //         expect(res.body.title).to.eql(expectedArticle.title)
  //         expect(res.body.content).to.eql(expectedArticle.content)
  //       })
  //   })
  // })
})
