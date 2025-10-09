// src/services/labGameStorageService.js

/**
 * Lab Game Data Structure
 */
export const LabGameData = {
  userId: '',
  gameId: '',
  score: 0,
  subject: '',
  level: 0,
  questionAnswers: [],
  playerName: '',
  correctAnswers: 0,
  wrongAnswers: 0,
  totalQuestions: 0,
  percentage: 0,
  passed: false
};

/**
 * Leaderboard Entry Structure
 */
export const LeaderboardEntry = {
  userId: '',
  playerName: '',
  score: 0,
  percentage: 0,
  correctAnswers: 0,
  totalQuestions: 0,
  timestamp: 0,
  gameId: '',
  subject: '',
  level: 0
};

const STORAGE_KEY = 'lab_quest_game_data';
const LEADERBOARD_KEY = 'lab_quest_leaderboard';

/**
 * Save game data to localStorage
 */
export function saveGameData(gameData) {
  try {
    if (typeof window === 'undefined') return false;
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const userKey = `${gameData.userId}_${gameData.gameId}`;
    existingData[userKey] = gameData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    // Also save to leaderboard
    saveToLeaderboard(gameData);
    return true;
  } catch (error) {
    console.error('Error saving game data:', error);
    return false;
  }
}

/**
 * Load game data from localStorage
 */
export function loadGameData(userId, gameId) {
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

/**
 * Remove game data from localStorage
 */
export function removeGameData(userId, gameId) {
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

/**
 * Save score to leaderboard
 */
export function saveToLeaderboard(gameData) {
  try {
    if (typeof window === 'undefined') return false;
    const leaderboard = getLeaderboard();
    const entry = {
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

    // Add new entry
    leaderboard.push(entry);

    // Sort by score (highest first), then by percentage, then by timestamp (most recent first)
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return b.timestamp - a.timestamp;
    });

    // Keep only top 10 entries
    const topLeaderboard = leaderboard.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topLeaderboard));
    return true;
  } catch (error) {
    console.error('Error saving to leaderboard:', error);
    return false;
  }
}

/**
 * Get leaderboard data
 */
export function getLeaderboard() {
  try {
    if (typeof window === 'undefined') return [];
    const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    
    // If leaderboard is empty, add some sample data for testing
    if (leaderboard.length === 0) {
      const sampleData = [
        {
          userId: 'player1',
          playerName: 'Snake Master',
          score: 2500,
          percentage: 95,
          correctAnswers: 19,
          totalQuestions: 20,
          timestamp: Date.now() - 86400000, // 1 day ago
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
          timestamp: Date.now() - 172800000, // 2 days ago
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
          timestamp: Date.now() - 259200000, // 3 days ago
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

/**
 * Clear all game data
 */
export function clearAllGameData() {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing game data:', error);
    return false;
  }
}

/**
 * Clear leaderboard
 */
export function clearLeaderboard() {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(LEADERBOARD_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return false;
  }
}

/**
 * Get all game data
 */
export function getAllGameData() {
  try {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    console.error('Error loading all game data:', error);
    return {};
  }
}

/**
 * Generate a unique user ID
 */
export function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

/**
 * Format date for display
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
