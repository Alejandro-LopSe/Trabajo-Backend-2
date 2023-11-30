import mongoose from "mongoose"
// @deno-types="npm:@types/express@4"
import express from "express";
import { base, post_student, post_subject, post_teacher } from "./resolvers/Posts.ts";
import { update_student } from "./resolvers/update.ts";

const MONGO_URL = Deno.env.get("MONGO_URL")

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL)



const app = express()
app.use(express.json());

app.get("/",base)
.post("/student",post_student)
.post("/subject",post_subject)
.post("/teacher",post_teacher)
.put("/student",update_student)
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
