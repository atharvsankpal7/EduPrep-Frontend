import type {
  EngineTest,
  SubmitTestPayload,
  TestResponse,
} from "@/types/global/interface/test.apiInterface";

const resolveId = (entity: { id?: string; _id?: string }, fallback: string) =>
  entity.id ?? entity._id ?? fallback;

export const normalizeEngineTest = (
  response: TestResponse,
  fallbackId: string
): EngineTest => {
  const rawTest = response.test;
  const testId = resolveId(rawTest, fallbackId);

  return {
    id: testId,
    testName: rawTest.testName,
    totalDuration: rawTest.totalDuration,
    totalQuestions: rawTest.totalQuestions,
    sections: rawTest.sections.map((section, sectionIndex) => ({
      id: `${testId}-section-${sectionIndex + 1}`,
      sectionName: section.sectionName,
      sectionDuration: section.sectionDuration,
      questions: section.questions.map((question, questionIndex) => ({
        id: resolveId(
          question,
          `${testId}-q-${sectionIndex + 1}-${questionIndex + 1}`
        ),
        questionText: question.questionText,
        imageUrl: question.imageUrl,
        options: question.options,
      })),
    })),
  };
};

interface BuildSubmissionPayloadArgs {
  test: EngineTest;
  answers: Record<string, number>;
  timeTakenSeconds: number;
  isAutoSubmitted: boolean;
  tabSwitches: number;
}

export const buildSubmissionPayload = ({
  test,
  answers,
  timeTakenSeconds,
  isAutoSubmitted,
  tabSwitches,
}: BuildSubmissionPayloadArgs): SubmitTestPayload => {
  const selectedAnswers: SubmitTestPayload["selectedAnswers"] = [];

  for (const section of test.sections) {
    for (const question of section.questions) {
      const selectedOption = answers[question.id];
      selectedAnswers.push({
        questionId: question.id,
        selectedOption:
          selectedOption === undefined ? -1 : Math.max(0, selectedOption) + 1,
        sectionName: section.sectionName,
      });
    }
  }

  return {
    selectedAnswers,
    timeTaken: Math.max(0, Math.floor(timeTakenSeconds)),
    autoSubmission: {
      isAutoSubmitted,
      tabSwitches,
    },
  };
};
