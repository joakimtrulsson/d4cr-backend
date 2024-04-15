import { useEffect, useState } from 'react';

const useFetchPeopleList = () => {
  const [peopleList, setPeopleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loc = window.location;
  const API_URL = `${loc.protocol}//${loc.host}/api/graphql`;

  useEffect(() => {
    const fetchPeopleList = async () => {
      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query PeopleList {
              peopleList{
                  id
                  createdAt
                  fullName
                  role
                  city
                  country
                  socialMediaUrl1
                  socialMediaIcon1
                  socialMediaUrl2
                  socialMediaIcon2
              }
            }
            `,
          }),
        });

        const { data } = await response.json();

        if (data) {
          setPeopleList(data.peopleList);
          setLoading(false);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPeopleList();
  }, []);

  return { peopleList, loading, error };
};

export default useFetchPeopleList;
