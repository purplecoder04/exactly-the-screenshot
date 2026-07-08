# Upload And Capture Guide

This guide explains how to use CEO Studio capture flows:

- Brain Dump
- Import Work Session
- Document uploads
- Review Before Saving

The key rule is simple: nothing becomes a real task, idea, product, framework, or note until it is reviewed and saved.

## Brain Dump

Use Brain Dump when you want to quickly type or paste messy thoughts.

Best for:

- Raw founder notes
- Ideas from a call or class
- Quick task lists
- Product thoughts
- Framework notes
- Decisions
- Prompt ideas
- Personal reminders

Brain Dump does not upload files. It is for typing or pasting text directly into the large writing area.

### Brain Dump Workflow

1. Go to `Brain Dump`.
2. Type or paste notes into the raw capture box.
3. Click `Analyze`.
4. Review the proposed items.
5. Edit anything that needs cleanup.
6. Select the items you want to keep.
7. Click `Save Selected`.

The parser saves proposed items as unreviewed first. They only become real dashboard work after review.

## Import Work Session

Use Import Work Session when you want to upload or paste a longer work session.

Best for:

- Meeting notes
- Class notes
- Strategy documents
- Build notes
- Product planning notes
- Long copied ChatGPT sessions
- Markdown planning files
- Word documents

### Supported Upload Types

CEO Studio currently supports:

- `.txt`
- `.md`
- `.docx`

PDF support is planned later, but is not active yet.

### Import Workflow

1. Go to `Import Work Session`.
2. Choose a `.txt`, `.md`, or `.docx` file.
3. CEO Studio extracts the document text locally.
4. The rule-based parser turns the text into proposed items.
5. The uploaded session is saved in `import_work_sessions` as unreviewed.
6. Review and edit the proposed cards.
7. Click `Save Selected`.
8. The import session is marked reviewed.

You can also paste a work session instead of uploading a file.

## Recommended Labels

Labels make parsing more accurate. Put one item per line when possible.

Use these labels:

```text
Task:
TODO:
Next Step:
Fix:
Build:
Add:
Update:
Test:
Idea:
Parking Lot:
Idea Garden:
Framework:
Product:
Product Update:
Decision:
Meeting Note:
License Rule:
Note:
Class Notes:
Personal Note:
Founder Note:
Captured Insight:
Prompt:
Prompt Idea:
```

## Example Brain Dump

```text
Task: Finish the Rise catalog.
Idea: Progress Garden should unlock flowers.
Framework: Behavior is a Language.
Decision: Keep Import Work Session local-first for now.
Product Update: Add quiz status to Meet at the Heal products.
Meeting Note: Content to Cash class mentioned offer clarity.
Prompt Idea: Create a prompt for turning class notes into product tasks.
Personal Note: Call the insurance company.
```

## Example Work Session File

Save this as `work-session.md` or `work-session.txt`:

```markdown
# CEO Studio Work Session

Task: Finish CEO Dashboard Supabase wiring.
Next Step: Test that Weekly Log saves after refresh.
Product: Why Do Men Come Back lesson guide.
Framework: Return vs Repair belongs in the Framework Library.
Decision: Keep the app local-first until login is ready.
Idea Garden: Add a calmer empty state for new founders.
License Rule: Course templates can be reused inside Best Collective only.
Founder Note: The dashboard should help decide, not just display.
```

## Review Before Saving

After Brain Dump or Import Work Session analyzes text, each proposed item appears as a review card.

Each card can be edited before saving.

Common fields:

- Output Type
- Branch / Workstream
- Title
- Notes
- Confidence

Task fields:

- Task Title
- Branch / Workstream
- Type
- Status
- Priority
- Project / Product
- Next Step
- Add to Today
- Notes

Product fields:

- Product Name
- Branch / Workstream
- Collection
- Notes

Framework fields:

- Framework Title
- Branch / Workstream
- Notes

Idea fields:

- Title
- Branch / Workstream
- Notes

## Confidence

The parser shows confidence so review is faster.

High confidence usually means:

- The line had a clear label like `Task:` or `Framework:`
- The parser recognized both the type and destination

Medium confidence usually means:

- The parser recognized a keyword
- The branch or category may need review

Low confidence usually means:

- The parser was unsure
- It defaults to a note instead of ignoring the item

## Bulk Review Actions

The review screen includes:

- Select All
- Approve All
- Reject All
- Collapse All
- Expand All
- Delete All
- Save Selected

Use `Approve All` when the parser is mostly right. Use `Collapse All` for long work sessions.

## Where Items Save

Approved items route into the existing CEO Studio system.

| Output Type | Saves To |
|---|---|
| Task | `tasks` |
| Idea | `captured_insights` or Idea Garden flow |
| Parking Lot / Idea Garden | `ideas` |
| Framework | `library_items` |
| Product / Product Update | `products` |
| Decision | `decision_items` or captured insight review |
| Meeting Note | `captured_insights` |
| License Rule | `captured_insights` |
| Founder Note | `captured_insights` |
| Captured Insight | `captured_insights` |
| Prompt Idea | `captured_insights` |

Raw Brain Dump review items are queued in `captured_insights` as `unreviewed`.

Uploaded files are queued in `import_work_sessions` as `unreviewed`.

## Tips For Better Parsing

Use one item per line:

```text
Task: Update the Product Catalog.
Task: Review Rise landing page copy.
Idea: Add a progress flower unlock.
```

Avoid putting several unrelated items in one sentence.

Better:

```text
Task: Finish Chapter 6.
Task: Add quiz to Meet at the Heal.
Personal Note: Buy groceries.
```

Less clear:

```text
Finish Chapter 6 and add a quiz and buy groceries.
```

Use specific destination words when helpful:

```text
Framework: Doorway Test belongs in the Framework Library.
Product: Why Do Men Come Back needs Chapter 6.
Task: Update the Website landing page.
Task: Create a Reel for Social Media.
```

## Troubleshooting

If nothing is detected:

- Add labels like `Task:`, `Idea:`, `Framework:`, `Product:`, or `Decision:`.
- Put each item on its own line.
- Use `.txt`, `.md`, or `.docx` only.
- Check that the document has selectable text, not just images.

If an item goes to the wrong branch:

- Edit the branch on the review card before saving.
- Add clearer words like `Rise`, `Land`, `Brand`, `Website`, `Social Media`, or `Kit Factory`.

If an upload fails:

- Confirm the file is `.txt`, `.md`, or `.docx`.
- Try copying the file text into `Paste Work Session`.
- For PDF content, copy and paste the text manually until PDF import is added.

## Local-First Rule

CEO Studio capture flows are local-first and review-first.

The app should not:

- Auto-save parsed items as real work
- Skip review
- Require login for capture
- Require a database write before the user approves final items

The founder stays in control of what becomes official dashboard work.
