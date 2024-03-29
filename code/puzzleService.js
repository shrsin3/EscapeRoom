const appService = require('./appService');

async function fetchPuzzleTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PuzzleHas NATURAL JOIN PuzzleDifficulty ORDER BY PuzzleID ASC');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function checkPnameInPuzzle(pName) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT pd.Pname, pd.Difficulty FROM PuzzleDifficulty pd WHERE pd.Pname = (:pName)', [pName]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertPuzzle(id,pName, eName, pDiff) {
    return await appService.withOracleDB(async (connection) => {
        // console.log(pName)
        const result = await connection.execute(
            `INSERT INTO PuzzleHas (PuzzleID, Pname, Ename) VALUES (:id, :pName, :eName)`,
            [id, pName, eName],
            { autoCommit: true }
        );
        const result2 = await connection.execute(
            `INSERT INTO PuzzleDifficulty (Pname, Difficulty) VALUES (:pName, :pDiff)`,
            [pName, pDiff],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0 && result2.rowsAffected && result2.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertOnlyPuzzle(id, pName, eName) {
    return await appService.withOracleDB(async (connection) => {
        // console.log(pName)
        const result = await connection.execute(
            `INSERT INTO PuzzleHas (PuzzleID, Pname, Ename) VALUES (:id, :pName, :eName)`,
            [id, pName, eName],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function checkPidInPuzzle(pId) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT pd.PuzzleID FROM PuzzleHas pd WHERE pd.PuzzleID = (:pId)', [pId]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}
async function deletePuzzle(pId) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM PuzzleHas where PuzzleHas.PuzzleID=:pId`,
            [pId],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {fetchPuzzleTableFromDb,
    checkPnameInPuzzle,
    insertPuzzle,
    insertOnlyPuzzle,
    checkPidInPuzzle,
    deletePuzzle}