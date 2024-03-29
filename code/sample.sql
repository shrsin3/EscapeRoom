CREATE TABLE EscapeRoom (
                            Name varchar(50),
                            Genre varchar(50),
                            TimeLimit integer DEFAULT 60,
                            PRIMARY KEY(Name)
);


CREATE TABLE PuzzleHas(
                          PuzzleID integer,
                          Pname varchar(50),
                          Ename varchar(50) NOT NULL,
                          PRIMARY KEY(PuzzleID),
                          FOREIGN KEY(Ename) REFERENCES EscapeRoom(Name),
                          UNIQUE(PName, EName)
);

CREATE TABLE ScoreOnPuzzle(
                              TeamName varchar(50),
                              Points integer,
                              PuzzleID integer,
                              PRIMARY KEY(TeamName, PuzzleID),
                              FOREIGN KEY(PuzzleID) REFERENCES PuzzleHas  ON DELETE CASCADE
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

CREATE TABLE Users(
                      Name varchar(50),
                      Email varchar(50),
                      Address varchar(50) NOT NULL,
                      PostalCode varchar(50) NOT NULL,
                      PRIMARY KEY(Email),
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

INSERT INTO EscapeRoom VALUES ('The giggling', 'Horor', 75);



SELECT *
FROM PuzzleHas;

SELECT *
FROM ScoreOnPuzzle;

SELECT *
FROM ScoreOnPuzzle
WHERE PuzzleID IN (SELECT PuzzleID FROM PuzzleHas);








