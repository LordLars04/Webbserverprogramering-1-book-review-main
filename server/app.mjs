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

const getReviews = () => {
     const data = fs.readFileSync(filePath, "utf-8"); // Läser filens innehåll som text
    try {
        if(fs.existsSync(filePath)) return JSON.parse(data);

        return [];
    } catch (error) {
        console.error('Error reading reviews:', error);

        return [];
    }
};

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

const deleteRewiew = (reviewId) => {
    const data = fs.readFileSync(filePath, "utf-8");
    try {
       // Kontrollera om filen existerar
       if(!fs.existsSync(filePath)) {
        return false; // Return false om filen inte existerar
       } 

       let reviews = JSON.parse(data); // Konvertera till JavaScript array

       // Filtrera bort recensionen med matchande id 
       // filter() skapar en ny array som INTE innehåller rexensionen vi vill radera

       const filteredReviews = reviews.filter((review) => review.id !== reviewId);

       // Kolla om något faktiskt raderades genom att jämföra längden på varje array
       if(reviews.length === filteredReviews.length) return false; // Ingen recension med det id hittades

       // Spara den uppdaterade arrayen utan den raderade rexensionen
       fs.writeFileSync(filePath, JSON.stringify(filteredReviews, null, 2));
       return true; 
    } catch (error) {
        console.log("Error during delete:", error);
        return false;
        
    }
};

app.get("/reviews", (req, res) => {
    try {
        const reviews = getReviews();

        res.status(200).json({success: true, data: reviews});
    } catch (error) {
        console.error("Error readign file", error);

        res.status(500).json({success: false });
    }
});

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

app.delete("/reviews/:id", (req, res) => {
    console.log("DELETE request received");
    const reviewId = req.params.id; 

    console.log({reviewId: reviewId});
    try {
        const deleted = deleteRewiew(reviewId);

        if (deleted) {
            res.status(200).json({ success: true});
        }
        else {
            res.status(404).json({ success: false, message: "Review not found"});
        }
    } catch (error) {
       console.log({error: error});
       res.status(500).json({ success: false });
    }
});



export default app;


// npm init -y
// npm install express cors uuid
// npx nodemon --experimental-modules server/app.mjs
// npm install --save-dev nodemon
// client 
// npm init vite@latest
// npm install
// npm install axios