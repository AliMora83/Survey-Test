
import type { Question } from './types';

export const SURVEY_QUESTIONS: Question[] = [
  {
    text: "Does your company have at least one significant competitive advantage?",
    options: [
      { text: "Yes", points: 10 },
      { text: "No", points: 0 },
    ],
  },
  {
    text: "Does your company have proprietary technology or intellectual property (IP)?",
    options: [
      { text: "Yes", points: 10 },
      { text: "No", points: 0 },
    ],
  },
  {
    text: "What are your current annual revenues?",
    options: [
      { text: "$0 - $85,000", points: 0 },
      { text: "$86,000 - $116,000", points: 5 },
      { text: "$117,000 - $300,000", points: 10 },
      { text: "$301,000+", points: 10 },
    ],
  },
  {
    text: "Do you live in the United States?",
    options: [
      { text: "Yes", points: 10 },
      { text: "No", points: 0 },
    ],
  },
  {
    text: "Estimate of your net profits?",
    options: [
      { text: "$0 - $40K", points: 0 },
      { text: "$50K - $150K", points: 5 },
      { text: "$250K - $500K", points: 10 },
      { text: "$500K+", points: 10 },
    ],
  },
  {
    text: "Have you raised from Friends and Family (i.e. seed round)?",
    options: [
      { text: "Yes", points: 10 },
      { text: "No", points: 0 },
    ],
  },
  {
    text: "Do you currently have institutional investors?",
    options: [
      { text: "Yes", points: 10 },
      { text: "No", points: 0 },
    ],
  },
  {
    text: "What is your addressable market size?",
    options: [
      { text: "Less than $200 million per year", points: 0 },
      { text: "More than $200 million per year", points: 10 },
    ],
  },
  {
    text: "What is your anticipated capital need in the next year?",
    options: [
      { text: "Less than $5 million", points: 10 },
      { text: "More than $5 million", points: 0 },
    ],
  },
  {
    text: "How much combined work experience do the founders have?",
    options: [
      { text: "10 years", points: 0 },
      { text: "15 years", points: 5 },
      { text: "20 years +", points: 10 },
    ],
  },
  {
    text: "How much combined C-suite operational experience do the founders have?",
    options: [
      { text: "1-3 years", points: 0 },
      { text: "4-6 years", points: 5 },
      { text: "7-9 years", points: 10 },
      { text: "10-12 years", points: 10 },
    ],
  },
];

export const TOTAL_QUESTIONS = SURVEY_QUESTIONS.length;
export const MAX_SCORE = SURVEY_QUESTIONS.reduce((sum, q) => {
    const maxPoints = Math.max(...q.options.map(opt => opt.points));
    return sum + maxPoints;
}, 0);
