CREATE DATABASE sampledb
    WITH 
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;


/*
    Postgres way of selecting the database.
*/
\c sampledb

CREATE TABLE PERSON (
    ID INTEGER NOT NULL,
    NAME VARCHAR(255) NOT NULL,
    PRIMARY KEY(ID)
);

INSERT INTO PERSON 
(ID, NAME)
VALUES(1, 'henk');