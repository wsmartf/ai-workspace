
# TODO
- Sort shortcuts by what is new, for reference

- Navigate forward / back (Chrome, Obsidian)
- Rectangle pro? Snap configurations? 
- Cycle side panel / bottom panel sections? Ie in teams, Activity,Chat,Calendar. In VSCode, Extensions,docker,git. Maybe not that useful. Outlook: Inboxes
- https://karabiner-elements.pqrs.org/


| Priority                  | Mapping                                               | Example                                |
| ------------------------- | ----------------------------------------------------- | -------------------------------------- |
| 🥇 Prime (very high freq) | `Cmd + [letter]`, `Cmd + Shift + [letter]`            | Search, Switch tabs, Comment           |
| 🥈 Good (medium freq)     | `Cmd + [num]`, `Ctrl + [letter]`                      | Jump tabs, bookmarks, custom shortcuts |
| 🥉 Okay (low freq)        | `Cmd + Option + [letter]`, `Cmd + Control + [letter]` | Zen mode, less-used features           |
| 🛑 Risky / avoid          | `Fn + [letter]`, `Option + [letter]`                  | Only if unavoidable                    |

---
### macOS System & App Navigation

| Action                     | Default Shortcut                  | Notes                                                                                    |
| -------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| Switch apps                | `Cmd + Tab` / `Cmd + Shift + Tab` |                                                                                          |
| Switch windows (same app)  | `Cmd + backtick`                  |                                                                                          |
| Open Raycast               | `Cmd + Space`                     | was Open Spotlight                                                                       |
| Switch tabs                | `Cmd + K/J`                       | TODO. Currently `Cmd + Shift + [/]`. <br>Remap across Chrome, VSCode, Terminal, etc.     |
| New tab                    | `Cmd + T`                         |                                                                                          |
| Open last closed tab       | `Cmd + Shift + T`                 |                                                                                          |
| Find in doc/window         | `Cmd + F`                         |                                                                                          |
| Open Help menu             | `Cmd + Shift + ?`                 |                                                                                          |
| Open app preferences       | `Cmd + ,`                         |                                                                                          |
| Save                       | `Cmd + S`                         |                                                                                          |
| Screenshot / recording     | `Cmd + Shift + 4/5`               |                                                                                          |
| Copy path                  | `Cmd + Opt + C`                   | TODO ?                                                                                   |
| Paste and match formatting | `Cmd + Shift + Opt + V`           |                                                                                          |
| Make text bold             | `Cmd + B`                         | Overlap with "show sidebar"? Apps with sidebar + Bold: Obsidian... other editors? Notes? |
| Show hidden files (Finder) | `Cmd + Shift + .`                 |                                                                                          |
| Move copied file (Finder)  | `Cmd + Opt + V`                   |                                                                                          |
| Back/forward               | `Cmd + [/]`                       |                                                                                          |

| Action               | Default Shortcut     | Notes |
| -------------------- | -------------------- | ----- |
| Hide current app     | `Cmd + H`            |       |
| Hide all other apps  | `Cmd + Option + H`   |       |
| Close window/tab     | `Cmd + W`            |       |
| Close window off app | `Cmd + Shift + W`    |       |
| Quit all apps        | `Cmd + Opt + Q`      |       |
| Force quit           | `Cmd + Option + Esc` |       |
| Lock screen          | `Ctrl + Cmd + Q`     |       |
| Quit app             | `Cmd + Q`            |       |

## IDEs

