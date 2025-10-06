import { GoogleGenAI } from '@google/genai';
import type { SurveyData } from '../types';
import { SURVEY_QUESTIONS, MAX_SCORE } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function calculateScore(answers: (number | null)[]): number {
  return answers.reduce((total, answerIndex, questionIndex) => {
    if (answerIndex !== null) {
      const question = SURVEY_QUESTIONS[questionIndex];
      const points = question.options[answerIndex].points;
      return total + points;
    }
    return total;
  }, 0);
}

export async function generateSurveyEmail(surveyData: SurveyData): Promise<string> {
  const { contactInfo, answers } = surveyData;
  const totalScore = calculateScore(answers);

  const detailedAnswers = answers.map((answerIndex, questionIndex) => {
    const question = SURVEY_QUESTIONS[questionIndex];
    if (answerIndex !== null) {
      const answer = question.options[answerIndex];
      return `Q${questionIndex + 1}: ${question.text} - ${answer.text} (Score: ${answer.points})`;
    }
    return `Q${questionIndex + 1}: ${question.text} - No answer provided (Score: 0)`;
  }).join('\n');

  const prompt = `
    You are an assistant that formats survey results into a professional email for internal use.
    Generate an email with a subject line and a body based on the following survey data.
    The recipients of this email are info@demo.com and ali@openmindi.co.za.
    
    Format the output as a single block of text. Start with "Subject: " followed by the subject line. Then, add two newlines and continue with the email body. Do not add any other text, greetings, or explanations.

    **Survey Data:**
    - Full Name: ${contactInfo.fullName}
    - Phone: ${contactInfo.phone}
    - Email: ${contactInfo.email}
    - Total Score: ${totalScore}/${MAX_SCORE}
    - Detailed Answers:
    ${detailedAnswers}

    **Required Email Format:**

    Subject: New Fundability Test Submission from ${contactInfo.fullName}

    Respondent's Full Name: ${contactInfo.fullName}
    Phone: ${contactInfo.phone}
    Email: ${contactInfo.email}

    Fundability Test Results:
    Total Score: ${totalScore}/${MAX_SCORE}

    Detailed Answers:
    ${detailedAnswers}

    Optional Note: Follow up with this lead based on their score and responses.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate email content.");
  }
}