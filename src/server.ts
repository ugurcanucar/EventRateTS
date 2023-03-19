import express from "express";
import postgresClient from "./config/db";

import userRouter from "./routes/userRouter";
import eventRouter from "./routes/event_router";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/events", eventRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("Listening PORT ", PORT);
  postgresClient.connect((err) => {
    if (err) {
      console.log("connection error ", err);
    } else {
      console.log("db connected successfully");
    }
  });
});
