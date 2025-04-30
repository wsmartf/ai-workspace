
Each thread can have its own document.

Global memory. 
Add button, "promote to node".
Turn the chat into 1 or more related knowledge nodes.
	Summary of convo/idea
		Idea 1
		Idea 2
Ideas 1 and 2 will link to the main summary node, and that node will link to the thread that it branched from.
Node also references the thread doc.

Context.
Dynamically create context for every thread/message.
Possible sources, kind of ranked by relevance:
- Recent chat messages in current thread.
- Current document (if exists).
- Current thread node.
- Current thread sub-nodes.
- Entire chat context (last 5, + summarize to beginning)
- Related nodes (parent node, others?).
- Related node documents (parent node).