| Action                           | Suggested Shortcut    | Notes |
| -------------------------------- | --------------------- | ----- |
| **Toggle primary sidebar**       | `Cmd + B`             |       |
| Toggle secondary sidebar         | `Cmd + Opt + B`       |       |
| Toggle copilot chat              | `Cmd + Shift + C`     |       |
| Toggle panel (bottom)            | `Cmd + Shift + B`     |       |
| **Toggle file explorer**         | `Cmd + Shift + E`     |       |
| Focus 1st/2nd editor group       | `Cmd + 1/2`           |       |
| **Git window**                   | `Cmd + 9`             |       |
| **Split editor**                 | `Cmd + \`             |       |
| Move editor into next/prev group | `Cmd + Control + ← →` |       |

| Action                       | Suggested Shortcut            | Notes   |
| ---------------------------- | ----------------------------- | ------- |
| **Command palette**          | `Cmd + Shift + P`             |         |
| **Search filenames/project** | `Cmd + P`                     |         |
| **Rename**                   | `Cmd + Opt + R`               |         |
| Replace in File/Project      | `Cmd + R` / `Cmd + Shift + R` |         |
| Find in File/Project         | `Cmd + F` / `Cmd + Shift + F` |         |
| **Format**                   | `Opt + F`                     |         |
| **Reveal file in explorer**  | `Opt + Shift + R`             |         |
| New file                     | `Cmd + N`                     |         |
| Run                          | `Control + R`                 | Only IJ |
| Preview markdown             | `Cmd + Shift + V`             | Only VS |

### IDE Editor Nav
| Action                       | Suggested Shortcut    | Notes   |
| ---------------------------- | --------------------- | ------- |
| **Go to definition**         | `Cmd + Y`             |         |
| **Peek definition**          | `Cmd + Shift + Y`     |         |
| Move line up/down            | `Opt + ⇅`             |         |
| Duplicate line               | `Cmd + D`             |         |
| **Delete line**              | `Cmd + Shift + K`     |         |
| Delete to line start         | `Cmd + Shift + Del`   |         |
| Delete to line end           | `Control + K`         |         |
| **Multiple cursors**         | `Opt + Click`         |         |
| Select line                  | `Cmd + L`             |         |
| Expand selection             | `Opt + Shift + ↑`     |         |
| Shrink selection             | `Opt + Shift + ↓`     |         |
| Refactor                     | `Control + T`         |         |
| **Select word, add cursors** | `Cmd + Shift + D`     | Only VS |
| Add cursor above/below       | `Cmd + Option + ⇅`    | Only VS |
| Move between matching braces | `Control + M`         | Only IJ |
| Move statement down          | `Command + Shift + ⇅` | Only IJ |
|                              |                       |         |

### IDE Terminal

| Action                          | Suggested Shortcut | Notes |
| ------------------------------- | ------------------ | ----- |
| **Toggle terminal**             | `Cmd + ;`          |       |
| Clear terminal                  | `Cmd + Shift + K`  |       |
| New terminal instance           | `Cmd + N`          |       |
| Delete active terminal instance | `Cmd + W`          |       |


### Raycast

| Action                   | Default Shortcut        | Notes |
| ------------------------ | ----------------------- | ----- |
| Clipboard history        | `Cmd + Option + C`      |       |
| Laund Dev/Home Workspace | `Cmd + Opt + 0/9`       |       |
| Open Chrome profile X    | `Cmd + Opt + 1/2/3`     |       |
| Quit All Apps            | `Cmd + Opt + Q`         |       |
| Emoji Keyboard           | `Cmd + Control + Space` |       |

### Obsidian

| Action                         | Shortcut               | Notes |
| ------------------------------ | ---------------------- | ----- |
| Delete note                    | `Cmd + Shift + Delete` |       |
| Open daily note                | `Cmd + ;`              |       |
| Open prev daily note           | `Cmd + Shift + ;`      |       |
| Move file                      | `Cmd + Shift + M`      |       |
| Copy as HTML                   | `Cmd + Shift + C`      |       |
| Reveal active file in explorer | `Cmd + Shift + R`      |       |
| Cycle bullet/checklist         | `Control + Enter`      |       |
| Show source mode               |                        | ?     |
| Add/remove table row/col       |                        |       |

---

## Chrome

- How to set chrome shortcuts:
	1. Install Shortkeys. 
	2. Go to Extensions > Keyboard Shortcuts. 
	3. Set shortcut. If not listed here, manually specify in ShortKeys config.

| Action                   | Shortcut                      |
| ------------------------ | ----------------------------- |
| Focus address bar        | `Cmd + L`                     |
| Show dev tools           | `Cmd + Opt + I`               |
| Rearrange tab left/right | `Control + Shift + pgup/pgdn` |

### ChatGPT

| Action             | Shortcut               |
| ------------------ | ---------------------- |
| Toggle sidebar     | `Cmd + Shift + S`      |
| Open new chat      | `Cmd + Shift + O`      |
| Focus chat input   | `Shift + Esc`          |
| Copy last response | `Cmd + Shift + C`      |
| Delete chat        | `Cmd + Shift + Delete` |


---

## Synchronizing Shortcuts

| Tool      | Method                                                                               |
| --------- | ------------------------------------------------------------------------------------ |
| VSCode    | Sync via `keybindings.json` export                                                   |
| JetBrains | Export via `File > Export Settings`, or use Settings Repository                      |
| Raycast   | Settings export coming soon — for now, use shared script folder + naming conventions |
| Karabiner | Save to `~/.config/karabiner/karabiner.json` and sync via Git                        |
| Rectangle | Export shortcuts to JSON in settings                                                 |



---

[[keyboard-shortcuts-repo]]

Preferred Apps:
- Chrome
- Mail, Outlook, Slack
- IntelliJ, PyCharm VSCode, Terminal
- Obsidian, Apple Notes
- Raycast
- Rectangle


Cmd + 
	A - select all
	**B - bold**
	C - copy
	D - delete line
	**E - ?**
	F - find
	**G - ?**
	H - hide
	**I - italicize, info**
	J - tab left
	K - tab right
	L - address bar (chrome), select line (ide), todo item (obsidian)
	**M - minimize**
	N - new
	O - open
	P - quick search/open
	Q - quit
	R - replace, reload
	S - save
	T - new tab
	**U - ? underline in editor?**
	V - paste
	W - close tab
	X - cut
	Y - go to def
	Z - undo
	, - open settings
	; - open terminal
	**. - ?**

Cmd + Shift +
	A - ?
	B - ?
	C - copy response, copy with formatting
	D - ?
	E - explorer, sidebar
	F - global find/search
	G - ?
	H - ?
	I - ?
	J - ?
	K - delete row/clear terminal
	L - ?
	M - move file
	N - new folder
	O - toggle obsidian (custom)
	P - command pallet
	Q - ?
	R - global replace
	S - ?
	T - new tab to the right
	U - ?
	V - paste with formatting
	W - close tab
	X - ?
	Y -  peek def (IDE)
	Z - redo
	? - help

Command + 
	1-9 - tab x

Control + 
	A-Z

Control +
	0-9- ?