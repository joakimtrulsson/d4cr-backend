import { useEffect, useState } from 'react';

const useFetchPrinciples = () => {
  const [allPrinciples, setAllPrinciples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loc = window.location;
  const API_URL = `${loc.protocol}//${loc.host}/api/graphql`;

  useEffect(() => {
    const fetchPrinciples = async () => {
      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query {
              principles {
                id
                title
                slug                           
                image
                principleCategory {
                  title
              }
                principleNumber{
                  number
                }
                status
              }
            }
            
            `,
          }),
        });

        const { data } = await response.json();

        setAllPrinciples(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPrinciples();
  }, []);

  return { allPrinciples, loading, error };
};

export default useFetchPrinciples;
