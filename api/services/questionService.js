import { convertJsonToModel } from "../models/question";

export async function getQuestionsBySurveyId(surveyId) {
  const mockQuestions = [
    { id: 1, questionText: "What is your favorite color?", type: "text", options: ["Red", "Blue", "Green", "Yellow"] },
    { id: 2, questionText: "What is your favorite animal?", type: "text", options: ["Dog", "Cat", "Bird", "Fish"] },
    { id: 3, questionText: "What is your favorite food?", type: "text", options: ["Pizza", "Burger", "Sushi", "Pasta"] }
  ];
  var questions = convertJsonToModel(mockQuestions);
  return questions;
}

export async function saveQuestion(question) {
  const mockQuestion = {
    id: 1,
    questionText: "What is your favorite color?",
    type: "text",
    options: ["Red", "Blue", "Green", "Yellow"]
  };
  var question = convertJsonToModel(mockQuestion);
  return question;
}