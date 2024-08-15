const {TOKEN_SECRET_KEY} = require('../Env.js');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const db = require("../config/db.js");
const multer = require('multer');

exports.loginUser = async (req, res) => {
  console.log('Entered Backend Login')

  try {
    const { username,password } = req.body;
    const sql = `SELECT * from ADMIN WHERE USERNAME = :username AND PASSWORD_ = :password`;

    // Execute the SQL statement
    const connection = await db.getConnection();
    const result = await connection.execute(sql, [username, password]);

    if (result.rows.length == 0) {
      return res.status(400).send({ error: 'Invalid User' });
    }

    const token = jwt.sign({ username }, TOKEN_SECRET_KEY, { expiresIn: '1h' });
    console.log("token----",token);

    return res.status(201).send({
      token,
      message: 'Success',
    })
  }
  catch (error) {
    res.status(500).send({ error: error.message })
  }
}


exports.dashboardLoanDetails = async (req, res) => {
  // Data

  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sql = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sql, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
 
    
    const sqls = `
    SELECT
    TO_CHAR(DISBURSEMENT_DATE, 'Month') AS month,
    COUNT(*) AS count
    FROM
        LOAN
    GROUP BY
        TO_CHAR(DISBURSEMENT_DATE, 'Month')
    ORDER BY
        TO_DATE(TO_CHAR(DISBURSEMENT_DATE, 'Month'), 'Month')
    `;

    // Execute the SQL statement
    const results = await connection.execute(sqls);
    const loanDataForLC = results.rows.map(row => ({
      month: row.MONTH,
      count: row.COUNT
    }));

    res.json(loanDataForLC);

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message }); 
  }

}

exports.dashboardComplaintDetails = async (req, res) => {

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sql = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sql, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sqls = `
    SELECT
    TO_CHAR(DATE_, 'Month') AS complaint_month,
    COUNT(*) AS complaint_count
    FROM
        COMPLAINT
    GROUP BY
        TO_CHAR(DATE_, 'Month')
    ORDER BY
        TO_DATE(TO_CHAR(DATE_, 'Month'), 'Month')
    `;
    
    const results = await connection.execute(sqls);
    console.log('results---', results)
    const complaintsDataForLC = results.rows.map(row => ({
      month: row.COMPLAINT_MONTH,
      count: row.COMPLAINT_COUNT
    }));

    res.json(complaintsDataForLC);

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message }); 
  }
}



exports.LoanRequestAreas = async (req, res) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sql = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sql, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sqls = `SELECT AREA_NAME FROM AREA`;

    const results = await connection.execute(sqls);

    const areas = results.rows.map(row => ({
      area: row.AREA_NAME
    }));
    console.log('areas---', areas)
    res.json(areas);

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message }); 
  }
}

exports.LoanRequestBranches = async (req, res) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sql = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sql, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const sqls = `SELECT BRANCH_NAME FROM LOAN`;

    const results = await connection.execute(sqls);

    const branches = results.rows.map(row => ({
      branch: row.BRANCH_NAME
    }));
    console.log('branches---', branches)
    res.json(branches);

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message }); 
  }
}

