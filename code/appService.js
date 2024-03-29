const oracledb = require('oracledb');
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
        const result = await connection.execute('SELECT Position FROM PositionSalary');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchViewerProfile(email) {
    return await withOracleDB(async (connection) => {
        console.log("viewerEmail: ", email)
        const result = await connection.execute(`
        SELECT Users.*, Viewer.Age, PostalCity.City
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
        SELECT Users.*, Employee.Position, PositionSalary.Salary, PostalCity.City
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
        SELECT Users.*, PlayerPartOf.*, PostalCity.City
        FROM Users 
        JOIN PlayerPartOf ON Users.Email = PlayerPartOf.Email
        JOIN PostalCity ON Users.PostalCode = PostalCity.PostalCode
        WHERE Users.Email = :email
        `, [email]);
        result.rows[0][10] = result.rows[0][10].toISOString().split('T')[0]
        console.log(result.rows)
        return result.rows;
    }).catch(() => {
        return [];
    });
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

        return count === 1;
    }).catch(() => {
        return false;
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

        return count === 1;
    }).catch(() => {
        return false;
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

        return count === 1;
    }).catch(() => {
        return false;
    })
}

async function updateSalary(position, salary) {
    return await withOracleDB(async (connection) => {
        console.log('position, salary', position, salary)
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

        const result = await connection.execute(`
            UPDATE PositionSalary
            SET Salary = :salary
            WHERE Position = :position
            `,
            [salary, position],
            { autoCommit: true }
        );

        if (result.rowsAffected && result.rowsAffected > 0) {
            return {success: true}
        } else {
            return {success: false, message: 'Error updating salary'}
        }
    }).catch(() => {
        return false;
    })
}

async function initialization() {
    return await withOracleDB(async (connection) => {
        const tables = ['Users', 'PostalCity', 'Employee', 'PositionSalary', 'Viewer', 'PlayerPartOf', 'Team'];
        for (const table of tables) {
            try {
                await connection.execute(`DROP TABLE ${table} CASCADE CONSTRAINTS`);
            } catch(err) {
                console.log(`${table} might not exist, proceeding to create...`);
            }
        }

        await connection.execute(`
            CREATE TABLE Users (
                Name VARCHAR2(100), 
                Email VARCHAR2(100) PRIMARY KEY, 
                Address VARCHAR2(100) NOT NULL, 
                PostalCode VARCHAR2(100) NOT NULL,
                PassWord VARCHAR2(100) NOT NULL,
                UNIQUE(Address, PostalCode)
            )       
        `);
        
        await connection.execute(`
            CREATE TABLE PostalCity (
                PostalCode VARCHAR2(100) PRIMARY KEY, 
                City VARCHAR2(100) NOT NULL
            )            
        `);

        await connection.execute(`
            CREATE TABLE Employee (
                Email VARCHAR2(100) PRIMARY KEY, 
                Position VARCHAR2(100) NOT NULL,
                FOREIGN KEY (Email) REFERENCES Users(Email) ON DELETE CASCADE
            )            
        `);

        await connection.execute(`
            CREATE TABLE PositionSalary (
                Position VARCHAR2(100) PRIMARY KEY, 
                Salary INTEGER NOT NULL
            )            
        `);

        await connection.execute(`
            CREATE TABLE Viewer (
                Email VARCHAR2(100) PRIMARY KEY, 
                Age INTEGER NOT NULL,
                FOREIGN KEY (Email) REFERENCES Users(Email) ON DELETE CASCADE
            )           
        `);

        await connection.execute(`
            CREATE TABLE Team (
                Name VARCHAR2(100) PRIMARY KEY,
                TeamCapacity INTEGER DEFAULT 10
            )
        `);
        
        await connection.execute(`
            CREATE TABLE PlayerPartOf (
                Email VARCHAR2(100) PRIMARY KEY, 
                Alias VARCHAR2(100) NOT NULL UNIQUE,
                SkillLevel INTEGER DEFAULT 1,
                PlayingStyle VARCHAR2(100),
                Name VARCHAR2(100) NOT NULL,
                Since DATE,
                FOREIGN KEY (Email) REFERENCES Users(Email) ON DELETE CASCADE,
                FOREIGN KEY (Name) REFERENCES Team(Name)
            )
        `);

        // Insert data
        await connection.execute(`
            INSERT INTO Users (Name, Email, Address, PostalCode, PassWord) VALUES ('User1', 'user1@gmail.com', '1000 Bridgeport Rd', 'V6V A03', '123')
        `);

        await connection.execute(`
        INSERT INTO Users (Name, Email, Address, PostalCode, PassWord) VALUES ('User2', 'user2@gmail.com', '435 Cambie St', 'F8S 4G3', '123')
    `);

        await connection.execute(`
            INSERT INTO PostalCity (PostalCode, City) VALUES ('V6V A03', 'Vancouver')
        `);

        await connection.execute(`
            INSERT INTO PostalCity (PostalCode, City) VALUES ('F8S 4G3', 'Calgary')
        `);

        await connection.execute(`
            INSERT INTO Employee (Email, Position) VALUES ('user1@gmail.com', 'Manager')
        `);

        await connection.execute(`
            INSERT INTO PositionSalary (Position, Salary) VALUES ('Manager', 70000)
        `);

        await connection.execute(`
            INSERT INTO Viewer (Email, Age) VALUES ('user1@gmail.com', 25)
        `);

        await connection.execute(`
            INSERT INTO Viewer (Email, Age) VALUES ('user2@gmail.com', 33)
        `);

        await connection.execute(`
            INSERT INTO Team (Name, TeamCapacity) VALUES ('Item Finder', 6)
        `)

        await connection.execute(`
            INSERT INTO PlayerPartOf (Email, Alias, SkillLevel, PlayingStyle, Name, Since) VALUES ('user1@gmail.com', 'U1', 5, 'Fast', 'Item Finder', TO_DATE('2022-09-03', 'yyyy/mm/dd'))
        `)

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
    fetchViewerProfile,
    fetchEmployeeProfile,
    fetchPlayerProfile,
    loginAsViewer,
    loginAsEmployee,
    loginAsPlayer,
    updateSalary,
    initialization,
    fetchUserstableFromDb
};