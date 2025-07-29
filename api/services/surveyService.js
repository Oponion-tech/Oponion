import { makeApiCall } from '../utillity/apiUtils';
import Survey, { convertJsonToModel } from '../models/survey';

export async function getRecentAnsweredSurveys() {
  const mockSurveys = [
    { id: 1, title: "Favorite Music Genre 2024", description: "What's your favorite music genre this year?", user_id: 201, genre: "Music", votes: "1.2k", points: 150, estimated_time: 2 },
    { id: 2, title: "Best Pizza Toppings", description: "Which pizza toppings do you love the most?", user_id: 202, genre: "Food", votes: "856", points: 95, estimated_time: 1 },
    { id: 3, title: "Preferred Travel Destinations", description: "Where would you like to travel next?", user_id: 203, genre: "Travel", votes: "2.1k", points: 210, estimated_time: 3 }
  ];

  var surveys = convertJsonToModel(mockSurveys);
  return surveys;
}

export async function getSurveyOfTheDay() {
  const mockSurvey = {
    id: 8,
    title: "Survey of the Day: Best Pizza Toppings",
    description: "What are your favorite pizza toppings? This is today's featured survey!",
    user_id: 108,
    genre: "Food & Drink",
    votes: "5.2k",
    points: 750,
    estimated_time: 2
  };
  var survey = convertJsonToModel(mockSurvey);
  return survey;
}

export async function getSurveyById(id) {

}

export async function getSurveyByGenre(genre) {

}

export async function getSurveyByTitle(title) {

}

export async function getDiscorverSurveys() {
  const mockSurveys = [
    { id: 1, title: "Best Programming Language 2024", description: "Which programming language do you prefer for development in 2024?", user_id: 101, genre: "Technology", votes: "3.5k", points: 420, estimated_time: 3 },
    { id: 2, title: "Favorite Movie Genre", description: "What's your go-to movie genre for entertainment?", user_id: 102, genre: "Entertainment", votes: "2.8k", points: 320, estimated_time: 2 },
    { id: 3, title: "Preferred Coffee Type", description: "How do you like your coffee prepared?", user_id: 103, genre: "Food & Drink", votes: "1.9k", points: 180, estimated_time: 1 },
    { id: 4, title: "Best Gaming Console", description: "Which gaming console offers the best gaming experience?", user_id: 104, genre: "Gaming", votes: "4.2k", points: 510, estimated_time: 4 },
    { id: 5, title: "Favorite Social Media Platform", description: "Which social media platform do you use most frequently?", user_id: 105, genre: "Social Media", votes: "3.1k", points: 290, estimated_time: 2 },
    { id: 6, title: "Preferred Workout Type", description: "What type of workout do you enjoy the most?", user_id: 106, genre: "Fitness", votes: "2.3k", points: 270, estimated_time: 3 },
    { id: 7, title: "Best Streaming Service 2024", description: "Which streaming platform offers the best content and user experience?", user_id: 107, genre: "Entertainment", votes: "4.8k", points: 380, estimated_time: 2 },
    { id: 8, title: "Preferred Learning Method", description: "How do you prefer to learn new skills - online courses, books, or hands-on practice?", user_id: 108, genre: "Education", votes: "3.2k", points: 450, estimated_time: 3 },
  ];

  var surveys = convertJsonToModel(mockSurveys);
  return surveys;
}

export async function getSurveyByUser(userId) {
}

export async function getSurveyFromCurrentUser() {

}