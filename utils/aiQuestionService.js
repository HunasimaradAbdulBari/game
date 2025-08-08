// utils/aiQuestionService.js - AI Question Generation Utility (Bug-Free Final Version)
export const getExperimentQuestion = async (subject, level) => {
  try {
    // Validate inputs
    if (!subject || !level) {
      throw new Error('Subject and level are required');
    }

    console.log(`🔬 Fetching AI question for ${subject} level ${level}`);

    // Make API call to our backend
    const response = await fetch('/api/generate-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: subject.toLowerCase(),
        level: parseInt(level)
      }),
    });

    console.log(`📡 API Response Status: ${response.status}`);

    // Handle response - Only parse JSON once
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        console.error('❌ API Error Details:', errorData);
      } catch (parseError) {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
        console.error('❌ Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    // Parse successful response
    let data;
    try {
      data = await response.json();
      console.log('✅ AI Response received:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse success response:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!data || !data.success || !data.question) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response format or missing question');
    }

    console.log('🎯 Successfully generated AI question');
    return {
      success: true,
      question: data.question,
      subject: data.subject,
      level: data.level,
      difficulty: data.difficulty
    };

  } catch (error) {
    console.error('❌ Error fetching experiment question:', error);
    
    // Return fallback question based on subject and level if API fails
    const fallbackQuestions = {
      physics: {
        1: "I need equipment to measure the period of a simple pendulum and analyze its motion patterns.",
        2: "Help me gather instruments to verify the relationship between current, voltage, and resistance in electrical circuits.",
        3: "I need precision equipment to calculate the elasticity and stress-strain relationship of different materials."
      },
      chemistry: {
        1: "Prepare equipment for determining the concentration of an unknown acid using standardized base solution.",
        2: "Set up apparatus for growing pure crystals from saturated salt solutions using controlled evaporation.",
        3: "Assemble advanced equipment for synthesizing organic compounds with precise temperature control and purification."
      },
      electronics: {
        1: "Build a simple LED circuit to understand current limiting and basic electronic component behavior.",
        2: "Construct an amplifier circuit to study signal amplification and transistor characteristics using measurement tools.",
        3: "Design and test digital logic circuits using gates and measurement equipment to verify truth tables."
      }
    };

    // Safe fallback access
    const subjectKey = subject?.toLowerCase();
    const fallbackQuestion = (fallbackQuestions[subjectKey] && fallbackQuestions[subjectKey][level]) || 
                             "I need you to help me gather the required equipment for this experiment.";

    console.log(`🔄 Using fallback question for ${subject} level ${level}:`, fallbackQuestion);

    return {
      success: false,
      question: fallbackQuestion,
      subject: subject,
      level: level,
      error: error.message,
      usingFallback: true
    };
  }
};

// Cache implementation
const questionCache = new Map();

export const getCachedExperimentQuestion = async (subject, level) => {
  if (!subject || !level) {
    return await getExperimentQuestion(subject, level);
  }

  const cacheKey = `${subject.toLowerCase()}-${parseInt(level)}`;
  
  // Check cache first
  try {
    if (questionCache.has(cacheKey)) {
      const cached = questionCache.get(cacheKey);
      if (cached && cached.timestamp && (Date.now() - cached.timestamp < 5 * 60 * 1000)) {
        console.log(`💾 Using cached question for ${cacheKey}`);
        return cached.data;
      } else {
        questionCache.delete(cacheKey);
        console.log(`⏰ Cache expired for ${cacheKey}`);
      }
    }
  } catch (cacheError) {
    console.warn('⚠️ Cache read error:', cacheError);
  }

  // Get fresh question
  const result = await getExperimentQuestion(subject, level);
  
  // Cache successful results
  try {
    if (result && result.success) {
      questionCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      console.log(`💾 Cached question for ${cacheKey}`);
    }
  } catch (cacheError) {
    console.warn('⚠️ Cache write error:', cacheError);
  }

  return result;
};

export const clearQuestionCache = () => {
  try {
    questionCache.clear();
    console.log('🗑️ Question cache cleared successfully');
  } catch (error) {
    console.warn('⚠️ Error clearing cache:', error);
  }
};
