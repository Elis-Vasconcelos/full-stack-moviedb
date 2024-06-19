import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const TMDB_API_KEY = 'eb4a0700966ecd9a61881d4b79da8fcb';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const SECRET_KEY = 'my_secret_key';

// Define a custom interface to extend Request
interface AuthenticatedRequest extends Request {
    userId?: number;
  }

// Create a new user
app.post('/api/users', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'User creation failed' });
    }
  });

// Log in a user
app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

// Middleware to authenticate user
const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
      req.userId = decoded.userId; // Assign userId to req object
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

app.get('/api/movies', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}`);
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching movies from TMDB' });
  }
});

// Example route using req.userId
app.post('/api/favorites', authenticate, async (req: AuthenticatedRequest, res: Response) => {
    const { userId, title, posterPath } = req.body;
    try {
      if (req.userId === undefined) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const favorite = await prisma.movie.create({
        data: {
          title,
          posterPath,
          userId: req.userId
        }
      });
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: 'Error adding movie to favorites' });
    }
  });
  
app.get('/api/favorites/:userId', async (req: Request, res: Response) => {
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
