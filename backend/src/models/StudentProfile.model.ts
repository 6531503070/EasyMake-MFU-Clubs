import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const StudentProfileSchema = new Schema(
  {
    _id: { type: String, default: genId },
    user_id: { type: String, ref: "User", required: true, unique: true },

    major: { type: String },
    student_code: { type: String },
    avatar_url: { type: String },
  },
  { timestamps: false }
);

export const StudentProfileModel = model("StudentProfile", StudentProfileSchema);
