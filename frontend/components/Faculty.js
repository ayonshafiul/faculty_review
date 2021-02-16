import React, { useState, useEffect } from "react";
import FacultyDetails from "./FacultyDetails";
import AddComment from "./AddComment";
import CommentList from "./CommentList";

function Faculty(props) {
  const facultyArray = props.faculties.filter((faculty) => {
    return faculty.facultyID == props.id;
  });
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [dataUpdate, setDataUpdate] = useState(false);


  useEffect(() => {
    let url = "http://localhost:8080/comment/" + props.id;
    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((data) => {
        return data.json();
      })
      .then((results) => {
        console.log(results);
        setComments(results.data);
      });
  }, [props.id,dataUpdate]);

  function addComment(event) {
    event.preventDefault();
    console.log(typeof comment);
    let txt = String(comment);
    let url = "http://localhost:8080/comment/" + props.id;

    fetch("http://localhost:8080/comment/" + props.id, {
      method: "POST",
      credentials: "include",
      body: "comment=" + comment,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          setDataUpdate(!dataUpdate);
        }
        console.log(data);
      });
  }

  function like(commentID){
    const url ="http://localhost:8080/comment/rate/"+commentID+"/1"
    fetch(url, {
      method: "POST",
      credentials: "include",
      
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          setDataUpdate(!dataUpdate);
        }
        console.log(data);
      });
  }

  function dislike(commentID){
    const url ="http://localhost:8080/comment/rate/"+commentID+"/0"
    fetch(url, {
      method: "POST",
      credentials: "include",
      
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if(data.success==true ){
          setDataUpdate(!dataUpdate);
        }
        console.log(data);
      });
  }

  return (
    <div>
      {facultyArray.length > 0 ? (
        <FacultyDetails faculty={facultyArray[0]} />
      ) : (
        <FacultyDetails faculty={{ facultyName: "loading.." }} />
      )}
      <AddComment
        comment={comment}
        setComment={setComment}
        addComment={addComment}
      />
      <CommentList comments={comments} like={like} dislike={dislike} />
    </div>
  );
}

export default Faculty;