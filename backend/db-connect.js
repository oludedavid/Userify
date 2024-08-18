const mongoose = require("mongoose");

const { MONGODB_URI, DB_USER, DB_PASSWORD } = process.env;

mongoose
  .connect(MONGODB_URI, {
    auth: { username: DB_USER, password: DB_PASSWORD },
  })
  .then(() =>
    console.log(
      "Connected to MongoDB: Users are now ready to be added to the Airplane"
    )
  )
  .catch((err) => console.error("Error connecting to MongoDB:", err));
