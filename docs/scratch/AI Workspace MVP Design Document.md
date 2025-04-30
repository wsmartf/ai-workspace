### Goal
Build a minimal, usable version of the AI-native thinking workspace. Focus on clarity, structure, and persistent collaboration between users and the assistant — without over-engineering. Prioritize features that help users write, explore, and organize ideas in a clean, structured environment.

---

### Core Features (v0.1)

#### 1. Projects
- Each project is a folder (local or cloud)
- Contains:
  - 1 editable markdown document (main work artifact)
  - Multiple AI threads (conversations)
  - 1 memory file (summary log)

#### 2. Document Editor
- Markdown-based
- Left-side panel in split view
- Edited by user; AI can propose content
- Actions:
  - Insert AI response into document
  - Ask AI to update a section (by copy-pasting or referencing it in chat)

#### 3. AI Threads
- Persistent chats with the assistant
- Right-side panel in split view
- Each thread is named and associated with the project
- Users can:
  - Start a new thread
  - Continue existing threads
  - Ask questions, brainstorm, refine ideas
  - Promote ideas from thread into the doc or memory

#### 4. Memory File
- Stored as a simple markdown or JSON file
- Flat, append-only list of:
  - Key insights
  - Summaries
  - Decisions
- Populated manually by user or via button in threads (e.g., "Summarize this thread")
- Accessible by AI when asked explicitly (e.g., "Search memory for X")

#### 5. UI
- Split layout:
  - Left: document editor
  - Right: AI chat window (selectable threads)
- Sidebar:
  - Project name
  - File tree (document, memory, threads)
  - Option to create new thread or view memory
- Buttons on chat messages:
  - "Insert to Doc"
  - "Summarize to Memory"

---

### UX Flow

#### Creating a Project
1. User starts a new project
2. A blank document and first AI thread are created automatically

#### Using the Assistant
1. User types idea or question into thread
2. AI responds
3. User can:
   - Ask follow-ups
   - Insert AI response into document
   - Summarize conversation into memory

#### Working with Memory
1. User opens memory file from sidebar
2. Reads or copies prior insights
3. Can ask AI: "Search memory for previous thoughts on X"

---

### Tech Stack
- **Frontend**: Next.js or Tauri, TipTap editor, Tailwind CSS
- **AI API**: OpenAI GPT-4 Turbo
- **Storage**: Local filesystem (initial), optional Supabase for cloud sync
- **File Format**: Markdown for docs/memory, JSON for threads

---

### Out of Scope (v0.1)
- Inline commenting or thread-to-doc section linking
- Auto memory summarization or tagging
- Multi-document projects
- Embedding or vector search
- Collaboration/multi-user access

---

### Success Criteria
- Can create and edit a doc while chatting with AI
- Can start and manage multiple AI threads
- Can promote chat content into the doc or memory
- Memory is simple, readable, and referenceable
- Clear UI separation between doc, threads, and memory

---

This MVP provides structure without getting in the way. It’s focused, extensible, and immediately useful to anyone doing deep thinking, creative work, or technical planning with the help of an assistant.