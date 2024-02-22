import { useEffect, useState } from 'react';

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loc = window.location;
  const API_URL = `${loc.protocol}//${loc.host}/api/graphql`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query NewsCategories {
              newsCategories {
                categoryTitle
                id
              }
            }
            `,
          }),
        });

        const { data } = await response.json();

        setCategories(data.newsCategories);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useFetchCategories;
