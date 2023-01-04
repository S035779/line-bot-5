const log = require("log4js").getLogger("index");

exports.index = (_, res) => {
  log.debug("This is in the index module");
  return res.status(200).json({
    status: "success",
    message: "Connected successfully!"
  })
};
