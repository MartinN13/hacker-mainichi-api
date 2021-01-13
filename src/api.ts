import fetch from 'node-fetch';

interface APIStory {
  id: number;
  by: string;
  dead?: boolean;
  descendants: number;
  score: number;
  time: number;
  title: string;
  type: 'story';
  url: string;
}

const api = {
  getStories: async () => {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds: number[] = await response.json();

    const responses = await Promise.all(
      topStoryIds.slice(0, 100).map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)),
    );
    const apiStories: APIStory[] = await Promise.all(responses.map(response => response.json()));

    const stories = apiStories
      .filter(({ type }) => type === 'story')
      .map(({ id, by, descendants, score, time, title }) => ({
        id,
        by,
        commentCount: descendants,
        score,
        time,
        title,
      }));

    return stories;
  },
};

export { api };
