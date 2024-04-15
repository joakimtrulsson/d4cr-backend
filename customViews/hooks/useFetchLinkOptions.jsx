import { useState, useEffect } from 'react';
import { staticPages } from '../utils/constants';

const useFetchLinkOptions = () => {
  const [pagesOptions, setPagesOptions] = useState([]);

  const loc = window.location;
  const API_URL = `${loc.protocol}//${loc.host}/api/graphql`;

  useEffect(() => {
    const fetchLinkOptions = async () => {
      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query {
              chapters(where: { status: { equals: "published" } }) {
                slug
              }
              pages(where: { status: { equals: "published" } }) {
                slug
              }
              principles(where: { status: { equals: "published" } }) {
                slug
              }
            }
            `,
          }),
        });

        const { data } = await response.json();

        const chaptersOptions = data.chapters.map((chapter) => ({
          label: `${chapter.slug}`,
          value: `${chapter.slug}`,
        }));

        const pagesOptions = data.pages.map((page) => ({
          label: `${page.slug}`,
          value: `${page.slug}`,
        }));

        const principlesOptions = data.principles.map((principle) => ({
          label: `/principles${principle.slug}`,
          value: `/principles${principle.slug}`,
        }));

        const options = [...staticPages].concat(
          chaptersOptions,
          pagesOptions,
          principlesOptions
          // resourcesOptions
        );

        options.unshift({ label: 'Select', value: '' });

        setPagesOptions(options);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    fetchLinkOptions();
  }, []);

  return pagesOptions;
};

export default useFetchLinkOptions;
