import React, { useState, useEffect } from 'react';
import PeopleCard from './PeopleCard';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
  cache: new InMemoryCache(),
});

export const GET_PEOPLE_BY_IDS = gql`
  query PeopleList($where: PeopleWhereInput!) {
    peopleList(where: $where) {
      id
      fullName
      image
      city
      country
      role
      socialMediaIcon1
      socialMediaUrl1
      socialMediaIcon2
      socialMediaUrl2
    }
  }
`;

async function fetchPeopleByIds(ids) {
  try {
    const { data } = await client.query({
      query: GET_PEOPLE_BY_IDS,
      variables: {
        where: {
          id: {
            in: ids,
          },
        },
      },
    });

    return data?.peopleList || null;
  } catch (error) {
    console.error('(graphql.jsx) Error fetching data:', error);
    throw error;
  }
}

export default function PeoplePreview({ content }) {
  const [peopleList, setPeopleList] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchPeopleByIds(content.people);
      setPeopleList(data);
    }

    fetchData();
  }, [content.people]);

  return (
    <div>
      <div className='text-align-center heading-text'>
        <h2 className='margin-t--xl margin--zero'>{content.title}</h2>
        <DocumentRenderer document={content.preamble} />
      </div>

      <div className='container-people-cards flex flex-row flex-wrap flex-justify-center flex-align-center'>
        {peopleList &&
          peopleList.map((person, index) => <PeopleCard key={index} data={person} />)}
      </div>
    </div>
  );
}
