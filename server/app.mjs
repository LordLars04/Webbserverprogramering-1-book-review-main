import cors from 'cors';
import express from 'exoress';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));