const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "_" + file.originalname
      //   file.originalname.replace(/\.[^/.]+$/,"") +"_" +Date.now() +path.extname(file.originalname)
    );
  },
});

let maxSize = 2 * 1024 * 1024;

let upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: function (req, file, cb) {
    let filetypes = /pdf|jpg|jpeg/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File supports only these following types:" + filetypes);
  },
}).single("mypic");

app.get("/", (req, res) => {
  res.render("signup");
});

app.post("/upload", (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      if (
        err instanceof multer.MulterError &&
        err.message == "File too large"
      ) {
        return res.send("Your file is too large to upload");
      }
      res.send(err);
    } else {
      res.send("Success. Your image has been successfully uploaded!");
    }
  });
});

app.listen(8080, () => {
  console.log("Server is running in the PORT 8080");
});