exports.LoanRequests = async (req, res) => {

  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sql = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sql, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sqls = `SELECT 
      C.CLIENT_NAME,
      C.CELL,
      C.CNIC,
      C.ACTIVE_FLAG,
      LR.DATE_,
      LR.AMT_REQUESTED,
      LR.STATUS,
      A.AREA_NAME,   
      B.BRANCH_NAME  
  FROM 
      CLIENT C
  JOIN 
      LOAN_REQUEST LR
  ON 
      C.ID = LR.CLIENT_ID
  JOIN 
      AREA A
  ON 
      C.AREA_ID = A.ID
  JOIN 
      BRANCH B
  ON 
      C.BRANCH_ID = B.ID
    `;

    const results = await connection.execute(sqls);

    // Helper function to format date as "DD Month YYYY"
    const formatDateWithoutTime = (date) => {
      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options); // Use 'en-US' to format as "12 March 2024"
    };

    console.log('loanRequests results---', results)

    const loanRequests = results.rows.map((row, index) => ({
      id: index + 1, // Incremental ID starting from 1
      name: row.CLIENT_NAME,
      amountRequested: `${row.AMT_REQUESTED} PKR`,
      date: formatDateWithoutTime(row.DATE_),
      status: row.STATUS,
      area: row.AREA_NAME,
      branch: row.BRANCH_NAME,
      clientInfo: {
        name: row.CLIENT_NAME,
        cnic: row.CNIC,
        cellNumber: row.CELL,
        activeStatus: row.ACTIVE_FLAG === 1 ? "Yes" : "No"
      }
    }));
    console.log('loanRequests---', loanRequests)
    res.json(loanRequests);

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });     
  }
}

exports.getPromotions = async (req, res) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sql = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sql, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sqls = `SELECT
    a.AREA_NAME AS AREA_NAME,
    pm.DATE_ AS PROMOTION_DATE,
    pm.MESSAGE_TEXT AS promotional_text, pm.IMG_PATH AS img_path
    FROM
        PROMOTIONAL_MSG pm
    JOIN
        PROMOTIONAL_MSG_AREA pma ON pm.ID = pma.ID
    JOIN
        AREA a ON pma.AREA_ID = a.ID
    `;

    const results = await connection.execute(sqls);

    const formatDateWithoutTime = (date) => {
      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options); // Use 'en-US' to format as "12 March 2024"
    };

    const promotions = results.rows.map((row,index) => ({
      id: index + 1,
      area: row.AREA_NAME,
      sentDate: formatDateWithoutTime(row.PROMOTION_DATE),
      info: {
        promoText: row.PROMOTIONAL_TEXT,
        promoImg: row.IMG_PATH
      }
    }));
    console.log(promotions);
    res.json(promotions);

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message }); 
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  }
});

const upload = multer({ storage: storage });

exports.addNewPromotion = [upload.single('image'), async (req, res) => {   
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sqls = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sqls, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { text } = req.body;
    const imagePath = req.file ? req.file.path : null; // Get the image path from multer

    const { username } = req.body;
    const {name} = req.body;
    const sql1 = `SELECT * from ADMIN WHERE USERNAME=` + username;
    const query = `SELECT * from AREA WHERE NAME=` + name;

  
    const result1 = await connection.execute(sql1);
    const resultQuery = await connection.execute(query);

    const adminId = result1.rows[0].ID;
    const areaId = resultQuery.rows[0].ID;
    const currentDate = new Date();

    if (!text || !imagePath) {
      return res.status(400).send({ message: 'Text and image are required' });
    }

    const bindVars = {
      adminId: { val: adminId, type: oracledb.NUMBER },
      text: { val: text, type: oracledb.STRING },
      imagePath: { val: imagePath, type: oracledb.STRING },
      currentDate: { val: currentDate, type: oracledb.DATE },
      flag: { val: 1, type: oracledb.NUMBER }
    };

    const sql = `INSERT INTO PROMOTIONAL_MSG (ADMIN_ID, MESSAGE_TEXT, IMG_PATH, DATE_, ACTIVE_FLAG) 
    VALUES (:adminId, :text, :imagePath, :currentDate, :flag)`;
    const result2 = await connection.execute(sql, bindVars, { autoCommit: true });

    const bindVars2 = {
      areaId: { val: areaId, type: oracledb.NUMBER },
    };
    const sql2 = `INSERT INTO PROMOTIONAL_MEG_AREA (AREA_ID) 
    VALUES (:areaId)`;
    const result3 = await connection.execute(sql2, bindVars2, { autoCommit: true });

    if (result2.rowsAffected === 1 && result3.rowsAffected === 1) {
      res.status(201).send({ message: 'Promotion added successfully' });
    } else {
      return res.status(500).send({ message: 'Internal Server Error' });
    }

  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message }); 
  }

}]

