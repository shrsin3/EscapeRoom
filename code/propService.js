const appService = require('./appService');
async function deleteProp(propId) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM PropHave where PropHave.PropID=:propId`,
            [propId],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertProp(propId, name, status, puzzleID) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PropHave(PropID, Name, Status, PuzzleID) VALUES (:propId, :name, :status, :puzzleID)`,
            [propId, name, status, puzzleID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function fetchPropsTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PropHave NATURAL JOIN PuzzleHas ORDER BY PuzzleID ASC');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function updatePropStatus(propId, updatedStatus) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PropHave SET PropHave.Status=:updatedStatus where PropHave.PropID=:propId`,
            [updatedStatus, propId],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {deleteProp,
    insertProp,
    fetchPropsTableFromDb,
    updatePropStatus
}