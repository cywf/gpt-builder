# Quick Start Guide

Get GPT Builder up and running in minutes!

## 🚀 Fastest Way to Start

### Option 1: Docker (Recommended for Production)

```bash
# Clone and run with Docker Compose
git clone https://github.com/cywf/gpt-builder.git
cd gpt-builder
docker-compose up -d

# Open http://localhost:3001 in your browser
```

That's it! The application is running.

---

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/cywf/gpt-builder.git
cd gpt-builder

# Install dependencies
npm install

# Start both frontend and backend
npm run dev:all

# Open http://localhost:3000 in your browser
```

---

## 📱 First Steps in the Application

### 1. Create Your First GPT Profile

1. Click the "**➕ New Profile**" button on the Dashboard
2. Fill in the profile details:
   - **Name**: Give your AI a name (e.g., "Code Assistant")
   - **Description**: Brief description of its purpose
   - **System Instructions**: Define how it should behave
   - **Initiation Prompt**: First message it sends
   - **Temperature**: Adjust creativity (0.7 is a good start)
   - **Max Tokens**: Response length (2000 is standard)
3. Click "**Create Profile**"

### 2. Store Your Prompts

1. Navigate to "**📝 Prompts Library**"
2. Click "**➕ New Prompt**"
3. Add your prompt details:
   - Title and content
   - Select a category
   - Add tags for organization
4. Click "**Create Prompt**"

### 3. Create a Template

1. Go to "**🎨 Templates**"
2. Click "**➕ New Template**"
3. Fill in the template information
4. Toggle "**Make this template public**" to share with others
5. Click "**Create Template**"

### 4. Export Your GPT Profile

1. Find your profile on the Dashboard
2. Click "**📥 Export**" button
3. A JSON file will download to your computer
4. Use this file in your AI applications!

---

## 🎯 Common Use Cases

### For Developers

Create specialized coding assistants:
- Code review helper
- Bug finder
- Documentation generator
- Test writer

### For Content Creators

Build creative assistants:
- Story generator
- Content editor
- SEO optimizer
- Social media writer

### For Educators

Design teaching assistants:
- Homework helper
- Concept explainer
- Quiz generator
- Study guide creator

### For Business

Develop business assistants:
- Email writer
- Report generator
- Data analyzer
- Customer service bot

---

## 🛠️ Customization Tips

### Temperature Settings

- **0.0 - 0.3**: Very focused and deterministic (good for factual tasks)
- **0.4 - 0.7**: Balanced creativity and consistency (most use cases)
- **0.8 - 1.5**: Creative and varied (good for creative writing)
- **1.6 - 2.0**: Very creative, can be unpredictable

### Max Tokens Guide

- **100-500**: Short responses, quick answers
- **500-1000**: Detailed explanations
- **1000-2000**: Comprehensive responses (recommended)
- **2000-4000**: Long-form content, extensive analysis

### System Instructions Examples

**For a Code Assistant:**
```
You are an expert programmer with deep knowledge of multiple programming 
languages. You provide clear, well-commented code examples and explain 
complex concepts in simple terms. Always consider best practices and 
security implications.
```

**For a Creative Writer:**
```
You are a creative writing assistant with a knack for storytelling. 
You help develop engaging narratives, compelling characters, and vivid 
descriptions. You provide constructive feedback and suggest improvements 
while respecting the writer's unique voice.
```

**For a Teacher:**
```
You are a patient and knowledgeable teacher. You explain concepts clearly 
using examples and analogies. You encourage learning through questions and 
adapt your explanations to the student's level of understanding.
```

---

## 💡 Pro Tips

1. **Start Simple**: Begin with a basic profile and refine it over time
2. **Test Different Settings**: Experiment with temperature and max tokens
3. **Use Templates**: Save successful configurations as templates
4. **Organize Prompts**: Use categories and tags to keep your prompt library organized
5. **Export Regularly**: Keep backups of your best profiles
6. **Share Templates**: Help the community by making your best templates public

---

## 🔧 Troubleshooting

### Application Won't Start

```bash
# Check if port 3001 is in use
lsof -i :3001

# If in use, change the port
PORT=3002 npm start
```

### Data Not Saving

```bash
# Ensure data directory exists and has permissions
mkdir -p data
chmod 755 data
```

### Docker Issues

```bash
# Restart the container
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild if needed
docker-compose down
docker-compose up --build -d
```

---

## 📚 Next Steps

- Read the [full documentation](../README.md)
- Check out the [API documentation](docs/API.md)
- Learn about [deployment options](docs/DEPLOYMENT.md)
- Join our [discussions](https://github.com/cywf/gpt-builder/discussions)

---

## 🎉 You're Ready!

Start building amazing AI models with GPT Builder!

**Need Help?** Open an issue on GitHub or start a discussion.

**Have Ideas?** Contributions are welcome! Check out [CONTRIBUTING.md](../CONTRIBUTING.md).

---

<div align="center">

**Happy Building! 🚀**

[⬆ Back to Main README](../README.md)

</div>
