# Deployment Guide

This guide covers various deployment options for GPT Builder.

## Table of Contents

- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cywf/gpt-builder.git
   cd gpt-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   ```bash
   cp .env.example .env
   ```

4. **Start development servers:**
   
   Option A - Run both frontend and backend:
   ```bash
   npm run dev:all
   ```
   
   Option B - Run separately:
   ```bash
   # Terminal 1 - Frontend (Vite dev server)
   npm run dev
   
   # Terminal 2 - Backend (Express server)
   npm run server
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - Health check: http://localhost:3001/api/health

---

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Prerequisites:**
   - Docker installed
   - Docker Compose installed

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```

3. **Check status:**
   ```bash
   docker-compose ps
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Stop the application:**
   ```bash
   docker-compose down
   ```

6. **Access the application:**
   - Application: http://localhost:3001

### Using Docker Directly

1. **Build the image:**
   ```bash
   docker build -t gpt-builder:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name gpt-builder \
     -p 3001:3001 \
     -v $(pwd)/data:/app/data \
     gpt-builder:latest
   ```

3. **Check container status:**
   ```bash
   docker ps
   ```

4. **View logs:**
   ```bash
   docker logs -f gpt-builder
   ```

5. **Stop the container:**
   ```bash
   docker stop gpt-builder
   docker rm gpt-builder
   ```

### Using Pre-built Images from GitHub Container Registry

1. **Pull the image:**
   ```bash
   docker pull ghcr.io/cywf/gpt-builder:latest
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name gpt-builder \
     -p 3001:3001 \
     -v $(pwd)/data:/app/data \
     ghcr.io/cywf/gpt-builder:latest
   ```

---

## Production Deployment

### Build for Production

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start the production server:**
   ```bash
   npm start
   ```

### Using a Process Manager (PM2)

1. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

2. **Start the application:**
   ```bash
   pm2 start server/index.js --name gpt-builder
   ```

3. **Save PM2 configuration:**
   ```bash
   pm2 save
   pm2 startup
   ```

4. **Monitor the application:**
   ```bash
   pm2 monit
   ```

5. **View logs:**
   ```bash
   pm2 logs gpt-builder
   ```

### Nginx Reverse Proxy

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Data Directory (optional)
DATA_DIR=./data
```

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port for the server to listen on |
| `NODE_ENV` | `development` | Environment mode (development/production) |
| `DATA_DIR` | `./data` | Directory for storing JSON data files |

---

## Data Persistence

### Local Development

Data is stored in the `data/` directory in JSON files:
- `data/profiles.json`
- `data/prompts.json`
- `data/templates.json`

### Docker

Mount a volume to persist data:

```bash
docker run -v $(pwd)/data:/app/data gpt-builder:latest
```

Or in docker-compose.yml:

```yaml
volumes:
  - ./data:/app/data
```

---

## Troubleshooting

### Port Already in Use

If port 3001 is already in use:

1. **Change the port in `.env`:**
   ```env
   PORT=3002
   ```

2. **Or set it directly when running:**
   ```bash
   PORT=3002 npm start
   ```

### Data Files Not Creating

Ensure the application has write permissions to the `data/` directory:

```bash
mkdir -p data
chmod 755 data
```

### Docker Build Fails

1. **Clear Docker cache:**
   ```bash
   docker builder prune
   ```

2. **Rebuild without cache:**
   ```bash
   docker build --no-cache -t gpt-builder:latest .
   ```

### Cannot Connect to API

1. **Check if the server is running:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check firewall settings:**
   ```bash
   # Allow port 3001
   sudo ufw allow 3001
   ```

3. **Check Docker network:**
   ```bash
   docker network inspect bridge
   ```

### Frontend Not Loading

1. **Clear browser cache**

2. **Rebuild the application:**
   ```bash
   npm run build
   ```

3. **Check console for errors:**
   - Open browser DevTools (F12)
   - Check Console and Network tabs

---

## Health Checks

The application includes a health check endpoint:

```bash
# Test health endpoint
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Docker Health Check

The Docker container includes an automatic health check that runs every 30 seconds:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' gpt-builder
```

---

## Security Considerations

### For Production Deployments:

1. **Use HTTPS** - Always use SSL/TLS in production
2. **Set NODE_ENV** - Set `NODE_ENV=production`
3. **Restrict Access** - Use firewall rules to restrict access
4. **Regular Updates** - Keep dependencies updated
5. **Backup Data** - Regularly backup the `data/` directory
6. **Add Authentication** - Consider adding authentication for multi-user setups

---

## Scaling

For high-traffic scenarios:

1. **Use a Load Balancer** - Distribute traffic across multiple instances
2. **External Database** - Replace file-based storage with a database
3. **Caching** - Implement Redis for caching
4. **CDN** - Use a CDN for static assets

---

## Support

If you encounter issues not covered here:

- Check the [main README](../README.md)
- Open an [issue on GitHub](https://github.com/cywf/gpt-builder/issues)
- Join the [discussions](https://github.com/cywf/gpt-builder/discussions)
