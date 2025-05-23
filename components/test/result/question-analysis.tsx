import React from 'react';
import Image from 'next/image';

interface QuestionAnalysisItemProps {
  questionText: string;
  options: string[];
  correctOption: number;
  selectedOption: number;
  isCorrect: boolean;
}

// Helper function to check if content is an image URL
const isImageUrl = (str: string) => {
  return str.match(/\.(jpeg|jpg|gif|png)$/) !== null || 
         (str.startsWith('http') && (str.includes('/images/') || str.includes('/img/')));
};

// Component to render content (text or image)
const ContentRenderer = ({ content }: { content: string }) => {
  if (isImageUrl(content)) {
    return (
      <div className="flex justify-center my-2">
        <Image 
          src={content} 
          alt="Question content" 
          width={500} 
          height={300} 
          className="max-w-full object-contain rounded-md"
          unoptimized // For external images
        />
      </div>
    );
  }
  return <span>{content}</span>;
};

const QuestionAnalysis = ({ 
  questionAnalysis 
}: { 
  questionAnalysis: QuestionAnalysisItemProps[] 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Question Analysis</h2>
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
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-foreground">
                  Question {index + 1}
                </h3>
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    question.isCorrect 
                      ? 'bg-green-500/20 text-green-500 dark:text-green-400' 
                      : 'bg-red-500/20 text-red-500 dark:text-red-400'
                  }`}
                >
                  {question.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <div className="mb-4 text-foreground">
                <ContentRenderer content={question.questionText} />
              </div>
              
              <div className="space-y-3">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={optIndex} 
                    className={`p-3 rounded-md flex items-center ${
                      optIndex === question.correctOption
                        ? 'bg-green-500/10 border border-green-500/20 text-foreground'
                        : optIndex === question.selectedOption && !question.isCorrect
                          ? 'bg-red-500/10 border border-red-500/20 text-foreground'
                          : 'bg-muted border border-border text-foreground'
                    }`}
                  >
                    <div className="flex-1">
                      <ContentRenderer content={option} />
                    </div>
                    <div className="flex items-center">
                      {optIndex === question.correctOption && (
                        <span className="text-green-500 dark:text-green-400 ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      {optIndex === question.selectedOption && optIndex !== question.correctOption && (
                        <span className="text-red-500 dark:text-red-400 ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {!question.isCorrect && question.selectedOption === -1 && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                  <p className="text-blue-500 dark:text-blue-400 font-medium">Not attempted</p>
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