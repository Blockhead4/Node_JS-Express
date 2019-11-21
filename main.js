const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const topicRouter = require("./routes/topic");

const app = express();

const myMiddleWare = (request, response, next) => {
  fs.readdir("./data", (err, filelist) => {
    if (err) throw err;
    request.list = filelist;
    next();
  });
};

app.use(helmet());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*", myMiddleWare);

app.use("/", indexRouter);
app.use("/topic", topicRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