exports.fetchAreas = async (req, res) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sql = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sql, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const username = decrypt.username;
    const sql1 = `SELECT * from ADMIN WHERE USERNAME= :username`;
    const result1 = await connection.execute(sql1, [username]);

    const adminId = result1.rows[0].ID;

    const query = `
    SELECT A.AREA_NAME AS area_name
    FROM AREA A
    JOIN ADMIN_AREAS AA ON A.id = AA.AREA_ID
    JOIN ADMIN AD ON AA.ADMIN_ID = AD.ID
    WHERE AD.ID = :adminId`;

    const result2 = await connection.execute(query, [adminId]);

    const areas = result2.rows.map(row => ({
      area: row.AREA_NAME
    }));

    res.json(areas);
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error', error: error.message }); 
  }
  
}

async function getComplaints() {
  
  try {
    const query = `
    SELECT 
        C.ID AS complaint_id,
        CL.client_name AS client_name,
        C.COMPLAINT_TYPE AS complaint_type,
        C.DATE_ AS complaint_lodged_on,
        CL.CLIENT_NAME AS client_info_name,
        CL.CNIC AS client_info_cnic,
        CL.CELL AS client_info_cell_number,
        CASE WHEN CL.ACTIVE_FLAG = 1 THEN 'Yes' ELSE 'No' END AS client_info_active_status,
        OC.TEXT_CONTENT AS complaint_text,
        OC.AUDIO_CONTENT AS complaint_audio,
        A.AREA_NAME AS area_name,
        B.BRANCH_NAME AS branch_name,
        C.STATUS AS status
    FROM 
        COMPLAINT C
    JOIN 
        CLIENT CL ON C.CLIENT_ID = CL.ID
    LEFT JOIN 
        OTHER_COMPLAINT OC ON C.ID = OC.COMPLAINT_ID
    JOIN 
        AREA A ON CL.AREA_ID = A.ID
    JOIN 
        BRANCH B ON CL.BRANCH_ID = B.ID
  `;

    const connection = await db.getConnection();
    const res = await connection.execute(query);
    
    const complaints = res.rows.map(row => ({
      id: row.COMPLAINT_ID,
      name: row.CLIENT_NAME,
      complaintType: row.COMPLAINT_TYPE,
      complaintLodgedOn: row.COMPLAINT_LODGED_ON,
      clientInfo: {
        name: row.CLIENT_INFO_NAME,
        cnic: row.CLIENT_INFO_CNIC,
        cellNumber: row.CLIENT_INFO_CELL_NUMBER,
        activeStatus: row.CLIENT_INFO_ACTIVE_STATUS,
      },
      complaintText: row.COMPLAINT_TEXT,
      complaintAudio: row.COMPLAINT_AUDIO,
      area: row.AREA_NAME,
      branch: row.BRANCH_NAME,
      status: row.STATUS,
    }));
    return complaints;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
}

exports.fetchComplaints = async (req, res) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decrypt = jwt.verify(token, TOKEN_SECRET_KEY);
    const sql = `SELECT * from ADMIN WHERE USERNAME = :decrypt`;

    const connection = await db.getConnection();

    const result = await connection.execute(sql, [decrypt.username]);
    if (result.rows.length == 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { area, branch, status } = req.body;

    let filteredComplaints = await getComplaints();

    if (area) {
      console.log(area);
      filteredComplaints = filteredComplaints.filter(
        complaint => complaint.area === area
      );
    }

    if (branch) {
      filteredComplaints = filteredComplaints.filter(
        complaint => complaint.branch === branch
      );
    }

    if (status) {
      filteredComplaints = filteredComplaints.filter(
        complaint => complaint.status === status
      );
    }

    res.json(filteredComplaints);
  } catch (error) {
    console.error('Error fetching complaints data:', error);
    res.status(500).send('Internal Server Error');
  }
};