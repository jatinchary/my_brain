import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ContentModel, UserModel } from "./db";
import { ConnectDB } from "./db";
import { JWT_SECRATE } from "./config";
import { authMiddleware } from "./authMiddleware";
import { linkModel } from "./db";
import { generateRandomHash } from "./utils";



const app = express();
app.use(express.json());
ConnectDB();
const PORT = 3000;

interface User {
  _id: string;
  username: string;
  password: string;
}
app.post("/api/v1/signup",async (req: Request, res: Response): Promise<void> => {
    //zod
    try {
      const username = req.body.username;
      const password = req.body.password;
      const existUser = await UserModel.findOne({ username: username });
      if (existUser) {
        res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      // add all condition
      await UserModel.create({
        username,
        password: hashedPassword,
      });
      res.status(201).json({
        message: "user signed in",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "failed signup " });
    }
  }
);

app.post("/api/v1/signin",async (req: Request, res: Response): Promise<void> => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const existUser = (await UserModel.findOne({
        username: username,
      })) as User;
      if (!existUser) {
        res.status(401).json({ message: "user credentials invalid" });
        return;
      }
      const isPassword = await bcrypt.compare(password, existUser.password);
      if (!isPassword) {
        res.status(401).json({ message: "invalid credentials" });
      }
      const token = jwt.sign({ id: existUser._id }, JWT_SECRATE);
      res.status(200).json({ token: token });
    } catch (error) {
      res.status(401).json({
        message: "something went wrong",
        error: error,
      });
    }
  }
);

app.post("/api/v1/content",authMiddleware,async (req: Request, res: Response) => {
    try {
      // const {link,type,title, tags} = req.body;
      const link = req.body.link;
      const type = req.body.type;
      const title = req.body.title;
      const tags = req.body.tags;

      const savedPost = await ContentModel.create({
        link: link,
        type: type,
        title: title,
        tags: tags,
        // @ts-ignore
        userId: req.userId,
      });

      res.status(200).json({ message: "content added", data: savedPost });
    } catch (error) {
      res.status(400).json({ message: "data didint added ", error: error });
    }
  }
);
app.get("/api/v1/content/displaydata/:id", authMiddleware, async (req:Request, res:Response):Promise<void> => {
    try {
      const { id } = req.params;  // Need to destructure 'id' from params, not entire params object
      
      const content = await ContentModel.findById(  // findOne instead of find since we're querying by ID
        { 
         _id:id,
          
        }
      );
  
      if (!content) {
 res.status(404).json({ message: "Content not found" });
 return
      }
  
     res.status(200).json(content);
     return
    } catch (error) {
      console.error('Error fetching content:', error);
     res.status(500).json({ message: "Something went wrong" });
     return
    }
  });

app.get("/api/v1/content", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({ userId: userId });
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ message: "somethoing went wrong", error: error });
  }
});

app.delete( "/api/v1/content/:id",authMiddleware, async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;  // Need to destructure id from params

  
        const result = await ContentModel.deleteOne({ 
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
      } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ 
          message: "Something went wrong",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  );

app.post( "/api/v1/brain/share",authMiddleware,async (req: Request, res: Response): Promise<void> => {
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
        const existingLink = await linkModel.findOne({ userId });
        if (existingLink) {
          res.status(200).json({ hash: existingLink.hash }); // Send existing hash
          return;
        }

        // Generate a new hash for the shareable link
        const hash = generateRandomHash(10); // Helper function to generate hash
        await linkModel.create({ userId, hash });
        res.status(201).json({ hash });
        return; // Send new hash in the response
      } else {
        // Remove the shareable link if `share` is false
        const deleteResult = await linkModel.deleteOne({ userId });
        if (deleteResult.deletedCount === 0) {
          res.status(404).json({ message: "No link found to remove" });
          return;
        }
        res.status(200).json({ message: "Link removed successfully" });
        return;
      }
    } catch (error) {
      console.error("Error in /api/v1/brain/share:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

app.get("/api/v1/brain/:shareLink",async (req: Request, res: Response): Promise<void> => {
    try {
      const  hash = req.params.shareLink;

      // Validate if hash is provided
      if (!hash) {
        res.status(400).json({ message: "Share link is required" });
        return;
      }

      // Find the link using the provided hash
      const link = await linkModel.findOne({ hash });
      if (!link) {
        res.status(404).json({ message: "Invalid or expired share link" });
        return;
      }

      // Fetch content and user details for the shareable link
      const [content, user] = await Promise.all([
        ContentModel.find({ userId: link.userId }),
        UserModel.findById(link.userId),
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
    } catch (error) {
      console.error("Error fetching shareable data:", error);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
