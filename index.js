import express from "express";
import ejs from "ejs";
import axios from "axios";
import bodyParser from "body-parser";
 
const app = express();
const port = 3000;

const currentYear = new Date().getFullYear();

var riddles = [];
var answers = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("index.ejs", {currentYear: currentYear});
});

app.post("/", async (req, res) => {
  try {
      const response = await axios.get("https://riddles-api.vercel.app/random");
      const result = response.data;
      const currentRiddle = result.riddle;
      const currentAnswer = result.answer;
      riddles.push(currentRiddle);
      answers.push(currentAnswer);
      res.render("index.ejs", {riddle: currentRiddle, currentYear: currentYear});
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("index.ejs", {error: "Something went wrong, try again later", currentYear: currentYear});
    }
});

app.post("/answer", (req, res) => {
  const currentRiddle = riddles.slice(-1);
  const currentAnswer = answers.slice(-1);
  res.render("index.ejs", {riddle: currentRiddle, answer: currentAnswer, currentYear: currentYear});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
