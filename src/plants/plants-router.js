const path = require("path");
const express = require("express");
const logger = require("../logger");
const PlantsService = require("./plants-service");

const plantsRouter = express.Router();
const jsonParser = express.json();

const serializePlant = (plant) => ({
  id: plant.id,
  name: plant.name,
  plant_type: plant.plant_type,
  toxicity: plant.toxicity,
  care_details: plant.care_details,
});

//-----all plants
plantsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    PlantsService.getAllPlants(knexInstance)
      .then((users) => {
        res.json(users.map(serializePlant));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, plant_type, toxicity, care_details } = req.body;
    const newPlant = { name, plant_type, toxicity, care_details };

    for (const [key, value] of Object.entries(newPlant))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    PlantsService.insertPlant(req.app.get("db"), newPlant)
      .then((plant) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${plant.id}`))
          .json(serializePlant(plant));
      })
      .catch(next);
  });

//-----specific plant
plantsRouter
  .route("/:plant_id")
  .all((req, res, next) => {
    PlantsService.getById(req.app.get("db"), req.params.plant_id)
      .then((plant) => {
        if (!plant) {
          return res.status(404).json({
            error: { message: `Plant doesn't exist` },
          });
        }
        res.plant = plant; //save the article for the next middleware
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializePlant(res.plant));
  })
  .delete((req, res, next) => {
    PlantsService.deletePlant(req.app.get("db"), req.params.plant_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = plantsRouter;
