---
title: "Markdown Design System Test"
description: "A comprehensive guide to testing markdown styles including typography, lists, code blocks, tables, and more."
date: "2024-01-15"
keywords: "linux, CS"
---

# Heading 1: The Quick Brown Fox
This is a standard paragraph. It contains **bold text** for emphasis, *italic text* for nuance, and ~~strikethrough text~~ for corrections. You might also see `inline code` used for technical terms. Links look like this: [Visit Google](https://google.com).

## Heading 2: Jumps Over The Lazy Dog
### Heading 3: A Much Longer Heading To Test Wrapping And Line Height In The Design System
#### Heading 4: Sub-section Title
##### Heading 5: Minor Section
###### Heading 6: Smallest Heading

This is a standard paragraph. It contains **bold text** for emphasis, *italic text* for nuance, and ~~strikethrough text~~ for corrections. You might also see `inline code` used for technical terms. Links look like this: [Visit Google](https://google.com).

---

## Lists

### Unordered List
- Level 1 Item
- Level 1 Item
  - Level 2 Item
  - Level 2 Item
    - Level 3 Item
- Level 1 Item

### Ordered List
1. First Step
2. Second Step
   1. Sub-step A
   2. Sub-step B
3. Third Step

### Task List
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

---

## Blockquotes

> This is a blockquote. It is used to highlight important information or quotes from other sources.
>
> It can span multiple paragraphs.
>
> > Nested blockquotes are also supported for replies or deeper context.

---

## Code Blocks

Here is a TypeScript code example:

```typescript
interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

function greet(user: User): void {
  console.log(`Hello, ${user.username}!`);
}

const admin: User = {
  id: 1,
  username: "admin",
  isAdmin: true
};
```

And a plain text block:

```
This is a plain text code block.
It preserves whitespace and formatting.
```

---

## Tables

| Feature | Status | Notes |
| :--- | :---: | ---: |
| Dark Mode | ✅ | Automatic |
| Responsive | ✅ | Mobile-first |
| Performance | 🚀 | Optimized |
| Accessibility | ⚠️ | In Progress |

---

## Media

![Placeholder Image](/react.svg)
![Placeholder Image](/vite.svg)
*Caption: This is an example image with a caption.*

---

## Interactive Elements

<details>
<summary>Click to reveal hidden content</summary>

This content is hidden by default. It's useful for FAQs, spoilers, or optional details that might clutter the main view.
</details>