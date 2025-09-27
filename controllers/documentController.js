const pool = require("../config/db");

exports.getDocumentsByRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.request_id, 10);
    if (isNaN(requestId)) return res.status(400).send("Invalid request ID");

  
    const requestCheck = await pool.query(
      "SELECT id, user_id FROM requests WHERE id=$1",
      [requestId]
    );

    if (requestCheck.rows.length === 0) {
      return res.status(404).send("Request not found");
    }

    const requestRow = requestCheck.rows[0];
    
    if (!req.user || req.user.id !== requestRow.user_id) {
      return res.status(403).send("Request not found or access denied");
    }

   
    const docsResult = await pool.query(
      "SELECT id, file_name, file_path, uploaded_at FROM documents WHERE request_id=$1 ORDER BY uploaded_at DESC",
      [requestId]
    );

    return res.render("citizen/documents", {
      documents: docsResult.rows,
      requestId,
      error: null,
      message: null
    });
  } catch (err) {
    console.error("getDocumentsByRequest Error:", err);
    return res.status(500).send("Server Error");
  }
};


exports.uploadDocument = async (req, res) => {
  try {
    const requestId = parseInt(req.params.request_id, 10);
    if (isNaN(requestId)) return res.status(400).send("Invalid request ID");

   
    const requestCheck = await pool.query("SELECT id, user_id FROM requests WHERE id=$1", [requestId]);
    if (requestCheck.rows.length === 0) return res.status(404).send("Request not found");
    if (!req.user || req.user.id !== requestCheck.rows[0].user_id) return res.status(403).send("Access denied");

    if (!req.file) {
  
      const docs = await pool.query("SELECT id, file_name, file_path, uploaded_at FROM documents WHERE request_id=$1 ORDER BY uploaded_at DESC", [requestId]);
      return res.render("citizen/documents", {
        documents: docs.rows,
        requestId,
        error: "No file uploaded",
        message: null
      });
    }

   
    await pool.query(
      "INSERT INTO documents (request_id, file_name, file_path, uploaded_at) VALUES ($1,$2,$3,NOW())",
      [requestId, req.file.originalname, req.file.path]
    );

    const docsResult = await pool.query("SELECT id, file_name, file_path, uploaded_at FROM documents WHERE request_id=$1 ORDER BY uploaded_at DESC", [requestId]);
    return res.render("citizen/documents", {
      documents: docsResult.rows,
      requestId,
      error: null,
      message: "File uploaded successfully!"
    });
  } catch (err) {
    console.error("uploadDocument Error:", err);
    return res.status(500).send("Server Error");
  }
};

exports.showUploadForm = async (req, res) => {
  try {
    const requestId = parseInt(req.params.request_id);
    if (isNaN(requestId)) return res.status(400).send("Invalid request ID");

   
    const requestCheck = await pool.query(
      "SELECT * FROM requests WHERE id=$1 AND user_id=$2",
      [requestId, req.user.id]
    );
    if (requestCheck.rows.length === 0) {
      return res.status(404).send("Request not found or access denied");
    }

    
    const docsResult = await pool.query(
      "SELECT id, file_name, file_path, uploaded_at FROM documents WHERE request_id=$1 ORDER BY uploaded_at DESC",
      [requestId]
    );

    return res.render("citizen/documents", { documents: docsResult.rows, requestId, error: null, message: null });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.redirect("/citizen/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

