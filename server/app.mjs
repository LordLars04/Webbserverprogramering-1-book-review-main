import cors from 'cors';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dataDir = `${__dirname}/data`;
const filePath = `${dataDir}/reviews.json`;

// Ensure data directory and file exist to avoid startup crashes
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
}

const saveReview = (reviewData) => {
    let reviews = [];
    try {
        const content = fs.readFileSync(filePath, 'utf-8') || '[]';
        reviews = JSON.parse(content);
    } catch (err) {
        reviews = [];
    }

    reviews.push(reviewData);
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
}

app.post("/reviews", (req, res) => {
    const {bookTitle, author, reviewer, rating, review} = req.body;
    console.log("Received review:", bookTitle, author, reviewer, rating, review);

    const id = uuidv4();

    try {
        const reviewData = {
            bookTitle,
            author,
            reviewer,
            rating,
            review,
            id,
            timestamp: new Date().toISOString(),
        };

        console.log("Saved review:", reviewData);
        saveReview(reviewData);

     

        res.status(201).json({ message: "Review saved successfully", review: reviewData });
    } catch (error) {
        console.log("Error saving review:", error);
        res.status(500).json("Internal Server Error halt stop");        
    }
});

export default app;
