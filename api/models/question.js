export class Question {
  constructor({
    id,
    questionText,
    type,
    options = [],
    minValue = null,
    maxValue = null,
    answerSubmissions = []
  }) {
    this.id = id;
    this.questionText = questionText;
    this.type = type;
    this.options = options;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.answerSubmissions = answerSubmissions;
  }
}
export default Question;

export function convertJsonToModel(json) {
  if (Array.isArray(json)) {
    return json.map(item => new Question({
      id: item.id,
      questionText: item.questionText || item.question,
      type: item.type,
      options: item.options || [],
      minValue: item.minValue || null,
      maxValue: item.maxValue || null,
      answerSubmissions: item.answerSubmissions || []
    }));
  }
  return new Question({
    id: json.id,
    questionText: json.questionText || json.question,
    type: json.type,
    options: json.options || [],
    minValue: json.minValue || null,
    maxValue: json.maxValue || null,
    answerSubmissions: json.answerSubmissions || []
  });
}