const express = require("express");
const cors = require("cors");
const cardRoutes = require("./routes/cardRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const userRoutes = require("./routes/userRoutes");
const folderRoutes = require("./routes/folderRoutes");
const publicRoutes = require("./routes/publicRoutes");

const { checkJwt, attachUser } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

// app.use((req, res, next) => {
//     console.log("📌 Token recibido en Backend:", req.headers.authorization);
//   next();
// });

app.use("/public", publicRoutes);

app.use("/cards", checkJwt, cardRoutes);
app.use("/modules", checkJwt, moduleRoutes);
app.use("/users", checkJwt, userRoutes);
app.use("/folders", checkJwt, folderRoutes);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
