const oracledb = require('oracledb');
const fs = require('fs');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchUserstableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Users');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPositionSalaryFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PositionSalary');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPositionSalaryDropFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Position FROM PositionSalary');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPlayerProfileForViewerFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PlayerPartOf');
        result.rows.forEach(row => {
            row[5] = row[5].toISOString().split('T')[0]
        })

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTeamProfileForViewerFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Team');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchViewerProfile(email) {
    return await withOracleDB(async (connection) => {
        console.log("viewerEmail: ", email)
        const result = await connection.execute(`
            SELECT Users.Name, Users.Email, Users.Address, 
                   Users.PostalCode, PostalCity.City, Viewer.Age
            FROM Users 
            JOIN Viewer ON Users.Email = Viewer.Email
            JOIN PostalCity ON Users.PostalCode = PostalCity.PostalCode
            WHERE Users.Email = :email
        `, [email]);
        console.log(result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchEmployeeProfile(email) {
    return await withOracleDB(async (connection) => {
        console.log("viewerEmail: ", email)
        const result = await connection.execute(`
            SELECT Users.Name, Users.Email, Users.Address, 
                   Users.PostalCode, PostalCity.City, Employee.Position, PositionSalary.Salary
            FROM Users 
            JOIN Employee ON Users.Email = Employee.Email
            JOIN PositionSalary ON Employee.Position = PositionSalary.Position
            JOIN PostalCity ON Users.PostalCode = PostalCity.PostalCode
            WHERE Users.Email = :email
        `, [email]);
        console.log(result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPlayerProfile(email) {
    return await withOracleDB(async (connection) => {
        console.log("PlayerEmail: ", email)
        const result = await connection.execute(`
            SELECT Users.Name, Users.Email, Users.Address, Users.PostalCode, PostalCity.City, PlayerPartOf.Alias, 
                   PlayerPartOf.SkillLevel, PlayerPartOf.PlayingStyle, PlayerPartOf.Name, PlayerPartOf.Since
            FROM Users 
            JOIN PlayerPartOf ON Users.Email = PlayerPartOf.Email
            JOIN PostalCity ON Users.PostalCode = PostalCity.PostalCode
            WHERE Users.Email = :email
        `, [email]);
        result.rows[0][9] = result.rows[0][9].toISOString().split('T')[0]
        console.log(result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchAllTableNamesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT table_name FROM user_tables');
        console.log(result.rows);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTableAttributesFromDb(tableName) {
    return await withOracleDB(async (connection) => {
        console.log("tableName: ", tableName)
        const result = await connection.execute(`
            SELECT column_name 
            FROM user_tab_columns
            WHERE table_name = :tableName
        `, [tableName]);
        console.log(result.rows);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTableTuplesFromDb(tableName, attributes) {
    return await withOracleDB(async (connection) => {
        console.log("Attributes: ", attributes)
        const query = `SELECT ${attributes} FROM ${tableName}`;
        const result = await connection.execute(query);
        console.log(result.rows);
        return result.rows;
    }).catch(() => {
        return []
    })
}

async function loginAsViewer(email, password) {
    return await withOracleDB(async (connection) => {
        console.log('email ', email)
        console.log('password ', password)
        const result = await connection.execute(`
            SELECT COUNT(*)
            FROM Users JOIN Viewer ON Users.Email = Viewer.Email
            WHERE Users.Email = :email AND Users.PassWord = :password
        `,
        [email, password]);

        const count = result.rows[0][0];

        if (count === 1) {
            return {success: true}
        } else {
            return {success: false, message: 'Login failed, username or password incorrect'}
        }
    }).catch(() => {
        return {success: false, message: 'Login failed, interal error'};
    })
}

async function loginAsEmployee(email, password) {
    return await withOracleDB(async (connection) => {
        console.log('email ', email)
        console.log('password ', password)
        const result = await connection.execute(`
            SELECT COUNT(*)
            FROM Users JOIN Employee ON Users.Email = Employee.Email
            WHERE Users.Email = :email AND Users.PassWord = :password
        `,
        [email, password]);

        const count = result.rows[0][0];

        if (count === 1) {
            return {success: true}
        } else {
            return {success: false, message: 'Login failed, username or password incorrect'}
        }
    }).catch(() => {
        return {success: false, message: 'Login failed, interal error'};
    })
}

async function loginAsPlayer(email, password) {
    return await withOracleDB(async (connection) => {
        console.log('email ', email)
        console.log('password ', password)
        const result = await connection.execute(`
            SELECT COUNT(*)
            FROM Users JOIN PlayerPartOf ON Users.Email = PlayerPartOf.Email
            WHERE Users.Email = :email AND Users.PassWord = :password
        `,
        [email, password]);

        const count = result.rows[0][0];

        if (count === 1) {
            return {success: true}
        } else {
            return {success: false, message: 'Login failed, username or password incorrect'}
        }
    }).catch(() => {
        return {success: false, message: 'Login failed, interal error'};
    })
}

async function updatePositionSalary(position, salary, positionName) {
    return await withOracleDB(async (connection) => {
        console.log('position, salary, position name', position, salary, positionName)
        const checkExisted = await connection.execute(`
            SELECT COUNT(*)
            FROM PositionSalary
            WHERE Position = :position
            `,
            [position]
        );
        
        if (checkExisted.rows[0][0] === 0) {
            return {success: false, message: 'Position not found'}
        }

        const checkPositionNameExist = await connection.execute(`
            SELECT COUNT(*)
            FROM PositionSalary
            WHERE PositionName = :positionName AND Position != :position
            `,
            [positionName, position]
        );

        console.log(checkPositionNameExist.rows[0][0]);
        if (checkPositionNameExist.rows[0][0] > 0) {
            return {success: false, message: 'Position name already exists for another position'}
        }

        const result = await connection.execute(`
            UPDATE PositionSalary
            SET Salary = :salary, PositionName = :positionName
            WHERE Position = :position
            `,
            [salary, positionName, position],
            { autoCommit: true }
        );

        if (result.rowsAffected && result.rowsAffected > 0) {
            return {success: true}
        } else {
            return {success: false, message: 'Error updating'}
        }
    }).catch(() => {
        return {success: false, message: 'Error updating'};
    })
}

async function initialization() {
    return await withOracleDB(async (connection) => {
        const sql = fs.readFileSync("sample.sql", 'utf8');
        const statements = sql.split(";").map(statement => statement.trim()).filter(statement => statement);
        console.log(statements);

        for (const statement of statements) {
            console.log(statement)
            try {
                await connection.execute(statement)
            } catch (err) {
                console.error(err);
            }
        }

        await connection.commit();

        return true;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    withOracleDB,
    testOracleConnection,
    fetchPositionSalaryFromDb,
    fetchPositionSalaryDropFromDb,
    fetchPlayerProfileForViewerFromDb,
    fetchTeamProfileForViewerFromDb,
    fetchViewerProfile,
    fetchEmployeeProfile,
    fetchPlayerProfile,
    fetchAllTableNamesFromDb,
    fetchTableAttributesFromDb,
    fetchTableTuplesFromDb,
    loginAsViewer,
    loginAsEmployee,
    loginAsPlayer,
    updatePositionSalary,
    initialization,
    fetchUserstableFromDb
};