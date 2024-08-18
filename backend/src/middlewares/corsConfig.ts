const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: "*",
};

export default cors(corsOptions);
