const dbPool = require("../../dbPool.js");
const {
  validateComment,
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let reply = validateComment(req.body.replyText);
  let queryID = validateNumber(req.params.queryID);
  let studentID = req.user.studentID;

  if (reply.error || queryID.error) {
    return res.json(createErrorObject("Invalid reply or qid"));
  }

  dbPool.getConnection(function (err, connection) {
    if (err) return res.json(createErrorObject("Can not establish connection"));
    let sql = "INSERT INTO reply SET ?";
    let replyObj = {
      queryID: queryID.value,
      studentID,
      replyText: reply.value,
    };

    connection.query(sql, replyObj, (error, results, fields) => {
      if (error) {
        res.json(createErrorObject("Error while inserting reply"));
      } else {
        res.json(createSuccessObject("Successfully Inserted!"));
      }
    });
    connection.release();
  });
};
