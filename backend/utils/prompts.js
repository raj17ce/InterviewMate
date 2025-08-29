// utils/prompts.js

/**
 * Generate interview question prompt
 * @param {number} currentQuestion - current question number
 * @param {number} totalQuestions - total number of questions in interview
 * @param {string} lastAnswer - candidate's previous answer
 * @param {string} technology - technology for which interview is being conducted
 */
function getQuestionPrompt(currentQuestion, totalQuestions, lastAnswer, technology) {
  return `
    You are an AI interviewer for a ${technology} developer position.
    You are currently on question ${currentQuestion} out of ${totalQuestions}.

    The candidate's previous question was:
    "${lastAnswer}"

    Based on this answer, create the next valuable interview question.
    - The question should build on or challenge what the candidate said.
    - If the answer is strong, go deeper into advanced concepts.
    - By the end of ${totalQuestions} questions we must have covered: fundamentals, advanced concepts, problem solving, performance, testing, architecture, and best practices (adapted for ${technology}).

    Only return the next question text, nothing else. Don't include delimiters or anything since this will be converted to speech for the candidate to hear.
  `;
}

/**
 * Generate evaluation prompt for a candidate's answer
 * @param {string} question - the question asked
 * @param {string} answer - candidate's answer
 * @param {string} technology - technology for which interview is being conducted
 */
function getEvaluationPrompt(question, answer, technology) {
  return `
    You are an expert technical interviewer for a ${technology} developer position.  

    Question asked:  
    "${question}"  

    Candidate's answer:  
    "${answer}"  

    Evaluate the candidate’s response carefully.  
    - Give a score between 0 and 10 (0 = completely incorrect/irrelevant, 10 = excellent, complete, and insightful).  
    - Consider correctness, depth, clarity, problem-solving ability, and relevance to ${technology}.  
    - Provide a short justification (1-2 sentences) for the score.  

    Format your response as:  
    Score: X  
    Reason: <short explanation>
  `;
}

module.exports = {
  getQuestionPrompt,
  getEvaluationPrompt,
};
