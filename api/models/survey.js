export class Survey {
  constructor({
    id,
    title,
    description,
    user_id,
    is_public,
    is_anonymous,
    estimated_time,
    points_reward,
    genre,
    created_at,
    votes
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.user_id = user_id;
    this.is_public = is_public;
    this.is_anonymous = is_anonymous;
    this.estimated_time = estimated_time;
    this.points_reward = points_reward;
    this.genre = genre;
    this.created_at = created_at;
    this.votes = votes;
  }
}
export default Survey;

export function convertJsonToModel(json) {
    if (Array.isArray(json)) {
      return json.map(item => new Survey({
        id: item.id,
        title: item.title,
        description: item.description,
        user_id: item.user_id,
        is_public: item.is_public || true,
        is_anonymous: item.is_anonymous || false,
        estimated_time: item.estimated_time,
        points_reward: item.points || item.points_reward,
        genre: item.genre,
        created_at: item.created_at || new Date().toISOString(),
        votes: item.votes
      }));
    }
    return new Survey({
      id: json.id,
      title: json.title,
      description: json.description,
      user_id: json.user_id,
      is_public: json.is_public || true,
      is_anonymous: json.is_anonymous || false,
      estimated_time: json.estimated_time,
      points_reward: json.points || json.points_reward,
      genre: json.genre,
      created_at: json.created_at || new Date().toISOString(),
      votes: json.votes
    });
  }
