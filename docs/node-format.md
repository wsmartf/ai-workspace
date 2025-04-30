#chatgpt 

Concrete, forward-compatible plan for the MVP knowledge node system:

---

## ✅ **MVP Knowledge Node Format**

Stored as **one JSON file per node**, in `/nodes/`. Easy to read, edit, and later index/search.

```ts
// nodes/node-abc123.json
{
  "id": "abc123",                  // UUID
  "title": "Idea: Thread-based branching UI",
  "summary": "Design pattern to branch any chat message into a new thread with shared memory context. Improves nonlinear thinking, exploration, and thread organization.",
  "tags": ["UI", "threading", "exploration"],
  "sources": [
    { "type": "thread", "id": "thread-xyz", "messageIndex": 12 },
    { "type": "doc", "id": "doc-main" }
  ],
  "related": ["def456", "ghi789"], // other node IDs
  "createdAt": "2025-04-15T16:00:00Z",
  "updatedAt": "2025-04-15T16:00:00Z"
}
```

Optionally extensible later with:
- `vector`: [embedding vector] (for search)
- `mentions`: array of threads/docs where it was used
- `status`: `"draft" | "active" | "archived"`

---

## 📥 **Node Creation Flow: "Promote to Node"**

**Triggered from**: a thread (button or context menu)  
**Behavior**:
1. Prompt GPT: summarize the conversation, suggest a title, tags
2. Show editable UI form with suggested:
   - title
   - summary (textarea)
   - tags (string array)
3. On save:
   - Generate UUID
   - Write node file to `/nodes/uuid.json`
   - (Optional) attach link in the thread or memory

> Optional: pre-fill a checkbox like `“Add to memory index”`

---

## 📄 **UI Integration Points**

### 1. **Thread View**
- “Promote to Node” button at end of thread or per message
- Optional system suggestion after long thread or idea convergence

### 2. **Node Viewer (Sidebar or Panel)**
- List of nodes (title + tags)
- Click to expand: full summary, sources, links
- Maybe: “Open thread” if source is a thread

---

## 📤 **Doc Integration (Post-MVP-Ready)**
- “Insert from Nodes” button
- Multi-select nodes → pass to GPT to synthesize content
- Result inserted into document

---

## 🔒 Why This Design Works for the Long Run

| Design Decision                 | Why it scales                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------- |
| **Flat JSON per node**          | Easy to evolve to database or indexed graph                                   |
| **Separate summary + metadata** | Lets you add embeddings, diffs, rewriters                                     |
| **source/related fields**       | Future-proof for graph traversal, linking                                     |
| **UUID-based IDs**              | Easy to merge across projects later                                           |
| **Editable tags**               | Enables hybrid search and semantic grouping                                   |
| **Manual creation flow**        | Can later be automated (agent-driven node creation, background summarization) |

---

## 🔜 Later Enhancements (Stage 2+)

- `nodeIndex.json` to allow batch loading/sorting
- Embedding + similarity search (on title + summary)
- Background tasks: summarization, link suggestions, node merging
- UI: drag/drop visual graph, filters, "nodes touched recently"

---

Let me know if this format looks good to you — then I can help you:

- Write the GPT prompt + response structure
- Build the node creation form
- Hook up the file saving
- Add node viewer UI

Want to start with the LLM prompt + UI flow?