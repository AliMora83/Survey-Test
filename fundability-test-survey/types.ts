export interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
}

export type ContactInfoErrors = Partial<Record<keyof ContactInfo, string>>;

export interface AnswerOption {
  text: string;
  points: number;
}

export interface Question {
  text: string;
  options: AnswerOption[];
}

export interface SurveyData {
  contactInfo: ContactInfo;
  answers: (number | null)[];
}