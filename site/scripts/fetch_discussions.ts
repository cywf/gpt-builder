#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'gpt-builder';

async function fetchDiscussions() {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'gpt-builder-site',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    // Note: GitHub Discussions use GraphQL API, but for simplicity we'll use REST API
    // to fetch discussions if available, or return empty array
    
    // GraphQL query for discussions
    const query = `
      query($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          discussions(first: 25, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              title
              url
              author {
                login
              }
              createdAt
              category {
                name
              }
              comments {
                totalCount
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          owner: REPO_OWNER,
          name: REPO_NAME,
        },
      }),
    });

    const data = await response.json();
    
    let discussions: any[] = [];
    
    if (data.data?.repository?.discussions?.nodes) {
      discussions = data.data.repository.discussions.nodes.map((d: any) => ({
        title: d.title,
        url: d.url,
        author: d.author?.login || 'Unknown',
        createdAt: d.createdAt,
        category: d.category?.name || 'General',
        comments: d.comments?.totalCount || 0,
      }));
    }

    // Write to file
    const outputPath = join(process.cwd(), 'public', 'data', 'discussions.json');
    await writeFile(outputPath, JSON.stringify(discussions, null, 2));

    console.log(`✓ Fetched ${discussions.length} discussions`);
  } catch (error) {
    console.error('✗ Failed to fetch discussions:', error);
    // Write empty array on error
    const outputPath = join(process.cwd(), 'public', 'data', 'discussions.json');
    await writeFile(outputPath, JSON.stringify([], null, 2));
  }
}

fetchDiscussions();
