const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateNutritionPlan = async (stats) => {
  const { weight, height, age, armMeasurement, legMeasurement, waistMeasurement, workoutsPerWeek, goal } = stats;
  const goalText = goal === 'bulk' ? 'muscle building (bulk/mass)' : 'fat loss (cut/shred)';

  const prompt = `You are a professional nutritionist and fitness coach. Create a detailed, personalized nutrition plan in JSON format.

Client stats:
- Weight: ${weight}kg
- Height: ${height}cm  
- Age: ${age} years
- Arm measurement: ${armMeasurement}cm
- Leg measurement: ${legMeasurement}cm
- Waist measurement: ${waistMeasurement}cm
- Workouts per week: ${workoutsPerWeek}
- Goal: ${goalText}

Return ONLY valid JSON with this exact structure:
{
  "dailyCalories": number,
  "macros": {
    "protein": { "grams": number, "calories": number, "percentage": number },
    "carbs": { "grams": number, "calories": number, "percentage": number },
    "fats": { "grams": number, "calories": number, "percentage": number }
  },
  "meals": [
    {
      "name": "Meal 1 - Breakfast",
      "nameHe": "ארוחת בוקר",
      "time": "7:00-8:00",
      "calories": number,
      "foods": [
        { "name": "Food name", "nameHe": "שם בעברית", "amount": "quantity + unit", "protein": number, "carbs": number, "fats": number, "calories": number }
      ]
    }
  ],
  "hydration": "recommendation",
  "hydrationHe": "המלצה בעברית",
  "supplements": ["supplement1", "supplement2"],
  "supplementsHe": ["תוסף1", "תוסף2"],
  "notes": "general notes about the plan",
  "notesHe": "הערות כלליות"
}

Include 5-6 meals. Be specific with amounts. All in metric units.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 2500
  });

  return JSON.parse(response.choices[0].message.content);
};

const generateWorkoutPlan = async (stats) => {
  const { weight, height, age, workoutsPerWeek, goal } = stats;
  const goalText = goal === 'bulk' ? 'muscle building and strength' : 'fat burning and muscle retention';

  const prompt = `You are an expert personal trainer. Create a personalized A/B split workout plan in JSON format.

Client profile:
- Weight: ${weight}kg, Height: ${height}cm, Age: ${age}
- Workouts per week: ${workoutsPerWeek}
- Goal: ${goalText}

Return ONLY valid JSON with this exact structure:
{
  "planType": "A/B Split",
  "schedule": "description of weekly schedule",
  "scheduleHe": "תיאור לוח זמנים שבועי",
  "workoutA": {
    "name": "Workout A - Push/Chest & Triceps",
    "nameHe": "אימון A - דחיפה/חזה וטריצפס",
    "focus": "muscle groups",
    "focusHe": "קבוצות שרירים",
    "warmup": "5-10 min warmup description",
    "warmupHe": "תיאור חימום",
    "exercises": [
      {
        "name": "Exercise name",
        "nameHe": "שם בעברית",
        "sets": number,
        "reps": "e.g. 8-12",
        "rest": "90 seconds",
        "restHe": "90 שניות",
        "tips": "form tip",
        "tipsHe": "טיפ לטכניקה",
        "youtubeSearch": "exercise name tutorial how to"
      }
    ],
    "cooldown": "5 min cooldown"
  },
  "workoutB": {
    "name": "Workout B - Pull/Back & Biceps",
    "nameHe": "אימון B - משיכה/גב וביצפס",
    "focus": "muscle groups",
    "focusHe": "קבוצות שרירים",
    "warmup": "5-10 min warmup description",
    "warmupHe": "תיאור חימום",
    "exercises": [
      {
        "name": "Exercise name",
        "nameHe": "שם בעברית",
        "sets": number,
        "reps": "e.g. 8-12",
        "rest": "90 seconds",
        "restHe": "90 שניות",
        "tips": "form tip",
        "tipsHe": "טיפ לטכניקה",
        "youtubeSearch": "exercise name tutorial how to"
      }
    ],
    "cooldown": "5 min cooldown"
  },
  "generalTips": ["tip1", "tip2", "tip3"],
  "generalTipsHe": ["טיפ1", "טיפ2", "טיפ3"]
}

Include 6-8 exercises per workout. Make it comprehensive and appropriate for the client.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 3000
  });

  return JSON.parse(response.choices[0].message.content);
};

const chatWithCoach = async (messages, userContext) => {
  const systemPrompt = `You are PumP, a professional AI fitness coach and nutritionist. You speak both English and Hebrew fluently. 
Always respond in the same language the user writes in.
Be motivational, professional, and specific with your advice.
You know about this specific client:
- Goal: ${userContext.goal === 'bulk' ? 'muscle building' : 'fat loss'}
- Weight: ${userContext.weight}kg
- Age: ${userContext.age} years
- Workouts per week: ${userContext.workoutsPerWeek}
Give personalized advice based on their profile. Keep responses concise and actionable.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    max_tokens: 500
  });

  return response.choices[0].message.content;
};

const generateAvatar = async (base64Image) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Create a professional, stylized fitness avatar/character based on this person's appearance. Make it look like a modern fitness app profile picture - athletic, powerful, and motivational. Cartoon/illustration style with dynamic energy. Keep it PG and professional.`,
    n: 1,
    size: '1024x1024',
    quality: 'standard'
  });
  return response.data[0].url;
};

module.exports = { generateNutritionPlan, generateWorkoutPlan, chatWithCoach, generateAvatar };
