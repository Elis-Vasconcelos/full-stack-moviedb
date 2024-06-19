import cors from 'cors';
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const TMDB_API_KEY = 'eb4a0700966ecd9a61881d4b79da8fcb';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

app.get('/api/movies', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}`);
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching movies from TMDB' });
  }
});

app.post('/api/favorites', async (req: Request, res: Response) => {
  const { userId, title, posterPath } = req.body;
  try {
    const favorite = await prisma.movie.create({
      data: {
        title,
        posterPath,
        userId
      }
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Error adding movie to favorites' });
  }
});

app.get('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const favorites = await prisma.movie.findMany({
      where: { userId: parseInt(userId) },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorite movies' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
