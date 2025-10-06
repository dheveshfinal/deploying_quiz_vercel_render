const express = require("express");
const cors = require("cors");
const signup = require("./components/signup");
const login = require("./components/Login");
const Userinfo=require("./components/Userinfo")
const UserEdit=require("./components/UserEdit")
const Userdelete=require("./components/Userdelete")
const adminmanagment=require("./components/AdminManagement")
const adminquizdelete=require("./components/adminquizdelete")
const adminquizupdate=require("./components/adminquizupdate")
const adminquizadddata=require("./components/adminquizadddata")
const adminreviewquiz=require("./components/adminreviewquiz")
const addquestion=require("./components/addquestion")
const editdeletequizquestion=require("./components/editdeletequizquestion")
const addquestionrow=require("./components/addquestionrow")
const adminoption=require("./components/Adminoption")
const userquiz=require("./components/Userquiz")
const Userquestion=require("./components/Userquestion")
const Useroption=require("./components/Useroption")
const Userresult=require("./components/Userresult")
const Finalresult=require("./components/Userresult")
const reviewanswer=require("./components/reviewanswer")
const Userreview=require("./components/UserReview")

const app = express();
const port = 8000;

app.use(cors({
  origin: ["https://deploying-quiz-vercel-render-tver.vercel.app"],
  methods: ["GET", "POST"],
}));
app.use(express.json());

// Mount signup and login routes directly
app.use(signup);
app.use(login);
app.use(Userinfo);
app.use(UserEdit);
app.use(Userdelete);
app.use(adminmanagment);
app.use(adminquizdelete);
app.use(adminquizupdate);
app.use(adminquizadddata);
app.use(adminreviewquiz);
app.use(addquestion);
app.use(editdeletequizquestion);
app.use(addquestionrow);
app.use(adminoption);
app.use(userquiz);
app.use(Userquestion);
app.use(Useroption);
app.use(Userresult);
app.use(Finalresult);
app.use(reviewanswer);
app.use(Userreview);


app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
