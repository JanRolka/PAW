import mongoose from "mongoose";
import { connectDB } from "../server/db.js";
import User from "../server/models/User.js";
import Visit from "../server/models/Visit.js";

await connectDB();

console.log("Clearing database...");

await User.deleteMany({});
await Visit.deleteMany({});

console.log("Database cleared ✅");

await mongoose.disconnect();
process.exit(0);
