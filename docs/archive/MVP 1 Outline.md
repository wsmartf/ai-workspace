### Core Goals:
- One markdown document you can edit
- One persistent AI chat alongside it
- A way to copy/paste useful ideas into the doc
- A way to store and view simple “memory” notes

---

### 🧱 What You’ll Build

#### 1. **Single-Project Workspace**
- No sidebar, no project switching
- Just one hardcoded folder like `./project`

#### 2. **Markdown Editor (Left Pane)**
- Plain markdown text area
- Save/load from `./project/document.md`

#### 3. **AI Chat (Right Pane)**
- Simple persistent chat window
- Messages stored locally in `./project/thread.json`
- Uses GPT-4 Turbo via API

#### 4. **Manual “Insert to Doc” Button**
- On each AI message: “Insert to Doc”
- Appends to end of `document.md` or at cursor

#### 5. **Manual Memory Log**
- `memory.md` opens in a pop-up or bottom drawer
- Text area with “append to memory” button on chat messages

---

### ⚙️ Stack

- **Frontend**: Next.js or Tauri (Tauri if you want local file I/O immediately)
- **Editor**: `<textarea>` or TipTap (if you want rich-text soon)
- **AI**: OpenAI API (GPT-4-Turbo) - python (+fastapi?) backend?
- **Storage**: Local files

---

### 🧪 What You’re Skipping (for now)
- Multiple threads
- Real-time doc section editing from chat
- Sidebar navigation
- Project memory search
- Thread/document linking
- Cloud storage or auth

---

### 🧭 Build Order

1. ✅ Basic UI with split screen (doc + chat)
2. ✅ Load/save markdown file
3. ✅ Integrate OpenAI API with local message history
4. ✅ Add “Insert to Doc” button on chat messages
5. ✅ Add memory drawer + “Save to Memory” action

---

### 💡 What You’ll Have

By the end of this:
- You can start writing a doc
- You can chat with GPT-4 about the doc
- You can promote ideas into your doc
- You can save insights to a running memory log

That's already 10× better than ChatGPT for project thinking. Once that’s stable, you can iterate fast on:
- Multi-thread support
- Project list view
- Smart memory recall