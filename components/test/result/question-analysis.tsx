// components/test/result/question-analysis.tsx
import React from 'react';

interface QuestionAnalysisItemProps {
  questionText: string;
  options: string[];
  correctOption: number;
  selectedOption: number;
  isCorrect: boolean;
}

const QuestionAnalysis = ({ 
  questionAnalysis 
}: { 
  questionAnalysis: QuestionAnalysisItemProps[] 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Question Analysis</h2>
        <p className="text-muted-foreground mt-1">
          Review your answers and see where you went right or wrong
        </p>
      </div>

      {questionAnalysis.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No question analysis available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questionAnalysis.map((question, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-lg border ${
                question.isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">
                  Question {index + 1}
                </h3>
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    question.isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {question.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <p className="mb-4 text-gray-800">{question.questionText}</p>
              
              <div className="space-y-3">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={optIndex} 
                    className={`p-3 rounded-md flex items-center ${
                      optIndex === question.correctOption
                        ? 'bg-green-100 border border-green-300'
                        : optIndex === question.selectedOption && !question.isCorrect
                          ? 'bg-red-100 border border-red-300'
                          : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <p>{option}</p>
                    </div>
                    <div className="flex items-center">
                      {optIndex === question.correctOption && (
                        <span className="text-green-600 ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      {optIndex === question.selectedOption && optIndex !== question.correctOption && (
                        <span className="text-red-600 ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {!question.isCorrect && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 font-medium">Correct Answer: Option {question.correctOption + 1}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionAnalysis;