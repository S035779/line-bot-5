const { Group } = require("../models/account");

exports.index = async (req, res) => {
  try {
    const posts = await Group.find();
    if (!posts) throw Error("error");
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.select = async (req, res) => {
  try {
    const posts = await Group.findById(req.params.id);
    if (!posts) throw Error("error");
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.create = async (req, res) => {
  const newPost = new Group(req.body);
  try {
    const post = await newPost.save();
    if (!post) throw Error("error");
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await Group.findByIdAndUpdate(req.params.id, req.body);
    if (!post) throw Error("error");
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

exports.delete = async (req, res) => {
  try {
    const post = await Group.findByIdAndDelete(req.params.id);
    if (!post) throw Error("error");
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
