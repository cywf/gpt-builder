#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'gpt-builder';

async function fetchRepoData() {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'gpt-builder-site',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    // Fetch repository data
    const repoResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers,
    });

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`);
    }

    const repo = await repoResponse.json();

    // Fetch languages
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/languages`,
      { headers }
    );
    const languages = await languagesResponse.json();

    // Calculate language percentages
    const totalBytes = Object.values(languages as Record<string, number>).reduce(
      (sum, bytes) => sum + bytes,
      0
    );
    const languagePercentages: Record<string, number> = {};
    for (const [lang, bytes] of Object.entries(languages)) {
      languagePercentages[lang] = parseFloat(
        (((bytes as number) / totalBytes) * 100).toFixed(1)
      );
    }

    // Fetch commit activity (last 12 weeks)
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stats/commit_activity`,
      { headers }
    );
    let commitActivity: any[] = [];
    if (commitsResponse.ok) {
      const activity = await commitsResponse.json();
      // Get last 12 weeks
      commitActivity = activity.slice(-12).map((week: any) => ({
        week: week.week,
        commits: week.total,
      }));
    }

    // Build stats object
    const stats = {
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.subscribers_count || 0,
      openIssues: repo.open_issues_count || 0,
      languages: languagePercentages,
      commits: {
        weeks: commitActivity,
        total: commitActivity.reduce((sum, week) => sum + week.commits, 0),
      },
      updatedAt: new Date().toISOString(),
    };

    // Write to file
    const outputPath = join(process.cwd(), 'public', 'data', 'stats.json');
    await writeFile(outputPath, JSON.stringify(stats, null, 2));

    console.log('✓ Repository statistics fetched successfully');
    console.log(`  Stars: ${stats.stars}`);
    console.log(`  Forks: ${stats.forks}`);
    console.log(`  Watchers: ${stats.watchers}`);
    console.log(`  Open Issues: ${stats.openIssues}`);
  } catch (error) {
    console.error('✗ Failed to fetch repository data:', error);
    process.exit(1);
  }
}

fetchRepoData();
