DROP TABLE ScoreOnPuzzle;
DROP TABLE Fix;
DROP TABLE PropHave;
DROP TABLE Adjust;
DROP Table PuzzleHas;
DROP TABLE BookingMakesFor;
DROP TABLE EscapeRoom;
DROP TABLE Team;
DROP TABLE PuzzleDifficulty;
DROP TABLE Users;

CREATE TABLE EscapeRoom (
                            Name varchar(50),
                            Genre varchar(50),
                            TimeLimit integer DEFAULT 60,
                            PRIMARY KEY(Name)
);

CREATE TABLE Team (
                      Name VARCHAR2(100) PRIMARY KEY,
                      TeamCapacity INTEGER DEFAULT 10
);

CREATE TABLE PuzzleHas(
                          PuzzleID integer,
                          Pname varchar(50),
                          Ename varchar(50) NOT NULL,
                          PRIMARY KEY(PuzzleID),
                          FOREIGN KEY(Ename) REFERENCES EscapeRoom(Name) ON DELETE CASCADE,
                          UNIQUE(PName, EName)
);

CREATE TABLE ScoreOnPuzzle(
                              TeamName varchar(50),
                              Points integer,
                              PuzzleID integer,
                              PRIMARY KEY(TeamName, PuzzleID),
                              FOREIGN KEY(PuzzleID) REFERENCES PuzzleHas  ON DELETE CASCADE,
                              FOREIGN KEY(TeamName) REFERENCES Team(Name)  ON DELETE CASCADE
);

CREATE TABLE PuzzleDifficulty(
                                 Pname varchar(50),
                                 Difficulty integer,
                                 PRIMARY KEY(Pname)
);

CREATE TABLE PropHave(
                         PropID integer,
                         Name varchar(50),
                         Status varchar(50),
                         PuzzleID integer NOT NULL,
                         PRIMARY KEY(PropID),
                         FOREIGN KEY(PuzzleID) REFERENCES PuzzleHas(PuzzleID)  ON DELETE CASCADE
);

CREATE TABLE Users (
                       Name VARCHAR2(100),
                       Email VARCHAR2(100) PRIMARY KEY,
                       Address VARCHAR2(100) NOT NULL,
                       PostalCode VARCHAR2(100) NOT NULL,
                       PassWord VARCHAR2(100) NOT NULL,
                       UNIQUE(Address, PostalCode)
);

CREATE TABLE Fix(
                    Email varchar(50),
                    PropID integer,
                    PRIMARY KEY (Email, PropID),
                    FOREIGN KEY (Email) REFERENCES Users(Email),
                    FOREIGN KEY (PropID) REFERENCES PropHave(PropID)
);

CREATE TABLE Adjust(
                       Email varchar(50),
                       PuzzleID integer,
                       PRIMARY KEY (Email, PuzzleID),
                       FOREIGN KEY (Email) REFERENCES Users(Email),
                       FOREIGN KEY (PuzzleID) REFERENCES PuzzleHas(PuzzleID)
);

CREATE TABLE BookingMakesFor (
                                 BookingID integer PRIMARY KEY,
                                 DateBookingAdded DATE NOT NULL,
                                 UserEmail varchar2(100) NOT NULL,
                                 TeamName varchar2(100),
                                 RoomName varchar2(100) NOT NULL,
                                 FOREIGN KEY(RoomName) references EscapeRoom(Name)
);


INSERT INTO EscapeRoom VALUES ('The giggling', 'Horor', 75);
INSERT INTO EscapeRoom VALUES ('Fifteen reasons Vincent lied', 'Role-playing', 75);
INSERT INTO EscapeRoom VALUES ('Escape Arkaham', 'Horor', 60);
INSERT INTO EscapeRoom VALUES ('Leviathan', 'Classic', 120);
INSERT INTO EscapeRoom VALUES ('Marys Wonderland', 'Classic', 120);

INSERT INTO Team VALUES ('SEN', 6);
INSERT INTO Team VALUES ('The Rebels', 5);
INSERT INTO Team VALUES ('T369', 5);
INSERT INTO Team VALUES ('Dragon Slayers', 7);
INSERT INTO Team VALUES ('Let us cook', 4);

