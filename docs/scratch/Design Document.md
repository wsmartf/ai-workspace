## 1. Overview

This is an AI-native workspace built for how people actually think: through branching ideas, evolving drafts, and back-and-forth exploration. It combines documents, conversations, and memory into a single environment where ideas can grow and stay organized over time.

Unlike current tools like ChatGPT (linear), Notion (static), or Obsidian (manual), this workspace supports active, multi-threaded collaboration with an AI — helping you write, iterate, explore, and structure complex ideas more effectively.

---

## 2. The Core Concept

> **You're not just chatting with AI — you're building a persistent, structured workspace together.**

The system combines:
- **Documents**: Editable markdown files that serve as evolving specs, plans, or notes.
- **AI Threads**: Persistent, branchable conversations for exploring different directions.
- **Memory**: A shared knowledge base where important insights are stored and referenced.
- **Structure**: A simple interface where you can jump between threads, promote ideas into docs, and pull past ideas into the present.

---

## 3. Why Now

AI tools are now core to how people brainstorm, plan, and write — but the tools are disconnected:

- ChatGPT is linear and forgetful.
- Notion AI lacks memory and dynamic interaction.
- Obsidian plugins are fragmented and niche.

As work becomes more exploratory and AI-driven, users need a space that supports long-term thinking and structured collaboration with an assistant. This tool fills that gap.

---

## 4. Target Users & Use Cases

### Users
- Founders and product builders
- Engineers and designers
- Researchers and analysts
- Writers and students

### Use Cases
- **Product ideation**: Brainstorm, refine, and document feature ideas.
- **Research synthesis**: Collect findings, summarize sources, and form conclusions.
- **Spec writing**: Collaborate on evolving technical or product documents.
- **Creative projects**: Explore alternate paths without losing prior work.
- **Strategy planning**: Compare scenarios and document decisions.

Users need a way to:
- Track evolving ideas
- Explore alternatives without losing clarity
- Turn conversation into usable output

---

## 5. Design Principles

### 1. Persistent Conversation
AI should remember what's important across sessions and threads.

### 2. Branching Thought
New ideas deserve their own space. Conversations can fork without polluting the main thread.

### 3. Document-Centric Workflow
Documents are not just outputs — they’re where the thinking happens. AI can suggest edits, add sections, or pull from prior discussions.

### 4. Portable & Minimal
Uses plain markdown. Fast, clean interface. All content belongs to the user.

### 5. AI as a Thought Partner
The assistant asks good questions, flags inconsistencies, and helps structure your work — not just answer prompts.

---

## 6. Core Components

### Projects
A workspace for related documents, threads, and memory.

### Documents
Markdown files that evolve over time. Co-authored with AI or edited manually.

### AI Threads
Persistent, focused chats that can branch off from others. Ideal for exploring ideas without derailing the main one.

### Memory
Summaries and key insights stored centrally, referenced by the AI. Can be edited by the user. Stored in simple files, with optional embedding.

### Cross-Referencing
AI can pull from past threads, suggest related notes, and synthesize ideas from multiple places.

---

## 7. Thin-Slice MVP

The goal: a minimal product that’s immediately useful for creative and technical thinking — without overwhelming features.

### What It Does
- Lets you write and edit a markdown document
- Lets you talk with an AI assistant in a persistent, side-by-side chat
- Lets you start additional threads for different subtopics
- Lets you promote AI responses into the document
- Lets you summarize a thread into memory for later use
- Stores your project as a folder of markdown and JSON files

### Core Workflow
1. Start with a new project and create a document
2. Begin chatting with the AI about your idea
3. The AI suggests structure, questions, or outlines
4. You edit the document, and optionally ask the AI to fill in or revise sections
5. You branch off to explore a sub-idea in a new thread
6. You capture useful ideas into memory or promote them to the document

### MVP Features
- Split view: document on the left, AI chat on the right
- File sidebar: show docs, threads, memory file
- Buttons to "Insert to Doc", "Summarize", or "Promote to Memory"
- Lightweight storage: everything lives in a single folder per project

### Stack
- **Frontend**: Next.js or Tauri (for local), TipTap editor, Tailwind CSS
- **Backend**: GPT-4 Turbo, local or Supabase file storage
- **Memory**: Markdown or JSON, future optional vector DB

This slice is enough to make the product sticky — it turns AI from a single-threaded assistant into a reusable thinking partner inside a real workspace.

---

## 8. Business Model & Growth Strategy

### Business Model
- **SaaS subscription**: Monthly fee for unlimited projects, deeper memory, and persistent AI threads
- **Free tier**: Single project or limited context
- Focus on value for deep thinkers, not broad consumer scale

### Growth Strategy
- Target early adopters: indie hackers, researchers, founders
- Build in public and share real workflows
- Leverage communities around Obsidian, ChatGPT, and thought tooling
- Expand via plugins and integrations (Markdown, Notion, VS Code)

The goal is not to capture everyone using AI — just the ones doing serious work and wanting more than a chatbot.

---

## 9. Vision & Long-Term Potential

Over time, this becomes more than just a workspace. It becomes a system for long-term structured thought with AI.

### Future Directions
- **Agents with roles** (e.g. researcher, summarizer, critic)
- **Knowledge graphs**: visualize and navigate your ideas
- **Team collaboration**: shared memory and co-authored documents
- **Plugins and workflows**: design sprints, research kits, code reviews
- **Personalized memory models**: persistent assistants that adapt to your style

This tool isn't about automating thought — it's about supporting it. As AI evolves, users will need tools that make them *more thoughtful*, not just faster.

---

## 10. Next Steps

### Build v0.1 (1–3 weeks)
- Project container: one doc, one chat, one memory
- Split view UI with sidebar and promote buttons
- Local or cloud file storage

### Dogfood & Iterate
- Use it for your own writing and design
- Track friction points and repeat value

### Get Feedback
- Invite 5–10 users with similar workflows
- Watch how they use threads, memory, and doc promotion

### Plan for v0.2
- Add thread branching
- Add memory search
- Add multi-doc projects

This isn’t a chatbot. It’s a place to think — and build — with AI. That’s a product worth making.

