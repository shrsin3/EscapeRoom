const express = require('express');
const appService = require('./appService');

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

module.exports = router;