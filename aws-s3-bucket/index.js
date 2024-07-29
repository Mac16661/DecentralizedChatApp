import express from "express";
import multer from "multer";
import cors from "cors";
import "dotenv/config";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    bucket: BUCKET,
    s3: s3,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, file.originalname + uuidv4());
    },
  }),
});

const app = express();

app.use(cors());

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.send(req.file.location);
});

//TODO: not require in project
// app.get("/download/:filename", async (req, res) => {
//   const filename = req.params.filename;
//   let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
//   res.send(x.Body);
// });

app.get("/", (req, res) => {
  res.send("Hello world");
  console.log("h");
});

app.listen(3001, () => {
  console.log("listining at port 3001");
});
