import Heroku from 'heroku-client';
import { Octokit } from 'octokit';

const heroku = new Heroku({ token: process.env.HEROKU_API_KEY });

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

const triggerRebuild = async (dataChanged) => {
  try {
    const downloadUrl = await octokit.request('GET /repos/{owner}/{repo}/tarball/{ref}', {
      owner: process.env.GITHUB_REPO_OWNER,
      repo: process.env.GITHUB_REPO_NAME,
      ref: process.env.GITHUB_BRANCH_TO_BUILD,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    await heroku.post(`/apps/${process.env.HEROKU_APP_ID}/builds`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${process.env.HEROKU_API_KEY}`,
      },
      body: {
        source_blob: {
          url: downloadUrl.url,
          version_description: `${dataChanged}´s data updated`,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Something went wrong when triggering a new build.', error);
    return { success: false };
  }
};

export default triggerRebuild;
