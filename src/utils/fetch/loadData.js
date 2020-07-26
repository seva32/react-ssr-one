import axios from 'axios';

export default async (resource) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/${resource}?_page=1&_limit=7`,
    {
      withCredentials: false, // cuando es a otro servidor no uso credentials
      headers: {
        crossorigin: true,
      },
    },
  );
  return response.data;
};
