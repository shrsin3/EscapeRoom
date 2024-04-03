const appService = require('./appService');

async function fetchEscapeRoomTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM EscapeRoom');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchEscapeRoomList() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT name FROM EscapeRoom');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertNewEscapeRoom(name, genre, timeLimit) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO EscapeRoom (name, genre, timeLimit) VALUES (:name, :genre, :timeLimit)`,
            [name, genre, timeLimit],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function fetchHighRatingList(){
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT DINSTINCT e.name, r.score ' +
            '                                   FROM EscapeRoom e, Rating r ' +
            '                                   WHERE e.name = r.room' +
            '                                   GROUP BY e.name' +
            '                                   HAVING AVG(r.score) >= 4');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertNewComment(ID, RoomName, Score, RateComment){
    console.log(RoomName);
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO RatingGivenToAssigns (ID, RoomName, Score, RateComment) VALUES (:ID, :RoomName, :Score, :RateComment)`,
            [ID, RoomName, Score, RateComment],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function fetchRatingList(){
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM RatingGivenToAssigns');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertReservation(ID, DateAdded, UserEmail, TeamName, RoomName){
    console.log(DateAdded);
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO BookingMakesFor (BookingID, DateBookingAdded, UserEmail, TeamName, RoomName) VALUES (:BookingID, TO_DATE(:DateBookingAdded,'YYYY-MM-DD'), :UserEmail, :TeamName, :RoomName)`,
            [ID, DateAdded, UserEmail, TeamName, RoomName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function initiateAllTables(){
    return await appService.withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE RatingGivenToAssigns CASCADE CONSTRAINTS`);
            console.log('Table dropped. ');
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        try {
            await connection.execute(`DROP TABLE BookingMakesFor CASCADE CONSTRAINTS`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        try {
            await connection.execute(`DROP TABLE EscapeRoom CASCADE CONSTRAINTS`);
            console.log('Table dropped. ');
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        result = await connection.execute(`
                CREATE TABLE EscapeRoom (
                                            Name varchar2(100),
                                            Genre varchar2(100),
                                            timeLimit integer DEFAULT 60,
                                            PRIMARY KEY(Name)
                )
            `);

        result = await connection.execute(`
            CREATE TABLE RatingGivenToAssigns (
                                                ID integer PRIMARY KEY,
                                                RoomName varchar2(100) NOT NULL,
                                                Score integer NOT NULL, 
                                                RateComment varchar2(1000), 
                                                FOREIGN KEY(RoomName) references EscapeRoom(Name)
            )
        `);

        result = await connection.execute(`
                CREATE TABLE BookingMakesFor (
                                                BookingID integer PRIMARY KEY,
                                                DateBookingAdded DATE NOT NULL,
                                                UserEmail varchar2(100) NOT NULL,
                                                TeamName varchar2(100),
                                                RoomName varchar2(100) NOT NULL,
                                                FOREIGN KEY(RoomName) references EscapeRoom(Name)
                )
            `);
            return true;
        }).catch(() => {
            return false;
        });
}


async function fetchReservationList(){
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM BookingMakesFor');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

module.exports = {
    insertNewEscapeRoom,
    fetchEscapeRoomTable,
    insertReservation,
    fetchRatingList,
    insertNewComment,
    fetchHighRatingList,
    fetchEscapeRoomList,
    fetchReservationList,
    initiateAllTables
};