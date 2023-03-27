const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/User.route");
const { postRouter } = require("./routes/Post.route");
const { authenticate } = require("./middlewares/authenticate.middleware");

require("dotenv").config();
const cors = require("cors")

const app = express();
app.use(express.json());

app.use(cors({
    origin:"*"
}))

app.get("/", (req, res) => {
  res.send("Home Page");
});



app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", postRouter);



app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Trouble connecting to DB");
    console.log(error);
  }

  console.log(`running at ${process.env.port}`);
});
