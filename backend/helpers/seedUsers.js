import mongoose from "mongoose";
import User from "../server/models/User.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/myapp";

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    // Optional: clear users first
    await User.deleteMany({});

    const users = [
      {
        login: "lekarz@gmail.com",
        password: "qwerty",
        surname: "Lekarski",
        role: "doctor"
      },
      {
        login: "pacjent@gmail.com",
        password: "qwerty",
        surname: "Pacjencki",
        role: "patient"
      }
    ];

    const inserted = await User.insertMany(users);

    inserted.forEach(u =>
      console.log(`Inserted user ${u.login} with id ${u._id}`)
    );

    await mongoose.disconnect();
    console.log("Done ✅");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedUsers();
