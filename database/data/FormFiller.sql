CREATE DATABASE FormFiller;

USE FormFiller;

-- Create tables. 
CREATE TABLE Partner (
    ID INTEGER NOT NULL,
    Contact_Person VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE Project (
    ID INTEGER NOT NULL,
    Partner_ID INTEGER NOT NULL,
    Description VARCHAR(255),
    Locked BIT NOT NULL,
    Global_Review SMALLINT NOT NULL,
    Contact_Review SMALLINT NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(Partner_ID) REFERENCES Partner(ID)
);

CREATE TABLE Employee (
    ID INTEGER NOT NULL,
    NAME VARCHAR(255) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE PROJECT_TEAM (
    Project_ID INTEGER NOT NULL,
    Employee_ID INTEGER NOT NULL,
    FOREIGN KEY (Project_ID) REFERENCES Project(ID),
    FOREIGN KEY (Employee_ID) REFERENCES Employee(ID)
);

CREATE TABLE Administrator (
    ID INTEGER NOT NULL,
    GOOGLE_AUTH_ID INTEGER NOT NULL,
    Name VARCHAR(255)  NOT NULL,
    PRIMARY KEY (ID)
);


-- Some test data.
INSERT INTO Partner
(ID, Contact_Person, name, EMAIL)
VALUES(1,  'Super Mario', 'Toad Kingdom', 'Mario@Koopamail.tk');

INSERT INTO Project 
(ID, Partner_ID, Description, Locked, Global_Review, Contact_Review)
VALUES(1, 1, 'test project', 0, 0, 0);


INSERT INTO Employee
(ID,NAME)
VALUES(1, 'Henk');

INSERT INTO Employee
(ID,NAME)
VALUES(2, 'Jaap');

INSERT INTO Employee
(ID,NAME)
VALUES(3, 'Piet');

