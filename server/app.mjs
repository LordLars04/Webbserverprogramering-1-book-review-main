import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

        saveMessage(reviewData);

        res.status(201).json("Review saved successfully");
    } catch (error) {
        console.log("Error saving review:", error);
        res.status(500).json("Internal Server Error halt stop");        
    }
});

export default app;