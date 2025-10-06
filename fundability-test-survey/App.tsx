import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SURVEY_QUESTIONS, TOTAL_QUESTIONS } from './constants';
import type { SurveyData, ContactInfo, ContactInfoErrors } from './types';
import { generateSurveyEmail } from './services/geminiService';
import ContactInfoStep from './components/ContactInfoStep';
import QuestionStep from './components/QuestionStep';
import ProgressBar from './components/ProgressBar';
import { ChevronLeftIcon } from './components/icons/ChevronLeftIcon';

const TOTAL_STEPS = TOTAL_QUESTIONS + 1; // +1 for contact info step

const validateContactInfo = (info: ContactInfo): ContactInfoErrors => {
    const errors: ContactInfoErrors = {};

    if (!info.fullName.trim()) {
        errors.fullName = 'Full Name is required.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!info.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!emailRegex.test(info.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    const phoneDigits = info.phone.replace(/\D/g, '');
    if (!info.phone.trim()) {
        errors.phone = 'Phone number is required.';
    } else if (phoneDigits.length < 10) {
        errors.phone = 'Please enter a valid phone number (at least 10 digits).';
    }
    
    return errors;
};


export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    contactInfo: { fullName: '', phone: '', email: '' },
    answers: new Array(TOTAL_QUESTIONS).fill(null),
  });
  const [contactErrors, setContactErrors] = useState<ContactInfoErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContactInfoChange = useCallback((contactInfo: ContactInfo) => {
    setSurveyData((prev) => ({ ...prev, contactInfo }));
     // If errors are already visible, re-validate on change for instant feedback
    if (Object.keys(contactErrors).length > 0) {
        setContactErrors(validateContactInfo(contactInfo));
    }
  }, [contactErrors]);

  const handleContactInfoBlur = useCallback(() => {
    setContactErrors(validateContactInfo(surveyData.contactInfo));
  }, [surveyData.contactInfo]);

  const handleAnswerChange = useCallback((questionIndex: number, answerIndex: number) => {
    setSurveyData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[questionIndex] = answerIndex;
      return { ...prev, answers: newAnswers };
    });
  }, []);
  
  const isContactInfoValid = useMemo(() => {
    const { fullName, email, phone } = surveyData.contactInfo;
    if (fullName.trim() === '' || email.trim() === '' || phone.trim() === '') {
        return false;
    }
    return Object.keys(validateContactInfo(surveyData.contactInfo)).length === 0;
  }, [surveyData.contactInfo]);

  const isCurrentQuestionAnswered = useMemo(() => {
    if (currentStep > 0 && currentStep <= TOTAL_QUESTIONS) {
      return surveyData.answers[currentStep - 1] !== null;
    }
    return true;
  }, [currentStep, surveyData.answers]);

  const handleNext = () => {
    if (currentStep === 0) {
        const errors = validateContactInfo(surveyData.contactInfo);
        if (Object.keys(errors).length > 0) {
            setContactErrors(errors);
            return; 
        }
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const emailContent = await generateSurveyEmail(surveyData);
      // In a real app, you would send this email via a backend service.
      // For this demo, we'll log it to the console.
      console.log("--- SIMULATED EMAIL ---");
      console.log(emailContent);
      console.log("-----------------------");
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to generate survey summary:", err);
      setError("An error occurred while submitting your survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep = () => {
    if (isSubmitted) {
      return (
        <div className="text-center p-8">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 className="text-2xl font-bold text-slate-800 mt-4">Thank You!</h2>
          <p className="text-slate-600 mt-2">Thank you for taking the time to complete this survey. We'll reach out to you shortly.</p>
        </div>
      );
    }
    
    if (currentStep === 0) {
      return (
        <ContactInfoStep 
            contactInfo={surveyData.contactInfo} 
            onChange={handleContactInfoChange}
            onBlur={handleContactInfoBlur}
            errors={contactErrors}
        />
      );
    }
    
    const questionIndex = currentStep - 1;
    if (questionIndex < TOTAL_QUESTIONS) {
      return (
        <QuestionStep
          question={SURVEY_QUESTIONS[questionIndex]}
          questionIndex={questionIndex}
          selectedAnswerIndex={surveyData.answers[questionIndex]}
          onAnswerChange={handleAnswerChange}
        />
      );
    }
    
    return null;
  };
  
  const isNextDisabled = currentStep === 0 ? !isContactInfoValid : !isCurrentQuestionAnswered;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Fundability Test</h1>
          <p className="text-slate-500 mt-2">Assess your company's potential in just a few minutes.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl transition-all duration-500">
          <div className="p-6 border-b border-slate-200">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>
          
          <div className="p-8 min-h-[300px] flex flex-col justify-center">
            {renderStep()}
          </div>
          
          {!isSubmitted && (
             <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-6 py-2 text-sm font-semibold text-slate-700 bg-transparent rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <ChevronLeftIcon />
                  Back
                </button>
                
                {currentStep < TOTAL_STEPS -1 ? (
                  <button
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                   Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:bg-green-300 disabled:cursor-wait flex items-center gap-2 transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                  </button>
                )}
             </div>
          )}
          {error && <p className="text-red-500 text-sm p-4 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}