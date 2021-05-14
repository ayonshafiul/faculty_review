const db = require("../../db");
const {
  validateNumber,
  createErrorObject,
  createSuccessObject,
} = require("../../utils");

module.exports = function (req, res) {
  let voteType = validateNumber(req.body.voteType);
  let studentID = req.user.studentID;
  let commentID = validateNumber(req.params.commentID);

  if (voteType.error || commentID.error) {
    return res.json(createErrorObject("Invalid studentID or commentID"));
  }

  if (voteType.value != 1 && voteType.value != 0) {
    return res.json(createErrorObject("Vote not valid!"));
  }

  // 1 means upvote
  // 0 means downvote

  //************************************************** */

  let sql =
    "SELECT upVote, downVote from commentvote where commentID = ? AND studentID = ?";
  db.query(sql, [commentID.value, studentID], function (error, results) {
    if (error) {
      console.log(error);
      return res.json(createErrorObject("comment voting failed"));
    } else {
      if (results.length == 0) {
        let commentratingObj;
        let secondsql;
        let msg = "";
        sql = "INSERT into commentvote set ?";

        if (voteType.value == 1) {
          commentratingObj = {
            commentID: commentID.value,
            studentID: studentID,
            upVote: 1,
            downVote: 0,
          };
          secondsql =
            "Update comment set upVoteSum = upVoteSum + 1 where commentID = ? ";
          msg = "upvoteinsert";
        } else {
          commentratingObj = {
            commentID: commentID.value,
            studentID: studentID,
            upVote: 0,
            downVote: 1,
          };
          secondsql =
            "Update comment set downVoteSum = downVoteSum + 1 where commentID = ? ";
          4;
          msg = "downvoteinsert";
        }
        db.query(sql, commentratingObj, function (error, results) {
          if (error) {
            console.log(error);
            res.json(createErrorObject("Voting error"));
          } else {
            db.query(secondsql, [commentID.value], function (error, results) {
              if (error) {
                console.log(error);
                res.json(createErrorObject("vote not inserted"));
              } else {
                res.json(createSuccessObject(msg));
              }
            });
          }
        });
      } else {
        let firstSql;
        let secondSql;
        let msg = "";
        if (
          results[0].upVote == 1 &&
          results[0].downVote == 0 &&
          voteType.value == 0
        ) {
          //when vote is changed from upVote to downVote
          firstSql =
            "UPDATE commentvote set upVote=0 , downVote = 1 where commentID =? and studentID =?";
          secondSql =
            "UPDATE comment set upVoteSum = upVoteSum - 1 , downVoteSum = downVoteSum + 1 where commentID =?";
          msg = "downvoteupdate";
        } else if (
          results[0].upVote == 0 &&
          results[0].downVote == 1 &&
          voteType.value == 1
        ) {
          //when vote is changed from downVote to upVote
          firstSql =
            "UPDATE commentvote set upVote=1 , downVote = 0 where commentID =? and studentID =?";
          secondSql =
            "UPDATE comment set upVoteSum = upVoteSum + 1 , downVoteSum = downVoteSum - 1 where commentID =?";
          msg = "upvoteupdate";
        } else {
          return res.json(createSuccessObject("noupdate"));
        }

        db.query(
          firstSql,
          [commentID.value, studentID],
          function (error, results) {
            if (error) {
              console.log(error);
              res.json(createErrorObject("vote not updated"));
            } else {
              //run second sql here
              db.query(secondSql, commentID.value, function (error, results) {
                if (error) {
                  console.log(error);
                  res.json(createErrorObject("voteSum not updated"));
                } else {
                  res.json(createSuccessObject(msg));
                }
              });
            }
          }
        );
      }
    }
  });
};
