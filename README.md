# V2 features

## 🔀 Thread Branching

**Start new threads from any point in a conversation.**

- Thread ideas
  - Visualize thread tree
  - Let threads pull in / absorb other threads
- Should we show all messages in new thread, or just show a summary as the first message?

---

## 💾 Smarter Memory

**Turn insights into reusable knowledge.**

- Use `/remember` to ask AI: “What’s worth saving from this thread?”
- Select multiple messages → “Save to Memory”
- AI proposes a title and summary → editable before saving
- Memory entries are:
  - Scoped to project (default) or global
  - Tagged or grouped over time (optional later)
- Memory can be surfaced automatically when relevant

---

## 📝 Edit Document from Thread

**Use AI to update the doc based on your thread.**

- Click “Update Document” on any thread
- AI sees current document + thread, and proposes changes:
  - Add section, reword paragraph, insert bullet points, etc.
- Preview the change → Accept, Edit, or Cancel
- Helps turn threads into concrete output

---

## 📄 Multi-Document Support

**Organize your thinking with lightweight documents.**

- Each project has a `docs/` folder (markdown files)
- Easily switch between documents in a sidebar
- Threads can be linked to specific docs (or none)
- From any thread, you can “Promote to new document”
  - AI summarizes and seeds a new `.md` file
- Prevents the main doc from becoming cluttered
- Mimics real workflows: scratchpad → structured note → final output


---

Other ideas
- A "master thread" that outlines the entire project/conversation, evolves over time? 
  How to manage manay threads, documents, "scratch" files? Especially over a longer project?
- Intelligently pruning/archiving old/obsolete/irrelevant threads
- Asynchronous processing of threads/documents? Like work on them iteratively using reasoning, asynchronously
  Cheaper, + AI can think & organize ideas for you while you sleep
  But have to not overdo it; so stuff still feels familiar to you and you're able to navigate around the workspace


Disable data controls/sharing after april 30! OpenAI

You’re building:
- Multi-threaded branchable thinking
- Composable, editable memory graph
- Workspace- or project-based context that accumulates over time
- Eventually: interconnected documents + ideas, like a PKM + AI hybrid

- Rename threads
- If all threads are closed, auto-open a new empty thread


Cool ideas
You can show users things ChatGPT can’t do:
- Start 3 parallel branches of an idea and compare them
- Summarize past chat threads and fold them into a document
- Save only the key takeaways from a convo into memory
- Open a new thread with just the relevant memory/context (selectively!)
- Write one doc, then branch a new one and pull forward only the pieces you want

*Be opinionated*

✅ Practical Differentiation Levers You Can Push- Memory Graph — editable, composable, navigable memory (vs. hidden “AI remembers this”)
- Structured Document + Chat Integration — insert, revise, branch
- Threading UX — visible branching model, not buried in dropdowns
- Multi-doc navigation — multiple active canvases, not just one per chat
- Project mode — users think in projects; you give them a space for it
- Plugin system — tailor to writers, devs, researchers


### **AI-Native Thinking Workspace**

This project is an AI-native workspace designed for structured, creative, and exploratory thinking. It combines documents, conversations, and memory into a single environment — tailored for people who think in branches, revise constantly, and collaborate with AI as a long-term partner, not a one-off assistant.

Traditional AI tools like ChatGPT are linear and forgetful, while productivity tools like Notion and Obsidian lack real-time collaboration, contextual reasoning, and memory. This product bridges that gap. It’s built for how people actually work: jumping between ideas, starting messy, iterating toward clarity, and needing persistent structure along the way.

At its core, the tool introduces a few key components:

- **Documents**: Markdown files that evolve as plans, specs, essays, or knowledge bases.
- **AI Threads**: Persistent, branchable chats to explore sub-ideas, alternatives, or tangents.
- **Memory**: A shared, editable knowledge layer where the assistant stores insights and can retrieve past reasoning.
- **Projects**: Workspaces that group related docs, threads, and memory together in one place.

The result is a system where AI can help you develop and refine complex ideas — not just respond to prompts. You can explore different paths in separate threads, promote useful responses into live documents, and ask the assistant to recall or summarize past conversations.

A minimal, useful MVP can be built quickly. It includes:
- A split view (document on the left, persistent AI chat on the right)
- A simple sidebar showing docs, threads, and a memory file
- Buttons to promote responses to the doc, summarize threads, or store ideas in memory
- Local or cloud-based storage using markdown and JSON

This thin slice already solves a major pain point: keeping your thinking organized across long, branching AI conversations — and turning that into usable output.

From there, the vision expands. The platform could support role-based agents, team collaboration, personal memory models, semantic search, and knowledge graph views. Users could install workflow-specific plugins for research, product specs, content creation, or writing.

The business model is straightforward: a paid SaaS for people doing real work with AI — solo builders, researchers, designers, and knowledge workers. Early growth will come from indie developer communities, AI power users, and creators frustrated with the limitations of chat-based thinking.

In short, this tool isn’t a chatbot wrapper. It’s a new kind of workspace — one that helps you actually think with AI, over time, with structure. A place to build clarity, not just generate words.
