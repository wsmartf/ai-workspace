# UX walkthrough

**Chat**
- Create thread
- Exchange 10 messages and edit document
- Decide that you've developed a useful idea
- Click "Promote to Node" -> option to promote to new node, or add to an existing one?
- System summarizes the chat conversation
	- Biased towards more recent messages. This is ok because it's more likely that 1) the user has honed in on the idea in more recent chats and 2) if small details / trains of thought earlier in the convo are important... just branch into another thread, and then convert *that* into a node too.
- That knowledge will now be available across all threads

**Node viewer**
- Browse nodes and view details

**Thread context**
- When creating a new thread, "add node to context"
- Ideally, this should be automatic. Map nodes to threads too... so if you branch a thread, it brings along the nodes
- Use RAG for the document selection too? If user is editing multiple docs


# Technical
- Every chat interaction you have could potentially use all of the KB nodes.


# Ideas
- Differentiate between core threads and scratch threads? Do we want all threads/convos to be able to modify existing nodes, or only ones that are "core" trains of thought? What if we branch into a thread just to explore an idea, but then abandon it?
	- We save a history of the state of the KB nodes. If you abandon a thread, revert the state to pre-that thread?