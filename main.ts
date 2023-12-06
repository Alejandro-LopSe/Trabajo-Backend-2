import mongoose from "mongoose"
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
// @deno-types="npm:@types/express@4"
import express from "express";
import { base, post_student, post_subject, post_teacher } from "./resolvers/Posts.ts";
import { update_student } from "./resolvers/update.ts";
import { get_student, get_subject, get_teacher } from "./resolvers/gets.ts";

const env = await load()
const MONGO_URL = Deno.env.get("MONGO_URL") || env["MONGO_URL"]



await mongoose.connect(MONGO_URL)



const app = express()
app.use(express.json());

app.get("/",base)
.post("/student",post_student)
.post("/subject",post_subject)
.post("/teacher",post_teacher)
.put("/student",update_student)
.get("/student/:_id", get_student)
.get("/subject/:_id", get_subject)
.get("/teacher/:_id", get_teacher)
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
