const mongoose = require("mongoose");
require("dotenv").config();

var connectionString = process.env.MONGO_SRV;
module.exports = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });