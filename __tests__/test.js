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

test('Create a User fails if email is missing.', async () => {
  await assert.rejects(
    async () => {
      await context.query.User.createOne({
        data: {
          fullName: 'Test Testsson',
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

test('Create a User fails if role can');
