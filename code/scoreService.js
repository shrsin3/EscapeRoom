const appService = require('./appService');

async function insertScore(teamName, points, pId) {
    return await appService.withOracleDB(async (connection) => {
        if(points > 100 || points < 1){
            return false;
        }
        const result = await connection.execute(
            `INSERT INTO ScoreOnPuzzle(TeamName, Points, PuzzleID) VALUES (:teamName, :points, :pId)`,
            [teamName, points, pId],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function fetchScoreTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ScoreOnPuzzle');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTeamNMaxScoreTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT TeamName, MAX(Points) FROM ScoreOnPuzzle GROUP BY TeamName');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTeamNMinScoreTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT TeamName, MIN(Points) FROM ScoreOnPuzzle GROUP BY TeamName');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTeamNAvgScoreTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT TeamName, AVG(Points) FROM ScoreOnPuzzle GROUP BY TeamName');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTeamNamesDivisionQuery() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Team.Name FROM Team
                                                 WHERE NOT EXISTS((SELECT EscapeRoom.Name FROM EscapeRoom)
                                                     MINUS(SELECT BookingMakesFor.RoomName FROM BookingMakesFor
                                                     WHERE BookingMakesFor.TeamName = Team.Name))`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}
// Find the teams with leading scores
async function fetchLeadingTeamNames() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT s.TeamName FROM ScoreOnPuzzle s
                                                 GROUP BY s.TeamName
                                                 HAVING AVG(s.Points) >= ALL(SELECT AVG(s1.Points) FROM ScoreOnPuzzle s1
                                                                            GROUP BY s1.TeamName
                                                                             HAVING COUNT(*) >= 2) AND 
                                                s.TeamName IN (SELECT s2.TeamName FROM ScoreOnPuzzle s2
                                                               GROUP BY s2.TeamName
                                                               HAVING COUNT(*) >= 2)`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

module.exports = {
    insertScore,
    fetchScoreTableFromDb,
    fetchTeamNMinScoreTableFromDb,
    fetchTeamNMaxScoreTableFromDb,
    fetchTeamNAvgScoreTableFromDb,
    fetchTeamNamesDivisionQuery,
    fetchLeadingTeamNames
}