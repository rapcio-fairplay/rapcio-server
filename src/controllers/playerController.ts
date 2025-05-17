import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

export const createPlayer = async (req: AuthRequest, res: Response) => {
  try {
    // Only admin can create players
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only administrators can register players' });
    }

    const {
      familyName,
      firstName,
      languageOfTheName,
      dateOfBirth,
      gender,
      countryOfBirth,
      mainNationality,
      secondaryNationality,
      regionOrStateOfBirth,
      cityOfBirth,
      identificationNumber,
      status,
      clubId,
    } = req.body;

    // Check if player already exists
    const existingPlayer = await prisma.player.findUnique({
      where: { identificationNumber },
    });

    if (existingPlayer) {
      return res.status(400).json({ message: 'Player already exists with this identification number' });
    }

    // Create player
    const player = await prisma.player.create({
      data: {
        familyName,
        firstName,
        languageOfTheName,
        dateOfBirth,
        gender,
        countryOfBirth,
        mainNationality,
        secondaryNationality,
        regionOrStateOfBirth,
        cityOfBirth,
        identificationNumber,
        status,
        clubId,
      },
    });

    res.status(201).json({
      message: 'Player registered successfully',
      player,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPlayers = async (req: AuthRequest, res: Response) => {
  try {
    const players = await prisma.player.findMany({
      include: {
        club: true,
      },
    });

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPlayerById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        club: true,
      },
    });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
