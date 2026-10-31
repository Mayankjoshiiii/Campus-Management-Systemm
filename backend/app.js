const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const connDB = require("./db/db.conn");

const adminRoutes = require("./routes/admin.routes");
const facultyRoutes = require("./routes/faculty.routes");
const studentRoutes = require("./routes/students.routes");
const allUserRoutes = require("./routes/allusers.routes");
const apiRoutes = require("./routes/api.routes");
const privateRoutes = require("./private/admin.create");

connDB.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to MySQL database: " + (process.env.DB_NAME || "university"));
    }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API routes
app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);
app.use("/faculty", facultyRoutes);
app.use("/student", studentRoutes);
app.use("/private", privateRoutes);
app.use("/", allUserRoutes);

app.get("/check", (req, res) => {
    res.json({ status: "ok", message: "Campus Cloud University API is running properly." });
});

// Serve frontend static files if built (Production / Cloud Deployment)
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res, next) => {
        if (
            req.path.startsWith("/api") ||
            req.path.startsWith("/admin") ||
            req.path.startsWith("/faculty") ||
            req.path.startsWith("/student") ||
            req.path.startsWith("/uploads")
        ) {
            return next();
        }
        res.sendFile(path.join(frontendDist, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.json({
            name: "Campus Cloud University Management System API",
            status: "Active",
            endpoints: {
                api: "/api",
                admin: "/admin",
                faculty: "/faculty",
                student: "/student"
            }
        });
    });
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = { app, server };