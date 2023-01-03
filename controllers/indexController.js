exports.index = (_, res) => {
  return res.status(200).json({
    status: "success",
    message: "Connected successfully!"
  })
};
