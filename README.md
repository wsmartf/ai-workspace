### **AI-Native Thinking Workspace**

This project is an AI-native workspace designed for structured, creative, and exploratory thinking. It combines documents, conversations, and memory into a single environment — tailored for people who think in branches, revise constantly, and collaborate with AI as a long-term partner.

Traditional AI tools like ChatGPT are linear and forgetful, while productivity tools like Notion and Obsidian lack real-time collaboration, contextual reasoning, and memory. This product bridges that gap. It’s built for how people actually work: jumping between ideas, starting messy, iterating toward clarity, and needing persistent structure along the way.

At its core, the tool introduces a few key components:

- **Documents**: Markdown files that evolve as plans, specs, essays, or knowledge bases.
- **AI Threads**: Persistent, branchable chats to explore sub-ideas, alternatives, or tangents.
- **Memory**: A shared, editable knowledge layer where the assistant stores insights and can retrieve past reasoning.
- **Projects**: Workspaces that group related docs, threads, and memory together in one place.

The result is a system where AI can help you develop and refine complex ideas. You can explore different paths in separate threads, promote useful responses into live documents, and ask the assistant to recall or summarize past conversations.

# Run Locally

## Dev Requirements

- Node.js (v18+ recommended)
- Rust (https://rust-lang.org/tools/install)

## Setup
1. Clone the repository and navigate to the project directory

2. Install dependencies:
```
cd server
pip install -r requirements.txt
```
```
cd ui
chmod +x ./scripts/setup.sh
./scripts/setup.sh
```

3. Export your OpenAI API key as an environment variable:
```
export OPENAI_API_KEY=your_openai_api_key
```


## Run the Application

### Backend
```
cd server
uvicorn main:app --reload --port 11434
```

### Frontend
```
cd ui
npm run tauri dev
```

