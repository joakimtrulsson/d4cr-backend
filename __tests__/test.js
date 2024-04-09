import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getContext } from '@keystone-6/core/context';

import config from '../keystone.js';
import PrismaModule from '@prisma/client';

const context = getContext(config, PrismaModule);

// Chapters
test('Fetch all Chapters without being logged in, expect a non-empty array with each Chapter having a title.', async () => {
  const chapters = await context.query.Chapter.findMany({
    query: 'id title',
  });

  assert.equal(Array.isArray(chapters), true);
  assert.notEqual(chapters.length, 0);

  chapters.forEach((chapter) => {
    assert.ok(chapter.title, 'Chapter should have a title');
  });
});

test('Create a Chapter fails if not logged in.', async () => {
  await assert.rejects(
    async () => {
      await context.query.Chapter.createOne({
        data: {
          title: 'Stockholm',
        },
        query: 'id title',
      });
    },
    {
      message: 'Access denied: You cannot create that Chapter',
    }
  );
});

// Users
test('Create a User fails if not logged in.', async () => {
  await assert.rejects(
    async () => {
      await context.query.User.createOne({
        data: {
          fullName: 'Test Testsson',
          email: 'test@test.se',
          password: 'dont-use-me1',
        },
        query: 'id email fullName password { isSet }',
      });
    },
    {
      message: 'Access denied: You cannot create that User',
    }
  );
});

test('Get all Users fails if not logged in.', async () => {
  const users = await context.query.User.findMany({
    query: 'id fullName email',
  });

  assert.deepStrictEqual(users, []);
});

// Principles

test('Fetch all Principles without being logged in, expect a non-empty array with each Principle having a title.', async () => {
  const principles = await context.query.Principle.findMany({
    query: 'id title principleNumber { number }',
  });

  assert.equal(Array.isArray(principles), true);
  assert.notEqual(principles.length, 0);

  principles.forEach((principle) => {
    assert.ok(principle.title, 'Principle should have a title');
    assert.ok(principle.principleNumber, 'Principle should have a title');
  });
});

test('Create a Principle fails if not logged in.', async () => {
  await assert.rejects(
    async () => {
      await context.query.Principle.createOne({
        data: {
          title: 'Principle test title',
        },
        query: 'id title',
      });
    },
    {
      message: 'Access denied: You cannot create that Principle',
    }
  );
});

// News

test('Fetch all News without being logged in, expect a non-empty array with each News having a title.', async () => {
  const allNews = await context.query.News.findMany({
    query: 'id title ',
  });

  assert.equal(Array.isArray(allNews), true);
  assert.notEqual(allNews.length, 0);

  allNews.forEach((news) => {
    assert.ok(news.title, 'A news should have a title');
  });
});

test('Create a News fails if not logged in.', async () => {
  await assert.rejects(
    async () => {
      await context.query.News.createOne({
        data: {
          title: 'News test title',
        },
        query: 'id title',
      });
    },
    {
      message: 'Access denied: You cannot create that News',
    }
  );
});

// Pages

test('Fetch all Pages without being logged in, expect a non-empty array with each Page having a title.', async () => {
  const pages = await context.query.Page.findMany({
    query: 'id title ',
  });

  assert.equal(Array.isArray(pages), true);
  assert.notEqual(pages.length, 0);

  pages.forEach((page) => {
    assert.ok(page.title, 'A page should have a title');
  });
});

test('Create a Page fails if not logged in.', async () => {
  await assert.rejects(
    async () => {
      await context.query.Page.createOne({
        data: {
          title: 'Page test title',
        },
        query: 'id title',
      });
    },
    {
      message: 'Access denied: You cannot create that Page',
    }
  );
});

// Frontpage

// test('Fetch Frontpage without being logged in, expect a non-empty array with each Page having a title.', async () => {
//   const frontpage = await context.query.Frontpage.findOne({});

//   // assert.equal(Array.isArray(frontpage), true);
//   // assert.notEqual(frontpage.length, 1);

//   assert.ok(frontpage.heroTitle, 'Frontpage should have a title');
// });

// test('Creating the Frontpage fails if not logged in.', async () => {
//   await assert.rejects(
//     async () => {
//       await context.query.Frontpage.createOne({
//         data: {
//           heroTitle: 'Frontpage test title',
//         },
//         query: 'id heroTitle',
//       });
//     },
//     {
//       message: 'Access denied: You cannot create that Frontpage',
//     }
//   );
// });
