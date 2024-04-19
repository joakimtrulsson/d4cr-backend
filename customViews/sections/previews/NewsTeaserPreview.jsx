import Animation from './assets/graphics/animation.gif';
import Image from 'next/image';
import Newscard from './NewsCard.jsx';
import SecondaryButton from './SecondaryButton.jsx';

import { DocumentRenderer } from '@keystone-6/document-renderer';
import Link from 'next/link';
import { gql } from '@apollo/client';

import React, { useEffect, useState } from 'react';

import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
  cache: new InMemoryCache(),
});

export const GET_ALL_NEWS_QUERY = gql`
  query NewsItems($orderBy: [NewsOrderByInput!]!) {
    newsItems(orderBy: $orderBy) {
      id
      title
      slug
      status
      image
      sections
      newsCategory {
        categoryTitle
      }
      relatedChapters {
        title
      }
      resourcesTitle
      resourcesPreamble
      resources {
        id
        title
        resourceType {
          type
        }
        image
        url
      }
      createdAt
    }
    newsCategories {
      categoryTitle
    }
  }
`;

export const GET_NEWS_ITEM_BY_SLUG_QUERY = gql`
  query News($where: NewsWhereUniqueInput!) {
    news(where: $where) {
      id
      createdAt
      title
      slug
      newsCategory {
        categoryTitle
      }
      image
      sections
      resourcesTitle
      resourcesPreamble
      resources {
        id
        title
        resourceType {
          type
        }
        image
        url
      }
      status
    }
  }
`;

const GET_ALL_NEWS_BY_CHAPTER = gql`
  query NewsItems($orderBy: [NewsOrderByInput!]!, $where: NewsWhereInput!) {
    newsItems(orderBy: $orderBy, where: $where) {
      id
      title
      slug
      image
      createdAt
      newsCategory {
        categoryTitle
      }
      resourcesTitle
      resourcesPreamble
      resources {
        url
        title
        resourceType {
          type
          icon
        }
        image
        createdAt
      }
      sections
    }
  }
`;

const GET_ALL_NEWS_BY_CATEGORY = gql`
  query NewsItems($orderBy: [NewsOrderByInput!]!, $categoryTitle: String!) {
    newsItems(
      orderBy: $orderBy
      where: { newsCategory: { categoryTitle: { equals: $categoryTitle } } }
    ) {
      id
      title
      slug
      status
      image
      sections
      newsCategory {
        categoryTitle
      }
      relatedChapters {
        title
      }
      resourcesTitle
      resourcesPreamble
      resources {
        id
        title
        resourceType {
          type
        }
        image
        url
      }
      createdAt
    }
  }
`;

const GET_ALL_NEWS_BY_CATEGORY_AND_CHAPTER = gql`
  query NewsItems(
    $orderBy: [NewsOrderByInput!]!
    $categoryTitle: String!
    $relatedChapterSlug: String
  ) {
    newsItems(
      orderBy: $orderBy
      where: {
        newsCategory: { categoryTitle: { equals: $categoryTitle } }
        relatedChapters: { some: { slug: { equals: $relatedChapterSlug } } }
      }
    ) {
      id
      title
      slug
      status
      image
      sections
      newsCategory {
        categoryTitle
      }
      relatedChapters {
        title
        slug
      }
      resourcesTitle
      resourcesPreamble
      resources {
        id
        title
        resourceType {
          type
        }
        image
        url
      }
      createdAt
    }
  }
`;

async function fetchGetNewsItemByChapter(chapter) {
  try {
    const response = await client.query({
      query: GET_ALL_NEWS_BY_CHAPTER,
      variables: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        where: {
          relatedChapters: {
            some: {
              slug: {
                equals: `${chapter.toLowerCase()}`,
              },
            },
          },
        },
      },
    });

    return response.data || null;
  } catch (error) {
    console.error('(graphql.jsx) Error fetching data:', error);
    throw error;
  }
}

async function fetchGetNewsItemByCategory(category) {
  try {
    const response = await client.query({
      query: GET_ALL_NEWS_BY_CATEGORY,
      variables: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        categoryTitle: `${category}`,
      },
    });

    return response.data || null;
  } catch (error) {
    console.error('(graphql.jsx) Error fetching data:', error);
    throw error;
  }
}

async function fetchGetNewsItemByCategoryAndChapter(category, chapter) {
  try {
    const response = await client.query({
      query: GET_ALL_NEWS_BY_CATEGORY_AND_CHAPTER,
      variables: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        categoryTitle: `${category}`,
        relatedChapterSlug: `${chapter.toLowerCase()}`,
      },
    });

    return response.data || null;
  } catch (error) {
    console.error('(graphql.jsx) Error fetching data:', error);
    throw error;
  }
}

async function fetchAllNews(resolvedUrl) {
  try {
    const { data } = await client.query({
      query: GET_ALL_NEWS_QUERY,
      variables: { orderBy: { createdAt: 'desc' } },
    });

    return data || null;
  } catch (error) {
    console.error('(graphql.jsx) Error fetching data:', error);
    throw error;
  }
}

export default function NewsTeaserPreview({ content }) {
  const newsVar = content.selectedNews;
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      let response;
      if (newsVar.chapter === 'ALLCHAPTERS') {
        if (newsVar.category === 'ALL') {
          response = await fetchAllNews();
        } else {
          response = await fetchGetNewsItemByCategory(newsVar.category);
        }
      } else {
        if (newsVar.category === 'ALL') {
          response = await fetchGetNewsItemByChapter(newsVar.chapter);
        } else {
          response = await fetchGetNewsItemByCategoryAndChapter(
            newsVar.category,
            newsVar.chapter
          );
        }
      }
      setData(response);
    }

    fetchData();
  }, [newsVar.chapter, newsVar.category]);

  return (
    <div
      className='news-teaser-container flex flex-column flex-justify-center flex-align-center 
        padding-tb--xxl'
    >
      <div className='animation-background'>
        <Image src={Animation} alt='Animated GIF' />
      </div>

      <div className='text-align-center heading-text'>
        <h2 className='margin-t--xxs margin--zero'>{content.title}</h2>
        {content.preamble && <DocumentRenderer document={content.preamble} />}
      </div>

      <div
        className='news-card-container  margin-tb--s flex flex-row
            flex-justify-center flex-align-center'
      >
        {data?.newsItems?.slice(0, 3).map((item) => (
          <Newscard
            key={item.id}
            type={item.newsCategory.categoryTitle}
            title={item.title}
            url={item.slug}
            imageUrl={item.image?.url}
          />
        ))}
      </div>

      <div className='button-wrapper margin-tb--s'>
        <Link style={{ pointerEvents: 'none' }} className='no-decoration' href=''>
          <SecondaryButton title={'SEE ALL'} />
        </Link>
      </div>
    </div>
  );
}
