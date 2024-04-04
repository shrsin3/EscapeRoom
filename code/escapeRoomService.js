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


async function fetchHighRatingList(scoreGreater){
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT DISTINCT RoomName, AVG(Score)
                                                FROM RatingGivenToAssigns
                                                GROUP BY RoomName
                                                HAVING AVG(Score) >= :scoreGreater`, [scoreGreater]
                                    );
    //    console.log("service:", result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function insertNewComment(ID, RoomName, Score, RateComment){
    return await appService.withOracleDB(async (connection) => {
        const checkRoomExist = await connection.execute(`
                SELECT COUNT(*)
                FROM EscapeRoom
                WHERE Name = :RoomName
            `, [RoomName]
        )

        if (checkRoomExist.rows[0][0] === 0) {
            return {success: false, message: 'Room not found'}
        }

        const result = await connection.execute(
            `INSERT INTO RatingGivenToAssigns (ID, RoomName, Score, RateComment) VALUES (:ID, :RoomName, :Score, :RateComment)`,
            [ID, RoomName, Score, RateComment],
            { autoCommit: true }
        );
        if(result.rowsAffected && result.rowsAffected > 0) {
            return {success: true, message: ''}
        } else {
            return {success: false, message: 'Insert failed'}
        }
    }).catch(() => {
        return {success: false, message: 'Insert failed'}
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

async function searchForTeam(userEmail){
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT NAME FROM PlayerPartOf WHERE Email = :userEmail`, [userEmail]);
        return result.rows;
    }).catch(() => {
        return [];
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

async function reservationSelection(time, room, sign, email, withDate){
    if(withDate === "true" && room.length > 0){
        if(sign === "orQuery"){
            return await appService.withOracleDB(async (connection) => {
                const result = await connection.execute(`SELECT * 
                FROM BookingMakesFor 
                WHERE (DateBookingAdded = TO_DATE(:time,'YYYY-MM-DD') OR RoomName =:room) AND UserEmail =:email`, [time, room, email]);
                return result.rows;
            }).catch(() => {
                return [];
            });
        }
        else if(sign === "andQuery"){
            return await appService.withOracleDB(async (connection) => {
                const result = await connection.execute(`SELECT * 
                FROM BookingMakesFor 
                WHERE (DateBookingAdded = TO_DATE(:time,'YYYY-MM-DD') AND RoomName =:room) AND UserEmail =:email`, [time, room, email]);
                return result.rows;
            }).catch(() => {
                return [];
            });
        }
        else{
            console.log('Error reading and/or');
            return ;
        }
    }

    if(withDate === "true" && room.length <= 0){
        return await appService.withOracleDB(async (connection) => {
            const result = await connection.execute(`SELECT * 
                FROM BookingMakesFor 
                WHERE (DateBookingAdded =TO_DATE(:time,'YYYY-MM-DD') AND UserEmail =:email)`, [time, email]);
            return result.rows;
        }).catch(() => {
            return [];
        });
    }

    if(withDate === "false" && room.length > 0){
        return await appService.withOracleDB(async (connection) => {
            const result = await connection.execute(`SELECT * 
                FROM BookingMakesFor 
                WHERE (RoomName =:room AND UserEmail =:email)`, [room, email]);
            return result.rows;
        }).catch(() => {
            return [];
        });
    }
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
    initiateAllTables,
    reservationSelection,
    searchForTeam
};