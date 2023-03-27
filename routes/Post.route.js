const express = require("express");
const { PostModel } = require("../models/Post.model");

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  try {
    const notes = await PostModel.find();
    res.status(200).send(notes);
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Something went wrong" });
  }
});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const new_note = new PostModel(payload);
    await new_note.save();
    res.status(200).send("New note created");
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Something went wrong" });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const note = await PostModel.findOne({ _id: id });
  const userID_in_post = note.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_making_req == userID_in_post) {
      await PostModel.findByIdAndUpdate({ _id: id }, payload);
      res.status(200).send("Note Updated successfully");
    } else {
      res.status(400).send({ msg: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Something went wrong" });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const note = await PostModel.findOne({ _id: id });
  const userID_in_post = note.userID;
  const userID_making_req = req.body.userID;
  try {
    if (userID_making_req == userID_in_post) {
      await PostModel.findByIdAndDelete({ _id: id });
      res.status(200).send("Note Deleted successfully");
    } else {
      res.status(400).send({ msg: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Something went wrong" });
  }
});

module.exports = {
  postRouter,
};
