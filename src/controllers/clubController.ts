import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

export const createClub = async (req: AuthRequest, res: Response) => {
  try {
    // Only admin can create clubs
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only administrators can create clubs' });
    }

    const { clubName, email, description } = req.body;

    // Check if club already exists
    const existingClub = await prisma.club.findUnique({
      where: { clubName },
    });

    if (existingClub) {
      return res.status(400).json({ message: 'Club already exists' });
    }

    // Create club
    const club = await prisma.club.create({
      data: {
        clubName,
        email,
        description,
      },
    });

    res.status(201).json({
      message: 'Club created successfully',
      club,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getClubs = async (req: AuthRequest, res: Response) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        players: true,
      },
    });

    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getClubById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        players: true,
      },
    });

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json(club);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
