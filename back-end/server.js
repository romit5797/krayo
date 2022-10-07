import app from "./app.js";
import mongoose from "mongoose";

//Usine event listener, catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(err);
  server.close(() => process.exit(1));
});

function connectToMongo() {
  const uri = process.env.MONGO_URI;
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 1,
  });

  console.log("connected to db");
}

connectToMongo();

const port = process.env.PORT_NO || 3001;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

//Usine event listener to close server on some unhandled rejection
//caused by an external source
process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => process.exit(1));
});
