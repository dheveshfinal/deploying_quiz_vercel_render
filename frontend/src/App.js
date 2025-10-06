import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./component/Registration";
import Login from "./component/login"
import Userdash from "./component/Userdash" 
import AdminDash from "./component/Admindash"
import Quizmanagement from "./component/quiz-management"
import AddQuiz from "./component/adminaddquiz"
import ReviewQuiz from "./component/Reviewquiz"
import AddQuizQuestion from "./component/AddQuestions"
import AddQuizQuestionRow from "./component/addquizquestionrow"
import Optiondisplay from "./component/Adminoption"
import Userquiz from "./component/Userquiz"
import Useroption from "./component/Useroption"
import Userresult from "./component/Userresult"
import Reviewresult from "./component/Reviewresult"
import Reviewanswer from "./component/Reviewanswer"
import "./App.css";
import UserReview from "./component/UserReview"
import ReviewUser from "./component/ReviewUser"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard1/:id" element={<Userdash/>}/>
        <Route path="/dashboard2/:id" element={<AdminDash/>}/>
        <Route path="/quiz-management/:id" element={<Quizmanagement/>}/>
        <Route path="/add-quiz" element={<AddQuiz/>}/>
        <Route path="/review-quiz/:id" element={<ReviewQuiz/>}/>
        <Route path="/add_quiz/:id" element={<AddQuizQuestion/>}/>
        <Route path="/addquizequestionrow/:quizid" element={<AddQuizQuestionRow />} />
        <Route path="/option/:id" element={<Optiondisplay />} />
        <Route path="/quiz/:id" element={<Userquiz/>}/>
        <Route path="/useroption/:id/:quizId" element={<Useroption />} />
        <Route path="/review/:id/:quizId" element={<Userresult/>}/>
        <Route path="/review/:id" element={<Reviewresult/>}/>
        <Route path="/reviewanswer/:id/:quizId" element={<Reviewanswer/>}/>
        <Route path="/Userreview/:id" element={<UserReview/>}/>
        <Route path="/reviewuser/:quizId/:adminId" element={<ReviewUser />} />



        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
