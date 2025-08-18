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

export async function getHighestPointsValue(){
  return 1000;
}
export async function getHighestVotesValue(){
  return 10000;
}
export async function getLowestPointsValue(){
  return 0;
}
export async function getLowestVotesValue(){
  return 0;
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

// Neue Pagination-Funktionen
export async function getPaginatedSurveys(page = 1, limit = 20, filters = {}) {
  // Mock: Simuliere große Anzahl von Umfragen
  const allMockSurveys = generateMockSurveys(100); // 100 Mock-Umfragen
  
  // Filter anwenden
  let filteredSurveys = applyFilters(allMockSurveys, filters);
  
  // Sortierung anwenden
  if (filters.sortBy) {
    filteredSurveys = sortSurveys(filteredSurveys, filters.sortBy, filters.sortOrder || 'desc');
  }
  
  // Pagination berechnen
  const totalCount = filteredSurveys.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedSurveys = filteredSurveys.slice(startIndex, endIndex);
  
  // Mock-API Response Format
  const response = {
    surveys: convertJsonToModel(paginatedSurveys),
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
  
  return response;
}

// Hilfsfunktion: Filter anwenden
function applyFilters(surveys, filters) {
  let filtered = [...surveys];
  
  // Text-Suche
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(survey => 
      survey.title.toLowerCase().includes(searchLower) ||
      survey.genre.toLowerCase().includes(searchLower)
    );
  }
  
  // Kategorien
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(survey => 
      filters.categories.includes(survey.genre)
    );
  }
  
  // Punkte-Bereich
  if (filters.pointsRange) {
    filtered = filtered.filter(survey => 
      survey.points >= filters.pointsRange[0] && 
      survey.points <= filters.pointsRange[1]
    );
  }
  
  // Stimmen-Bereich
  if (filters.votesRange) {
    filtered = filtered.filter(survey => 
      survey.votes >= filters.votesRange[0] && 
      survey.votes <= filters.votesRange[1]
    );
  }
  
  return filtered;
}

// Hilfsfunktion: Umfragen sortieren
function sortSurveys(surveys, sortBy, sortOrder) {
  const sorted = [...surveys];
  
  sorted.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'votes':
        // Konvertiere "1.2k" zu 1200 für Sortierung
        aValue = parseVoteString(a.votes);
        bValue = parseVoteString(b.votes);
        break;
      case 'points':
        aValue = a.points || 0;
        bValue = b.points || 0;
        break;
      case 'created_at':
        aValue = new Date(a.created_at || 0);
        bValue = new Date(b.created_at || 0);
        break;
      case 'estimated_time':
        aValue = a.estimated_time || 0;
        bValue = b.estimated_time || 0;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return sorted;
}

// Hilfsfunktion: Vote-String zu Nummer konvertieren (z.B. "1.2k" -> 1200)
function parseVoteString(voteStr) {
  if (typeof voteStr === 'number') return voteStr;
  if (typeof voteStr !== 'string') return 0;
  
  const lower = voteStr.toLowerCase();
  if (lower.includes('k')) {
    return parseFloat(lower.replace('k', '')) * 1000;
  } else if (lower.includes('m')) {
    return parseFloat(lower.replace('m', '')) * 1000000;
  } else {
    return parseInt(voteStr) || 0;
  }
}

// Hilfsfunktion: Mehr Mock-Umfragen generieren
function generateMockSurveys(count) {
  const genres = ["Technology", "Entertainment", "Food & Drink", "Gaming", "Social Media", "Fitness", "Education", "Travel", "Music", "Sports"];
  const surveys = [];
  
  // Verwende einen höheren Startwert für IDs um Konflikte zu vermeiden
  const startId = 1000;
  
  for (let i = 0; i < count; i++) {
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const points = Math.floor(Math.random() * 1000) + 50;
    const votes = Math.floor(Math.random() * 10000) + 100;
    
    // Generiere zufällige Datum in den letzten 30 Tagen
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const created_at = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    surveys.push({
      id: startId + i, // Eindeutige ID
      title: `${genre} Related Question`,
      description: `This is a sample survey about ${genre.toLowerCase()} for testing pagination.`,
      user_id: Math.floor(Math.random() * 200) + 100,
      genre: genre,
      votes: votes,
      points: points,
      estimated_time: Math.floor(Math.random() * 5) + 1,
      created_at: created_at
    });
  }
  
  return surveys;
}

export async function getSurveyByUser(userId) {
}

export async function getSurveyFromCurrentUser() {

}

export async function saveSurvey(surveyData) {
  // Mock: Simuliere das Speichern einer Survey mit Fragen
  const mockSavedSurvey = {
    id: Math.floor(Math.random() * 1000) + 1,
    title: surveyData.title,
    description: surveyData.description || "Eine neue Umfrage",
    user_id: 1, 
    is_public: true,
    is_anonymous: false,
    estimated_time: surveyData.questions.length * 0.5, 
    points_reward: surveyData.questions.length * 10, 
    genre: surveyData.genre || "General",
    created_at: new Date().toISOString(),
    votes: "0",
    questions: surveyData.questions
  };
  
  console.log('Survey saved:', mockSavedSurvey);
  return convertJsonToModel(mockSavedSurvey);
}

export async function saveSurveyAsDraft(surveyData) {
  // Mock: Simuliere das Speichern als Entwurf
  const mockDraftSurvey = {
    id: `draft_${Math.floor(Math.random() * 1000) + 1}`,
    title: surveyData.title || "Unbenannter Entwurf",
    description: surveyData.description || "Entwurf einer Umfrage",
    user_id: 1,
    is_public: false,
    is_anonymous: false,
    estimated_time: surveyData.questions.length * 0.5,
    points_reward: surveyData.questions.length * 10,
    genre: surveyData.genre || "General",
    created_at: new Date().toISOString(),
    votes: "0",
    questions: surveyData.questions
  };
  
  console.log('Survey saved as draft:', mockDraftSurvey);
  return convertJsonToModel(mockDraftSurvey);
}