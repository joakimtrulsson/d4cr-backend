import { useEffect, useState } from 'react';

const useFetchResources = () => {
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loc = window.location;
  const API_URL = `${loc.protocol}//${loc.host}/api/graphql`;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query {
              resourceCategories(orderBy: { createdAt: desc }) {
                createdAt
                title
                resources(orderBy: { createdAt: desc }) {
                  id
                  createdAt
                  title
                  url
                  resourceType {
                    type
                    icon
                  }
                }
              }
            }
            
            `,
          }),
        });

        const { data } = await response.json();
        setAllResources(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return { allResources, loading, error };
};

export default useFetchResources;
