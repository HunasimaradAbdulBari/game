// src/app/api/generate-experiment/route.js - DEBUG VERSION with Better Error Handling
import { NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get available equipment for each subject
const getSubjectEquipment = (subject) => {
  const equipmentBySubject = {
    physics: [
      'pendulum', 'stopwatch', 'protractor', 'scale', 'spring', 'weights', 
      'ruler', 'compass', 'incline', 'resistor', 'voltmeter', 'ammeter', 
      'battery', 'wires', 'switch', 'bulb', 'capacitor', 'diode', 'transformer',
      'wire', 'clamp', 'meter-rule', 'micrometer', 'caliper', 'pulley', 'stand', 'lever'
    ],
    chemistry: [
      'burette', 'acid', 'base', 'indicator', 'beaker', 'pipette', 'flask', 
      'stirrer', 'dropper', 'salt-solution', 'bunsen-burner', 'filter-paper', 
      'tripod', 'wire-gauze', 'funnel', 'watch-glass', 'stirring-rod',
      'condenser', 'round-flask', 'catalyst', 'solvent', 'thermometer', 
      'heating-mantle', 'separatory-funnel', 'rotary-evaporator', 'distillation-column'
    ],
    electronics: [
      'led', 'resistor', 'battery', 'wires', 'switch', 'breadboard', 'potentiometer',
      'capacitor', 'transistor', 'oscilloscope', 'signal-generator', 'multimeter',
      'inductor', 'transformer', 'speaker', 'and-gate', 'or-gate', 'input-switches',
      'logic-probe', 'not-gate', 'nand-gate', 'xor-gate', 'flip-flop', 'counter', 'decoder'
    ]
  };
  
  return equipmentBySubject[subject] || equipmentBySubject.physics;
};

// Create enhanced prompt with freshness parameters
const createFreshPrompt = (level, subject, freshnessSeed, variationPrompt, usedQuestions, attemptNumber) => {
  const availableEquipment = getSubjectEquipment(subject);
  const equipmentList = availableEquipment.join(', ');
  
  const difficultyMap = {
    1: 'beginner (use 3-4 basic equipment items)',
    2: 'intermediate (use 4-5 equipment items with some complexity)',
    3: 'advanced (use 5-6 equipment items with detailed procedures)'
  };
  
  const difficulty = difficultyMap[level] || difficultyMap[1];
  
  // Create context about previously used questions
  let avoidanceContext = '';
  if (usedQuestions && usedQuestions.length > 0) {
    avoidanceContext = `\n\nIMPORTANT - AVOID REPETITION:
Previous questions to avoid repeating:
${usedQuestions.map((q, i) => `${i + 1}. "${q.request}" - Required: [${q.required?.join(', ')}]`).join('\n')}

Make sure your new question is COMPLETELY DIFFERENT from all the above questions. Use different experiments, different approaches, and different equipment combinations.`;
  }

  // Add freshness injection
  const creativityPrompts = [
    'Think outside the box and create something unexpected',
    'Focus on real-world applications that students can relate to',
    'Design an experiment that demonstrates surprising phenomena',
    'Create a hands-on investigation that reveals hidden principles',
    'Make an engaging experiment that feels like discovery'
  ];
  
  const randomCreativity = creativityPrompts[freshnessSeed % creativityPrompts.length];

  return `You are a creative science teacher creating lab experiments for students. Generate a completely fresh and unique ${subject} experiment for ${difficulty} level.

FRESHNESS SEED: ${freshnessSeed}
CREATIVITY DIRECTION: ${randomCreativity}
VARIATION FOCUS: ${variationPrompt}
ATTEMPT NUMBER: ${attemptNumber}

Available equipment: ${equipmentList}

Requirements:
1. Create ONE completely unique experiment question that a teacher would ask
2. Select ONLY equipment from the available list above
3. Choose 3-6 items that are actually needed for this specific experiment
4. Make sure the experiment is realistic, educational, and DIFFERENT from common experiments
5. Keep the teacher's request under 25 words but make it engaging
6. Focus on ${level === 1 ? 'basic concepts with interesting twists' : level === 2 ? 'intermediate principles with practical applications' : 'advanced techniques with real-world relevance'}
7. Be creative and avoid typical textbook experiments${avoidanceContext}

CRITICAL: Create something FRESH and INNOVATIVE. Don't use overused experiments like "simple pendulum" or "basic LED circuit" unless you can make them uniquely interesting.

IMPORTANT: Respond ONLY with valid JSON in this exact format (no extra text):
{
  "request": "Teacher's engaging question asking for specific equipment (under 25 words)",
  "required": ["item1", "item2", "item3"],
  "title": "Creative experiment name"
}

Example for physics level 2:
{
  "request": "I need equipment to investigate how different materials affect electromagnetic induction strength.",
  "required": ["transformer", "ammeter", "wire", "scale"],
  "title": "Material Effects on Electromagnetic Induction"
}`;
};

export async function POST(request) {
  console.log('🚀 API Route Called: /api/generate-experiment');
  
  try {
    // Log environment check
    const hasGroqKey = !!process.env.GROQ_API_KEY;
    console.log('🔑 Groq API Key Present:', hasGroqKey);
    
    if (!hasGroqKey) {
      console.error('❌ GROQ_API_KEY environment variable is missing');
      return NextResponse.json(
        { error: 'GROQ_API_KEY environment variable is missing' },
        { status: 500 }
      );
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('📦 Request Body:', requestBody);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { 
      level, 
      subject, 
      freshnessSeed, 
      variationPrompt, 
      usedQuestions, 
      attemptNumber 
    } = requestBody;
    
    // Validate input
    if (!level || !subject) {
      console.error('❌ Missing required fields:', { level, subject });
      return NextResponse.json(
        { error: 'Level and subject are required' },
        { status: 400 }
      );
    }

    if (![1, 2, 3].includes(level)) {
      console.error('❌ Invalid level:', level);
      return NextResponse.json(
        { error: 'Level must be 1, 2, or 3' },
        { status: 400 }
      );
    }

    if (!['physics', 'chemistry', 'electronics'].includes(subject)) {
      console.error('❌ Invalid subject:', subject);
      return NextResponse.json(
        { error: 'Subject must be physics, chemistry, or electronics' },
        { status: 400 }
      );
    }

    // Create enhanced fresh prompt
    const prompt = createFreshPrompt(
      level, 
      subject, 
      freshnessSeed || Date.now(), 
      variationPrompt || 'Create something unique', 
      usedQuestions || [], 
      attemptNumber || 1
    );

    console.log(`🎯 Generating fresh question for ${subject} level ${level} (attempt ${attemptNumber || 1})`);

    // Prepare Groq API request
    const groqRequestBody = {
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9, // Increased for more creativity
      max_tokens: 400,  // More tokens for detailed responses
      top_p: 0.95,      // Higher for more diverse outputs
      frequency_penalty: 0.7, // Penalize repetitive patterns
      presence_penalty: 0.6   // Encourage new topics
    };

    console.log('📡 Calling Groq API...');

    // Call Groq API with enhanced parameters for more creativity
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groqRequestBody)
    });

    console.log('📡 Groq API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API Error Details:', errorText);
      return NextResponse.json(
        { 
          error: 'Groq API call failed', 
          details: errorText,
          status: response.status 
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('🤖 Raw Groq Response:', JSON.stringify(data, null, 2));
    
    const aiResponse = data.choices[0]?.message?.content?.trim();
    
    if (!aiResponse) {
      console.error('❌ No content in AI response');
      return NextResponse.json(
        { error: 'No response content from AI' },
        { status: 500 }
      );
    }

    console.log('🤖 AI Response Content:', aiResponse);

    // Parse the JSON response
    let experimentData;
    try {
      // Clean the response - remove any markdown formatting
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      console.log('🧹 Cleaned Response:', cleanResponse);
      experimentData = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      console.error('❌ Raw AI Response:', aiResponse);
      return NextResponse.json(
        { 
          error: 'Invalid JSON response from AI', 
          aiResponse: aiResponse.substring(0, 500) // Show first 500 chars for debugging
        },
        { status: 500 }
      );
    }

    console.log('✅ Parsed Experiment Data:', experimentData);

    // Validate the response
    if (!experimentData.request || !experimentData.required || !Array.isArray(experimentData.required)) {
      console.error('❌ Invalid experiment data format:', experimentData);
      return NextResponse.json(
        { 
          error: 'Invalid experiment data format',
          received: experimentData 
        },
        { status: 500 }
      );
    }

    // Ensure all required items exist in available equipment
    const availableEquipment = getSubjectEquipment(subject);
    const validRequired = experimentData.required.filter(item => 
      availableEquipment.includes(item)
    );

    if (validRequired.length === 0) {
      console.error('❌ No valid equipment in AI response:', experimentData.required);
      return NextResponse.json(
        { 
          error: 'No valid equipment in AI response',
          aiRequired: experimentData.required,
          availableEquipment: availableEquipment 
        },
        { status: 500 }
      );
    }

    console.log('✅ Generated fresh question:', experimentData.request);
    console.log('🔧 Required equipment:', validRequired.join(', '));

    // Return the validated experiment data
    const finalResponse = {
      title: experimentData.title || `${subject.charAt(0).toUpperCase() + subject.slice(1)} Experiment`,
      request: experimentData.request,
      required: validRequired,
      freshness: {
        seed: freshnessSeed,
        attempt: attemptNumber,
        timestamp: Date.now()
      },
      debug: {
        originalRequired: experimentData.required,
        validRequired: validRequired,
        availableCount: availableEquipment.length
      }
    };

    console.log('🎉 SUCCESS: Returning AI-generated question');
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('💥 Unexpected error in API route:', error);
    return NextResponse.json(
      { 
        error: 'Unexpected server error', 
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint requires a POST request with level and subject' },
    { status: 405 }
  );
}