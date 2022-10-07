import File from "../models/fileSchema.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import AWS from "aws-sdk";
import s3Storage from "multer-sharp-s3";
import multer from "multer";
AWS.config.update({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

export const getUserFiles = catchAsync(async (req, res, next) => {
  const limit_size = 20;
  const page = parseInt(req.query.page, 10) || 1;
  const startIndex = (page - 1) * limit_size;

  const [files, total] = await Promise.all([
    File.find({ uploaderId: req.user._id }).skip(startIndex).limit(limit_size),
    File.estimatedDocumentCount(),
  ]);

  res.status(200).json({
    status: "success",
    total_pages: Math.ceil(total / 20),
    page: page,
    result: files.length,
    data: files,
  });
});

export const uploadFile = catchAsync(async (req, res, next) => {
  const upload = multer({
    storage: s3Storage({
      s3: s3,
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: "public-read",
      Key: function (request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
      // resize: {
      //   width: 600,
      //   height: 400,
      // },
    }),
  }).array(`file`, 1);

  upload(req, res, async function (error) {
    if (error) {
      console.log("err", error)
      return next(new AppError(error, 404));
    }

    const file = await File.create({
      name: req.files[0].key,
      uploadDate: Date.now(),
      uploaderId: req.user._id,
      url: req.files[0].Location,
    });

    return res.status(200).json({
      status: "success",
      data: file,
    });
  });
});

export const getSignedUrl = catchAsync(async (req, res, next) => {
  if (!req.params.key) {
    return next(new AppError("Please provide a valid key", 404));
  }
  const signedUrlExpireSeconds = 60 * 5;

  const url = s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.params.key,
    Expires: signedUrlExpireSeconds,
  });

  if (!url) {
    return next(new AppError("File not found", 404));
  }

  return res.status(200).json({
    status: "success",
    url,
  });
});
