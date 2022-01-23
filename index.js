let express = require("express");
let app = express();

let apiRouter = require("./routes/index");

app.use(express.json());
app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("listening on port 3000...");
});
