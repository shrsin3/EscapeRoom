const express = require('express');
const appService = require('./appService');
const scoreService = require('./scoreService');
const propService = require('./propService');
const puzzleService = require('./puzzleService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/Userstable', async (req, res) => {
    const tableContent = await appService.fetchUserstableFromDb();
    res.json({data: tableContent});
});

router.get('/PositionSalary', async (req, res) => {
    const tableContent = await appService.fetchPositionSalaryFromDb();
    res.json({data: tableContent});
});

router.get('/viewerprofile', async (req, res) => {
    const email = req.query.email;
    const tableContent = await appService.fetchViewerProfile(email);
    res.json({data: tableContent});
})

router.get('/employeeprofile', async (req, res) => {
    const email = req.query.email;
    const tableContent = await appService.fetchEmployeeProfile(email);
    res.json({data: tableContent});
})

router.get('/playerprofile', async (req, res) => {
    const email = req.query.email;
    const tableContent = await appService.fetchPlayerProfile(email);
    res.json({data: tableContent});
})

router.post('/update-salary', async (req, res) => {
    const { position, salary} = req.body;
    const updateResult = await appService.updateSalary(position, salary);

    if (updateResult.success) {
        res.json({ success: true, message: 'Salary updated successfully'});
    } else {
        res.status(500).json({ success: false, message: result.message});
    }
});

router.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;
    var isLoggedin = false

    if (userType === 'Viewer') {
        isLoggedin = await appService.loginAsViewer(email, password);
    } else if (userType === 'Employee') {
        isLoggedin = await appService.loginAsEmployee(email, password);
    } else if (userType === 'Player') {
        isLoggedin = await appService.loginAsPlayer(email, password);
    }

    if(isLoggedin) {
        res.json({ success: true, userType: userType });
    } else {
        res.status(500).json({ success: false })
    }
});

router.post("/initialization", async (req, res) => {
    const initiateResult = await appService.initialization();

    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/puzzleTable', async (req, res) => {
    const tableContent = await puzzleService.fetchPuzzleTableFromDb();
    res.json({data: tableContent});
});

router.post("/insert-puzzleHas", async (req, res) => {
    const { id, pName, eName, pDiff } = req.body;
    const isPnameThere = await puzzleService.checkPnameInPuzzle(pName);
    if(isPnameThere.length === 0){
        const insertResult = await puzzleService.insertPuzzle(id, pName, eName, pDiff);
        if (insertResult) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    } else {
        if(isPnameThere[0][1] === parseInt(pDiff, 10)){
            console.log("Puzzle Diffi Matched")
            const insertResult = await puzzleService.insertOnlyPuzzle(id, pName, eName);
            if (insertResult) {
                res.json({ success: true });
            } else {
                res.status(500).json({ success: false });
            }
        } else {
            res.status(500).json({ success: false });
        }
    }
});

router.post("/insert-score", async (req, res) => {
    const { teamName, points, pId } = req.body;
    const isPuzzleThere = await puzzleService.checkPidInPuzzle(pId);
    if(isPuzzleThere.length === 0){
        res.status(500).json({ success: false });
    } else {
        const insertResult = await scoreService.insertScore(teamName, points, pId);
        if (insertResult) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
});

router.get('/scoreTable', async (req, res) => {
    const tableContent = await scoreService.fetchScoreTableFromDb();
    res.json({data: tableContent});
});

router.post("/insert-prop", async (req, res) => {
    const { propId, name, status, puzzleID } = req.body;
    const isPuzzleThere = await puzzleService.checkPidInPuzzle(puzzleID);
    if(isPuzzleThere.length === 0){
        res.status(500).json({ success: false });
    } else {
        const insertResult = await propService.insertProp(propId, name, status, puzzleID);
        if (insertResult) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false });
        }
    }
});

router.get('/propTable', async (req, res) => {
    const tableContent = await propService.fetchPropsTableFromDb();
    res.json({data: tableContent});
});

router.post('/updatePropStatus', async (req, res) => {
    const { propId, updatedStatus } = req.body;
    const updateResult = await propService.updatePropStatus(parseInt(propId, 10), updatedStatus);
    console.log(updateResult)
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete('/deleteProp', async (req, res) => {
    const { propId } = req.body;
    let propIdInt;
    try {
        propIdInt = parseInt(propId)
    } catch (e){
        res.status(500).json({ success: false });
        return ;
    }
    const deleteResult = await propService.deleteProp(propIdInt);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete('/deletePuzzle', async (req, res) => {
    const { pId } = req.body;
    let pIdInt;
    try{
        pIdInt = parseInt(pId)
    }catch(e){
        res.status(500).json({ success: false });
        return ;
    }
    const deleteResult = await puzzleService.deletePuzzle(pIdInt);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/teamNMaxScore', async (req, res) => {
    const tableContent = await scoreService.fetchTeamNMaxScoreTableFromDb();
    res.json({data: tableContent});
});

router.get('/teamNMinScore', async (req, res) => {
    const tableContent = await scoreService.fetchTeamNMinScoreTableFromDb();
    res.json({data: tableContent});
});

router.get('/teamNAvgScore', async (req, res) => {
    const tableContent = await scoreService.fetchTeamNAvgScoreTableFromDb();
    res.json({data: tableContent});
});


module.exports = router;