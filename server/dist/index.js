"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const db_2 = require("./db");
const config_1 = require("./config");
const authMiddleware_1 = require("./authMiddleware");
const db_3 = require("./db");
const utils_1 = require("./utils");
const cors_1 = require("cors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_2.ConnectDB)();
const PORT = 3000;
app.use((0, cors_1.cors)({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Include credentials if needed
}));
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //zod
    try {
        const username = req.body.username;
        const password = req.body.password;
        const existUser = yield db_1.UserModel.findOne({ username: username });
        if (existUser) {
            res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // add all condition
        yield db_1.UserModel.create({
            username,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "user signed in",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "failed signup " });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const existUser = (yield db_1.UserModel.findOne({
            username: username,
        }));
        if (!existUser) {
            res.status(401).json({ message: "user credentials invalid" });
            return;
        }
        const isPassword = yield bcrypt_1.default.compare(password, existUser.password);
        if (!isPassword) {
            res.status(401).json({ message: "invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: existUser._id }, config_1.JWT_SECRATE);
        res.status(200).json({ token: token });
    }
    catch (error) {
        res.status(401).json({
            message: "something went wrong",
            error: error,
        });
    }
}));
app.post("/api/v1/content", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const {link,type,title, tags} = req.body;
        const link = req.body.link;
        const type = req.body.type;
        const title = req.body.title;
        const tags = req.body.tags;
        const savedPost = yield db_1.ContentModel.create({
            link: link,
            type: type,
            title: title,
            tags: tags,
            // @ts-ignore
            userId: req.userId,
        });
        res.status(200).json({ message: "content added", data: savedPost });
    }
    catch (error) {
        res.status(400).json({ message: "data didint added ", error: error });
    }
}));
app.get("/api/v1/content/displaydata/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Need to destructure 'id' from params, not entire params object
        const content = yield db_1.ContentModel.findById(// findOne instead of find since we're querying by ID
        {
            _id: id,
        });
        if (!content) {
            res.status(404).json({ message: "Content not found" });
            return;
        }
        res.status(200).json(content);
        return;
    }
    catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: "Something went wrong" });
        return;
    }
}));
app.get("/api/v1/content", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.userId;
        const content = yield db_1.ContentModel.find({ userId: userId });
        res.status(200).json(content);
    }
    catch (error) {
        res.status(400).json({ message: "somethoing went wrong", error: error });
    }
}));
app.delete("/api/v1/content/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Need to destructure id from params
        const result = yield db_1.ContentModel.deleteOne({
            _id: id,
            // Add userId check for authorization
        });
        if (result.deletedCount === 0) {
            res.status(404).json({
                message: "Content not found or unauthorized"
            });
            return;
        }
        res.status(200).json({ message: "Content deleted successfully" });
    }
    catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({
            message: "Something went wrong",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}));
app.post("/api/v1/brain/share", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        // Validate the presence of `userId` from middleware
        //@ts-ignore
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized: User ID is missing" });
            return;
        }
        if (share) {
            // Check if a link already exists for the user
            const existingLink = yield db_3.linkModel.findOne({ userId });
            if (existingLink) {
                res.status(200).json({ hash: existingLink.hash }); // Send existing hash
                return;
            }
            // Generate a new hash for the shareable link
            const hash = (0, utils_1.generateRandomHash)(10); // Helper function to generate hash
            yield db_3.linkModel.create({ userId, hash });
            res.status(201).json({ hash });
            return; // Send new hash in the response
        }
        else {
            // Remove the shareable link if `share` is false
            const deleteResult = yield db_3.linkModel.deleteOne({ userId });
            if (deleteResult.deletedCount === 0) {
                res.status(404).json({ message: "No link found to remove" });
                return;
            }
            res.status(200).json({ message: "Link removed successfully" });
            return;
        }
    }
    catch (error) {
        console.error("Error in /api/v1/brain/share:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.shareLink;
        // Validate if hash is provided
        if (!hash) {
            res.status(400).json({ message: "Share link is required" });
            return;
        }
        // Find the link using the provided hash
        const link = yield db_3.linkModel.findOne({ hash });
        if (!link) {
            res.status(404).json({ message: "Invalid or expired share link" });
            return;
        }
        // Fetch content and user details for the shareable link
        const [content, user] = yield Promise.all([
            db_1.ContentModel.find({ userId: link.userId }),
            db_1.UserModel.findById(link.userId),
        ]);
        // Handle case where user does not exist
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Respond with user and content details
        res.status(200).json({
            username: user.username,
            content,
        });
    }
    catch (error) {
        console.error("Error fetching shareable data:", error);
        res.status(500).json({ message: "An error occurred", error });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
