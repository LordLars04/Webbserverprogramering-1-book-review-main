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
        const data = fs.readFileSync(filePath, "utf-8"); // Läser filens innehåll som text
        reviews = JSON.parse(data); // Gör om texten till JavaScript-format (oftast en array)

        // Om filen inte innehåller en array, återställ den till en tom array
        if(!Array.isArray(reviews))reviews = []
    } catch (error) {
        // Om JSON är trasigt eller något går fel -> nollställ reviews
        console.error("Error during read of reviews.json:", error);
        reviews = [];
    }

    reviews.push(reviewData);

    try {
        console.log({ reviews: reviews });

        // Sparar tillbaka alla recensioner till reviews.json
        fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
    } catch (error) {
        // Skriv ut error meddelande i terminalen
        console.error("Error writing to reviews.json");
    }

    
};

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
