import { useEffect, useState } from 'react';

const useFetchChapters = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                chapters(where: { status: { equals: "published" } }) {
                  title
                  slug
                  status
                }
              }
            `,
          }),
        });

        const { data } = await response.json();
        setChapters(data.chapters);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  return { chapters, loading, error };
};

export default useFetchChapters;
