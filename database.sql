-- sql запросы для созд.табл.
-- созд.табл.
create TABLE person(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  surname VARCHAR(255)
);

create TABLE post(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content VARCHAR(255),
  userId INTEGER,
  FOREIGN KEY (userId) REFERENCES person (id)
);