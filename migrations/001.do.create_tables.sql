CREATE TABLE plants (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  plant_type TEXT NOT NULL,
  toxicity TEXT NOT NULL,
  care_details TEXT NOT NULL
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL,
  user_password TEXT NOT NULL
);

CREATE TABLE user_plants (
  plant_id INTEGER REFERENCES plants(id),
  user_id INTEGER REFERENCES users(id)
);


--seed
INSERT INTO plants (name, plant_type, toxicity, care_details)
VALUES
  ('Monstera Deliciosa', 'Tropical', 'Toxic', 'Here is the care detail for the monstera'),
  ('Monstera Adansonii', 'Tropical', 'Toxic', 'Here is the care detail for the monstera adansonii'),
  ('Christmas Cactus', 'Holiday', 'Pet-safe', 'Here is the care detail for the christmas cactus'),
  ('Golden Pothos', 'Trailing', 'Toxic', 'Here is the care detail for the golden pothos'),
  ('Zamioculcas Zamiifolia', 'Other', 'Toxic', 'Here is the care detail for the ZZ plant');


INSERT INTO user_plants (plant_id, user_id)
VALUES
  (1, 1),
  (2, 1),
  (5, 1);

INSERT INTO users (user_name, user_password)
VALUES
  ('DemoUser', 'Password1234');