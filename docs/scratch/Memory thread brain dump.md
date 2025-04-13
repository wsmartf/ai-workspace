#braindump

Summarize thread to memory 
"Pull the core ideas out of this message and add them to a new doc about the Memory Feature"

How big of a context should I use? What is the sweet spot; allowing a lot of memory/document context, while still getting fast responses and not expensive.
	1 request; compile all of the relevant memory items, document context, messages, etc, and build a context
	1 request; actually ask the question/document edit, given the contextasd;flkj

How to build this context?
Tree structure memory

Similarity search? Vector search?
Building memory tree/map/database, pruning
Memory mostly specific to a project

Is it "memory" or just context? Do we even want to frame it as "memory"? To me, I almost feel stressed about waht the AI is deciding to pu tinto memory
Maybe it should be a more transparent "document context" or "ideas". There is a separate folder/document structure that is visible to the user. This is the AI's context that is constantly evolving based on new chats, additiosn to documents, etc.
THis memory can point to specific locations in the user's doc(s). And it can also have its own ideas. 
Is this an efficient way to store the memories/context? 

My project
	Idea 1
	Idea 2
		Summary
		Brainstorm notes
		Sub-idea 1

Opinionated, second brain
Solver AI has very opinionated strategies created by experienced devs (Mark Gabel)
So this product should have "thinking" strategies, organizational strategies, product-development ideas, "baked" into it


As I'm talking to ChatGPT right now... waht do I *wish* it was doing?
- Keeping my past context in another thread. I wish this new memory discussion was in a new thread, with a running document that we're working on
- I wish it was less formatted/fluffy. Maybe fine for the chat response, as long as it's being persisted in a more condensed / professional / informative format in some kind of document
- I feel like I "Lose" good ideas because they are deep in the thread. It's a lot of work to go back through and find the "end" of that particular chat section where we "hone in on some core idea", but then quickly move on.
- As I'm working in Obsidian, I'm constantly having to convert a note into a folder note so I can add sub-notes which are linked. And teh OG note becomes higher and higher level, and the subnotesa have the details. And then after a while these might branch into subnotes. But at some point I don't want to keep branchign (when the tree gets to some depth). Instead, I reorganize from the root level, "flatteN" the tree
- Start a separate tab, and then "combine it back" into another tab. So explore some idea, and then merfge it back into the context of another main chat

**Project Knowledge**

Is there a way to structure memory such taht I don't need to rely on LLM as much to actually navigate through the knowledge base, build the context, etc?
Like a knowledge index. SO we just keep every single line of text ever, but we index each sentence? How is that useful. 

Asynchronously process and evolve the knowledgebase
"While you were sleeping, we restructured 100 files, formed 40 connections. Here is an outline. You can review these new knowledge entries here, and incorporate them into your doc or leave them as memory/context"
Intelligently branch. If a document gets too big, fork it into 2 or more documents
	Break this document down into sub-ideas. Structure the response like
		Table of contents
			Branch 1 name -> links to new sub-doc
			... etc
	Use similarity search to traverse this tree? And pull in pieces that are important? Have some degree of randomness, to help with idea generation, evolution?

End thread by converting it to a knowledge item. This creates a document detailing where you landed on the conversation. Maybe some of the earlier ideas (that were dismissed) in an appendix. Or, user can delete the thread if it wasn't useful (or was a "dead end"). Maybe this is useful info to store too... like add hard dead-ends to the context so the agent knows to steer in a particular direction.

AI document diff
Can't edit your docs without diff
CAN edit its evolving knowledge base without diff
If you edit something... should have a cascading effect? Because we have some behind the scenes structural / linkage between all of the information in your project. So if you edit something, follow it down the chain and make changes. Does this becoem exponential though? Maybe prune too

Forward/back-linking like obsidian, roam, etc
Thinking tree
	When you end a thread (or branch?), create a new Node
	Node grows as thread grows
	Every LLM request is:
		1. Chat response, based on recent chat context and document
		2. (Optional) working doc edit
		3. Self-suggested updates to the node, based on the direction of the chat, content, etc. Then, every few chats, these suggestions are compiled into one prompt and build the updated node (like the agent is having a secondary, behind the scenes iterative conversation with itself).
	If the node grows too large... split it. Once again, continue building the nodes as the conversation evolves. Track the last time a node was interacted with? So nodes that become less relevant (e.g. less similar to the root nodes / core doc / message context), or that are older (last touched x number of messages ago)... prune them.
	This could quickly get messy
	How to differentiate between nodes that document part of the brainstorm, but are "inaccurate" now or are going in a different direction than we later decided on

Semantic graph traversal. Use LLM to "walk through" the KB nodes
"Context bundles"?
Use static indexes to avoid unnecessary LLM calls.


AI gives me 5 good ideas, but not in a lot of depth. I might want to immediately create 5 new branches/threads to explore each of these. Some are more promising, and some i want to keep but put on the back burner

Model pretraining?

KB = knowledgebase
