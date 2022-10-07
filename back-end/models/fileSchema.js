import mongoose from "mongoose";
import validator from "validator";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the event"],
      minLength: [3, "Name is too short"],
    },
    uploadDate: {
      type: Date,
      default: Date.now(),
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please provide uploader id"],
    },
    url: {
      type: String,
      required: [true, "Please provide a url for the file"],
      minLength: [3, "Name is too short"],
    },
  },
);


export default mongoose.model("files", fileSchema);
