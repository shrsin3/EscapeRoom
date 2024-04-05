DROP TABLE ScoreOnPuzzle CASCADE CONSTRAINTS;
DROP TABLE Fix CASCADE CONSTRAINTS;
DROP TABLE PropHave CASCADE CONSTRAINTS;
DROP TABLE Adjust CASCADE CONSTRAINTS;
DROP TABLE PuzzleHas CASCADE CONSTRAINTS;
DROP TABLE BookingMakesFor CASCADE CONSTRAINTS;
DROP TABLE EscapeRoom CASCADE CONSTRAINTS;
DROP TABLE Users CASCADE CONSTRAINTS;
DROP TABLE PlayerPartOf CASCADE CONSTRAINTS;
DROP TABLE Team CASCADE CONSTRAINTS;
DROP TABLE PuzzleDifficulty CASCADE CONSTRAINTS;
DROP TABLE Employee CASCADE CONSTRAINTS;
DROP TABLE Viewer CASCADE CONSTRAINTS;
DROP TABLE PostalCity CASCADE CONSTRAINTS;
DROP TABLE PositionSalary CASCADE CONSTRAINTS;
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
CREATE TABLE PostalCity (
                        PostalCode VARCHAR2(100) PRIMARY KEY, 
                        City VARCHAR2(100) NOT NULL
);
CREATE TABLE Employee (
                        Email VARCHAR2(100) PRIMARY KEY, 
                        Position INTEGER NOT NULL,
                        FOREIGN KEY (Email) REFERENCES Users(Email) ON DELETE CASCADE
);
CREATE TABLE PositionSalary (
                        Position INTEGER PRIMARY KEY,
                        PositionName VARCHAR2(100) NOT NULL UNIQUE,
                        Salary INTEGER NOT NULL
);          
CREATE TABLE Viewer (
                        Email VARCHAR2(100) PRIMARY KEY, 
                        Age INTEGER NOT NULL,
                        FOREIGN KEY (Email) REFERENCES Users(Email) ON DELETE CASCADE
);
CREATE TABLE PlayerPartOf (
                        Email VARCHAR2(100) PRIMARY KEY, 
                        Alias VARCHAR2(100) NOT NULL UNIQUE,
                        SkillLevel INTEGER DEFAULT 1,
                        PlayingStyle VARCHAR2(100),
                        Name VARCHAR2(100) NOT NULL,
                        Since DATE,
                        FOREIGN KEY (Email) REFERENCES Users(Email) ON DELETE CASCADE,
                        FOREIGN KEY (Name) REFERENCES Team(Name)
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
INSERT INTO Team VALUES ('The Young Blood', 2);
INSERT INTO Team VALUES ('The New Members', 2);
INSERT INTO Team VALUES ('Item Finder', 6);
INSERT INTO PuzzleHas VALUES (1, 'Room lock', 'Marys Wonderland');
INSERT INTO PuzzleHas VALUES (2, 'Shelf lock', 'Fifteen reasons Vincent lied');
INSERT INTO PuzzleHas VALUES (3, 'Room lock', 'Fifteen reasons Vincent lied');
INSERT INTO PuzzleHas VALUES (4, 'Statue rotation', 'Escape Arkaham');
INSERT INTO PuzzleHas VALUES (5, 'Room lock', 'Leviathan');
INSERT INTO PuzzleHas VALUES (6, 'Room lock', 'The giggling');
INSERT INTO PuzzleHas VALUES (7, 'Shelf lock', 'The giggling');
INSERT INTO PuzzleHas VALUES (8, 'Treasure Puzzle', 'Escape Arkaham');
INSERT INTO PuzzleHas VALUES (9, 'Guess the Word', 'Leviathan');
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
INSERT INTO ScoreOnPuzzle VALUES ('The Young Blood', 100, 4);
INSERT INTO ScoreOnPuzzle VALUES ('The New Members', 99, 5);
INSERT INTO ScoreOnPuzzle VALUES ('The New Members', 90, 6);
INSERT INTO ScoreOnPuzzle VALUES ('The New Members', 100, 3);
INSERT INTO PuzzleDifficulty VALUES ('Room lock', 4);
INSERT INTO PuzzleDifficulty VALUES ('Shelf lock', 3);
INSERT INTO PuzzleDifficulty VALUES ('Statue rotation', 5);
INSERT INTO PuzzleDifficulty VALUES ('Treasure Puzzle', 2);
INSERT INTO PuzzleDifficulty VALUES ('Guess the Word', 1);
INSERT INTO PropHave VALUES (1, 'Lock', 'Intact', 1);
INSERT INTO PropHave VALUES (2, 'Statue', 'Damaged', 4);
INSERT INTO PropHave VALUES (3, 'Television Screen', 'Intact', 9);
INSERT INTO PropHave VALUES (4, 'Books', 'Damaged', 2);
INSERT INTO PropHave VALUES (5, 'Key', 'Intact', 6);
INSERT INTO Users VALUES ('User1', 'user1@gmail.com', '1000 Bridgeport Rd', 'V6V A03', 'gsoBlRHvRHJ3e8Y');
INSERT INTO Users VALUES ('User2', 'user2@gmail.com', '435 Cambie St', 'F8S 4G3', 'ItqHYXMBATzEHqF');
INSERT INTO Users VALUES ('User3', 'user3@gmail.com', '4090 Wrangler Rd', 'T1X 0K2', 'RN61tTRk5aQFglt');
INSERT INTO Users VALUES ('User4', 'user4@gmail.com', '21 Brentwood Blvd', 'V6S 3B8', 'WtENtlwQJgGCjdy');
INSERT INTO Users VALUES ('User5', 'user5@gmail.com', '78 Hanson St', 'M4C 1A1', 'b4Qv04Xg400ORPZ');
INSERT INTO PostalCity VALUES ('V6V A03', 'Vancouver');
INSERT INTO PostalCity VALUES ('F8S 4G3', 'Calgary');
INSERT INTO PostalCity VALUES ('T1X 0K2', 'Edmonton');
INSERT INTO PostalCity VALUES ('V6S 3B8', 'Toronto');
INSERT INTO PostalCity VALUES ('M4C 1A1', 'Richmond');
INSERT INTO Employee VALUES ('user1@gmail.com', 1);
INSERT INTO Employee VALUES ('user2@gmail.com', 2);
INSERT INTO Employee VALUES ('user3@gmail.com', 3);
INSERT INTO Employee VALUES ('user4@gmail.com', 4);
INSERT INTO PositionSalary VALUES (1, 'Company manager', 90000);
INSERT INTO PositionSalary VALUES (2, 'Front-desk', 50000);
INSERT INTO PositionSalary VALUES (3, 'Prop manager', 70000);
INSERT INTO PositionSalary VALUES (4, 'Puzzle manager', 70000);
INSERT INTO Viewer VALUES ('user1@gmail.com', 25);
INSERT INTO Viewer VALUES ('user2@gmail.com', 33);
INSERT INTO PlayerPartOf VALUES ('user1@gmail.com', 'Cool', 5, 'Fast', 'Item Finder', TO_DATE('2022-09-03', 'yyyy/mm/dd'));
INSERT INTO PlayerPartOf VALUES ('user5@gmail.com', 'Sophine', 3, 'Careful', 'Let us cook', TO_DATE('2023-10-06', 'yyyy/mm/dd'));
INSERT INTO Fix VALUES ('user3@gmail.com', 1);
INSERT INTO Fix VALUES ('user3@gmail.com', 2);
INSERT INTO Fix VALUES ('user3@gmail.com', 3);
INSERT INTO Fix VALUES ('user3@gmail.com', 4);
INSERT INTO Fix VALUES ('user3@gmail.com', 5);
INSERT INTO Adjust VALUES ('user4@gmail.com', 1);
INSERT INTO Adjust VALUES ('user4@gmail.com', 2);
INSERT INTO Adjust VALUES ('user4@gmail.com', 3);
INSERT INTO Adjust VALUES ('user4@gmail.com', 4);
INSERT INTO Adjust VALUES ('user4@gmail.com', 5);
INSERT INTO Adjust VALUES ('user4@gmail.com', 6);
INSERT INTO Adjust VALUES ('user4@gmail.com', 7);
INSERT INTO Adjust VALUES ('user4@gmail.com', 8);
INSERT INTO Adjust VALUES ('user4@gmail.com', 9);
INSERT INTO BookingMakesFor VALUES (292872, TO_DATE('2023-11-08', 'yyyy/mm/dd'), 'user1@gmail.com', 'SEN', 'Marys Wonderland');
INSERT INTO BookingMakesFor VALUES (292875, TO_DATE('2023-11-09', 'yyyy/mm/dd'), 'user2@gmail.com', 'SEN', 'The giggling');
INSERT INTO BookingMakesFor VALUES (292876, TO_DATE('2023-11-11', 'yyyy/mm/dd'), 'user2@gmail.com', 'SEN', 'Fifteen reasons Vincent lied');
INSERT INTO BookingMakesFor VALUES (292877, TO_DATE('2023-11-13', 'yyyy/mm/dd'), 'user2@gmail.com', 'SEN', 'Escape Arkaham');
INSERT INTO BookingMakesFor VALUES (292878, TO_DATE('2023-11-18', 'yyyy/mm/dd'), 'user2@gmail.com', 'SEN', 'Leviathan');
INSERT INTO BookingMakesFor VALUES (292879, TO_DATE('2023-11-21', 'yyyy/mm/dd'), 'user1@gmail.com', 'T369', 'Marys Wonderland');
INSERT INTO BookingMakesFor VALUES (292880, TO_DATE('2023-09-01', 'yyyy/mm/dd'), 'user2@gmail.com', 'T369', 'The giggling');
INSERT INTO BookingMakesFor VALUES (292881, TO_DATE('2023-11-11', 'yyyy/mm/dd'), 'user2@gmail.com', 'T369', 'Fifteen reasons Vincent lied');
INSERT INTO BookingMakesFor VALUES (292883, TO_DATE('2023-11-12', 'yyyy/mm/dd'), 'user2@gmail.com', 'T369', 'Escape Arkaham');
INSERT INTO BookingMakesFor VALUES (292882, TO_DATE('2023-11-13', 'yyyy/mm/dd'), 'user2@gmail.com', 'T369', 'Leviathan');
INSERT INTO BookingMakesFor VALUES (292885, TO_DATE('2023-11-04', 'yyyy/mm/dd'), 'user2@gmail.com', 'Dragon Slayers', 'Leviathan');
INSERT INTO BookingMakesFor VALUES (292888, TO_DATE('2023-11-08', 'yyyy/mm/dd'), 'user2@gmail.com', 'T369', 'Leviathan');
INSERT INTO BookingMakesFor VALUES (292899, TO_DATE('2023-11-04', 'yyyy/mm/dd'), 'user2@gmail.com', 'The Rebels', 'Leviathan');