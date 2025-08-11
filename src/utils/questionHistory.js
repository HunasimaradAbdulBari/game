// src/utils/questionHistory.js - Question History Management Utilities

/**
 * Clear question history for a specific subject and level
 * @param {string} subject - The subject (physics, chemistry, electronics)
 * @param {number} level - The level (1, 2, 3)
 */
export const clearQuestionHistory = (subject, level) => {
  if (typeof window === 'undefined') return;
  
  try {
    const historyKey = `question_history_${subject}_${level}`;
    sessionStorage.removeItem(historyKey);
    console.log(`🗑️ Cleared question history for ${subject} level ${level}`);
  } catch (error) {
    console.warn('Could not clear question history:', error);
  }
};

/**
 * Clear all question history for all subjects and levels
 */
export const clearAllQuestionHistory = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const subjects = ['physics', 'chemistry', 'electronics'];
    const levels = [1, 2, 3];
    
    subjects.forEach(subject => {
      levels.forEach(level => {
        clearQuestionHistory(subject, level);
      });
    });
    
    console.log('🗑️ Cleared all question history');
  } catch (error) {
    console.warn('Could not clear all question history:', error);
  }
};

/**
 * Get question history statistics
 */
export const getQuestionHistoryStats = () => {
  if (typeof window === 'undefined') return {};
  
  const stats = {};
  const subjects = ['physics', 'chemistry', 'electronics'];
  const levels = [1, 2, 3];
  
  subjects.forEach(subject => {
    stats[subject] = {};
    levels.forEach(level => {
      try {
        const historyKey = `question_history_${subject}_${level}`;
        const history = JSON.parse(sessionStorage.getItem(historyKey) || '[]');
        stats[subject][level] = {
          count: history.length,
          lastUpdated: history.length > 0 ? Math.max(...history.map(q => q.timestamp)) : null
        };
      } catch {
        stats[subject][level] = { count: 0, lastUpdated: null };
      }
    });
  });
  
  return stats;
};

/**
 * Export question history for debugging
 */
export const exportQuestionHistory = () => {
  if (typeof window === 'undefined') return null;
  
  const allHistory = {};
  const subjects = ['physics', 'chemistry', 'electronics'];
  const levels = [1, 2, 3];
  
  subjects.forEach(subject => {
    allHistory[subject] = {};
    levels.forEach(level => {
      try {
        const historyKey = `question_history_${subject}_${level}`;
        const history = JSON.parse(sessionStorage.getItem(historyKey) || '[]');
        allHistory[subject][level] = history;
      } catch {
        allHistory[subject][level] = [];
      }
    });
  });
  
  return allHistory;
};