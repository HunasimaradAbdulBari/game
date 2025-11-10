// src/services/labGameStorageService.ts
import { LabGameData, LeaderboardEntry } from '../types';

const STORAGE_KEY = 'lab_quest_game_data';
const LEADERBOARD_KEY = 'lab_quest_leaderboard';

export function saveGameData(gameData: LabGameData): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const userKey = `${gameData.userId}_${gameData.gameId}`;
    existingData[userKey] = gameData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    saveToLeaderboard(gameData);
    return true;
  } catch (error) {
    console.error('Error saving game data:', error);
    return false;
  }
}

export function loadGameData(userId: string, gameId: string): LabGameData | null {
  try {
    if (typeof window === 'undefined') return null;
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const userKey = `${userId}_${gameId}`;
    return existingData[userKey] || null;
  } catch (error) {
    console.error('Error loading game data:', error);
    return null;
  }
}

export function removeGameData(userId: string, gameId: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const userKey = `${userId}_${gameId}`;
    delete existingData[userKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    return true;
  } catch (error) {
    console.error('Error removing game data:', error);
    return false;
  }
}

export function saveToLeaderboard(gameData: LabGameData): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const leaderboard = getLeaderboard();
    const entry: LeaderboardEntry = {
      userId: gameData.userId,
      playerName: gameData.playerName || `Player ${gameData.userId.slice(-4)}`,
      score: gameData.score,
      percentage: gameData.percentage || 0,
      correctAnswers: gameData.correctAnswers || 0,
      totalQuestions: gameData.totalQuestions || 0,
      timestamp: Date.now(),
      gameId: gameData.gameId,
      subject: gameData.subject || 'physics',
      level: gameData.level || 1
    };

    leaderboard.push(entry);

    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return b.timestamp - a.timestamp;
    });

    const topLeaderboard = leaderboard.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topLeaderboard));
    return true;
  } catch (error) {
    console.error('Error saving to leaderboard:', error);
    return false;
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    if (typeof window === 'undefined') return [];
    const leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    
    if (leaderboard.length === 0) {
      const sampleData: LeaderboardEntry[] = [
        {
          userId: 'player1',
          playerName: 'Snake Master',
          score: 2500,
          percentage: 95,
          correctAnswers: 19,
          totalQuestions: 20,
          timestamp: Date.now() - 86400000,
          gameId: 'snakegame',
          subject: 'physics',
          level: 5
        },
        {
          userId: 'player2',
          playerName: 'Quiz Champion',
          score: 2200,
          percentage: 88,
          correctAnswers: 17,
          totalQuestions: 20,
          timestamp: Date.now() - 172800000,
          gameId: 'snakegame',
          subject: 'physics',
          level: 4
        },
        {
          userId: 'player3',
          playerName: 'Physics Pro',
          score: 1800,
          percentage: 82,
          correctAnswers: 16,
          totalQuestions: 20,
          timestamp: Date.now() - 259200000,
          gameId: 'snakegame',
          subject: 'physics',
          level: 3
        }
      ];
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sampleData));
      return sampleData;
    }
    
    return leaderboard;
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return [];
  }
}

export function clearAllGameData(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing game data:', error);
    return false;
  }
}

export function clearLeaderboard(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(LEADERBOARD_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return false;
  }
}

export function getAllGameData(): Record<string, LabGameData> {
  try {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    console.error('Error loading all game data:', error);
    return {};
  }
}

export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}