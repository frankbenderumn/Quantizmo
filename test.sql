CREATE ROLE root WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD '1234';
CREATE TABLE IF NOT EXISTS product (
  product_id INT NOT NULL,
  name varchar(250) NOT NULL,
  PRIMARY KEY (product_id)
);

CREATE TABLE IF NOT EXISTS stock (
  stock_id INT NOT NULL,
  name varchar(250) NOT NULL,
  price double precision NULL,
  PRIMARY KEY (stock_id)
);