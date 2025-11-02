#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'gpt-builder';

async function fetchProjects() {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'gpt-builder-site',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    // Try to fetch Projects v2 data using GraphQL
    const query = `
      query($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          projectsV2(first: 1) {
            nodes {
              title
              items(first: 100) {
                nodes {
                  content {
                    ... on Issue {
                      title
                      url
                      labels(first: 10) {
                        nodes {
                          name
                        }
                      }
                      assignees(first: 10) {
                        nodes {
                          login
                        }
                      }
                    }
                    ... on PullRequest {
                      title
                      url
                      labels(first: 10) {
                        nodes {
                          name
                        }
                      }
                      assignees(first: 10) {
                        nodes {
                          login
                        }
                      }
                    }
                  }
                  fieldValues(first: 10) {
                    nodes {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        name
                        field {
                          ... on ProjectV2SingleSelectField {
                            name
                          }
                        }
                      }
                    }
                  }
                }
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
    
    let items: any[] = [];
    
    if (data.data?.repository?.projectsV2?.nodes?.[0]) {
      const project = data.data.repository.projectsV2.nodes[0];
      items = project.items.nodes
        .filter((item: any) => item.content)
        .map((item: any) => {
          // Find status field
          const statusField = item.fieldValues.nodes.find(
            (fv: any) => fv.field?.name?.toLowerCase() === 'status'
          );
          const status = statusField?.name || 'todo';

          return {
            title: item.content.title,
            url: item.content.url,
            status: status.toLowerCase(),
            labels: item.content.labels?.nodes?.map((l: any) => l.name) || [],
            assignees: item.content.assignees?.nodes?.map((a: any) => a.login) || [],
          };
        });
    }

    // Fallback: Use issues with labels if no projects
    if (items.length === 0) {
      console.log('No Projects v2 found, falling back to issues with labels');
      const issuesResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=all&per_page=50`,
        { headers }
      );
      
      if (issuesResponse.ok) {
        const issues = await issuesResponse.json();
        items = issues.map((issue: any) => {
          // Try to determine status from labels
          let status = 'todo';
          const labels = issue.labels.map((l: any) => l.name.toLowerCase());
          
          if (labels.some((l: string) => l.includes('in progress') || l.includes('doing'))) {
            status = 'in progress';
          } else if (labels.some((l: string) => l.includes('done') || l.includes('completed') || l.includes('closed'))) {
            status = 'done';
          } else if (issue.state === 'closed') {
            status = 'done';
          }

          return {
            title: issue.title,
            url: issue.html_url,
            status,
            labels: issue.labels.map((l: any) => l.name),
            assignees: issue.assignees?.map((a: any) => a.login) || [],
          };
        });
      }
    }

    // Write to file
    const outputPath = join(process.cwd(), 'public', 'data', 'projects.json');
    await writeFile(outputPath, JSON.stringify({ items }, null, 2));

    console.log(`✓ Fetched ${items.length} project items`);
  } catch (error) {
    console.error('✗ Failed to fetch projects:', error);
    // Write empty array on error
    const outputPath = join(process.cwd(), 'public', 'data', 'projects.json');
    await writeFile(outputPath, JSON.stringify({ items: [] }, null, 2));
  }
}

fetchProjects();