INSERT INTO PuzzleHas VALUES (1, 'Room lock', 'Marys Wonderland');
INSERT INTO PuzzleHas VALUES (2, 'Shelf lock', 'Fifteen reasons Vincent lied');
INSERT INTO PuzzleHas VALUES (3, 'Room lock', 'Fifteen reasons Vincent lied');
INSERT INTO PuzzleHas VALUES (4, 'Statue rotation', 'Escape Arkaham');
INSERT INTO PuzzleHas VALUES (5, 'Room lock', 'Leviathan');
INSERT INTO PuzzleHas VALUES (6, 'Room lock', 'The giggling');
INSERT INTO PuzzleHas VALUES (7, 'Shelf lock', 'The giggling');

INSERT INTO ScoreOnPuzzle VALUES ('Let us cook', 63, 2);
INSERT INTO ScoreOnPuzzle VALUES ('T369', 73, 1);
INSERT INTO ScoreOnPuzzle VALUES ('T369', 50, 4);
INSERT INTO ScoreOnPuzzle VALUES ('Dragon Slayers', 100, 7);
INSERT INTO ScoreOnPuzzle VALUES ('The Rebels', 89, 6);
INSERT INTO ScoreOnPuzzle VALUES ('The Rebels', 100, 1);
INSERT INTO ScoreOnPuzzle VALUES ('The Rebels', 55, 3);
INSERT INTO ScoreOnPuzzle VALUES ('Dragon Slayers', 99, 2);
INSERT INTO ScoreOnPuzzle VALUES ('Dragon Slayers', 90, 3);
INSERT INTO ScoreOnPuzzle VALUES ('Let us cook', 22, 7);
INSERT INTO ScoreOnPuzzle VALUES ('Let us cook', 45, 4);



INSERT INTO PuzzleDifficulty VALUES ('Room lock', 4);
INSERT INTO PuzzleDifficulty VALUES ('Shelf lock', 3);
INSERT INTO PuzzleDifficulty VALUES ('Statue rotation', 5);

INSERT INTO Users VALUES ('User1', 'user1@gmail.com', '1000 Bridgeport Rd', 'V6V A03', '123');
INSERT INTO Users VALUES ('User2', 'user2@gmail.com', '435 Cambie St', 'F8S 4G3', '123');

INSERT INTO BookingMakesFor VALUES ('292872', '2023-11-08', 'user1@gmail.com', 'SEN', 'Marys Wonderland');
INSERT INTO BookingMakesFor VALUES ('292875', '2023-11-09', 'user2@gmail.com', 'SEN', 'The giggling');
INSERT INTO BookingMakesFor VALUES ('292876', '2023-11-11', 'user2@gmail.com', 'SEN', 'Fifteen reasons Vincent lied');
INSERT INTO BookingMakesFor VALUES ('292877', '2023-11-13', 'user2@gmail.com', 'SEN', 'Escape Arkaham');
INSERT INTO BookingMakesFor VALUES ('292878', '2023-11-18', 'user2@gmail.com', 'SEN', 'Leviathan');
INSERT INTO BookingMakesFor VALUES ('292879', '2023-11-21', 'user1@gmail.com', 'T369', 'Marys Wonderland');
INSERT INTO BookingMakesFor VALUES ('292880', '2023-09-01', 'user2@gmail.com', 'T369', 'The giggling');
INSERT INTO BookingMakesFor VALUES ('292881', '2023-11-11', 'user2@gmail.com', 'T369', 'Fifteen reasons Vincent lied');
INSERT INTO BookingMakesFor VALUES ('292883', '2023-11-12', 'user2@gmail.com', 'T369', 'Escape Arkaham');
INSERT INTO BookingMakesFor VALUES ('292882', '2023-11-13', 'user2@gmail.com', 'T369', 'Leviathan');
INSERT INTO BookingMakesFor VALUES ('292885', '2023-11-04', 'user2@gmail.com', 'Dragon Slayers', 'Leviathan');
INSERT INTO BookingMakesFor VALUES ('292888', '2023-11-08', 'user2@gmail.com', 'T369', 'Leviathan');
INSERT INTO BookingMakesFor VALUES ('292899', '2023-11-04', 'user2@gmail.com', 'The Rebels', 'Leviathan');











SELECT *
FROM PuzzleHas;

SELECT *
FROM ScoreOnPuzzle;

SELECT *
FROM ScoreOnPuzzle
WHERE PuzzleID IN (SELECT PuzzleID FROM PuzzleHas);








