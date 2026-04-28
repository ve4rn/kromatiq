# Kromatiq

[Source code →](https://github.com/ve4rn/kromatiq)

Stop using random hex codes.

Kromatiq is a Discord-first color engine that turns your bots, roles, and UI into clean, consistent, premium-looking systems instantly.

Named colors. Palettes. Gradients. Extended Tailwind colors. Chainable transforms.

**From messy colors to a real design system in seconds.**

Zero dependencies. Built for Discord. Made for speed.

---

## Why Kromatiq

Most Discord projects look cheap.

Random colors. No consistency. No identity.

Kromatiq fixes that instantly.

- Replace hex codes with real, meaningful color tokens
- Create consistent palettes across your entire bot
- Generate gradients and role systems in seconds
- Upgrade your embeds and UI without extra work

Your bot goes from basic to premium.

---

## Installation

```bash
npm install kromatiq
```

`discord.js` is a peer dependency.

---

## Setup (1 line)

```ts
import "kromatiq/register";
```

That's it.

Kromatiq patches Discord builders so you can use powerful color inputs everywhere without changing your workflow.

---

## Instant Upgrade (Quick Start)

```ts
import "kromatiq/register";
import { EmbedBuilder, ContainerBuilder } from "discord.js";
import { palette, roleColor, tailwind } from "kromatiq";

new EmbedBuilder().setColor("midnightInk");
new EmbedBuilder().setColor("Blurple");
new EmbedBuilder().setColor(tailwind("violet-500"));

new ContainerBuilder().setAccentColor("amberGold");

await role.setColors("midnightInk");
await role.setColors(["midnightInk", "amberGold"]);
await role.setColors(palette("sunset").role(0));
await role.setColors(roleColor.holographic());
```

Same code. Better visuals. Higher perceived quality.

---

## What You Can Do

### Use clean, meaningful colors

```ts
new EmbedBuilder().setColor("midnightInk");
```

No more unreadable hex codes.

---

### Tailwind, extended and refined

```ts
tailwind("violet-500");
```

Kromatiq includes an extended Tailwind palette, not just the default set.

More colors. Better range. Built for real UI work.

Explicit, controlled, and it does not pollute your autocomplete.

---

### Create gradients effortlessly

```ts
await role.setColors(["midnightInk", "amberGold"]);
```

Or even:

```ts
await role.setColors(palette("sunset").role(0));
```

---

### Build consistent color systems

```ts
const theme = palette("sunset");

await role.setColors(theme.role(0));
```

Your entire server stays visually coherent.

---

### Transform colors like a pro

```ts
import { color } from "kromatiq";

color("amberGold").darken(12);
color("violet-500").saturate(10);
color("vermilion").rotateHue(20);
color("midnightInk").mix("amberGold", 35);
```

No external tools. No manual tweaking.

---

## Supported Inputs

Kromatiq accepts everything you need:

- Discord color names like `Blurple`
- named palette tokens like `midnightInk`
- Tailwind tokens through `tailwind("violet-500")`
- hex like `#8B5CF6`
- integers like `0x5865F2`
- RGB objects
- `KromatiqColor`

One system. Zero friction.

---

## Available Colors & Palettes

Fill this section with your final shipped datasets.

| Category | Available | Notes |
| --- | --- | --- |
| Discord colors | ✅ | 30 |
| Named colors | ✅ | 170 |
| Tailwind tokens | ✅ | 300 |
| Built-in palettes | ✅ | 20 |
| Gradient-ready palettes | ✅ | 20 |

---

## Role Systems That Scale

### Gradient roles

```ts
await role.setColors(["midnightInk", "amberGold"]);
```

### Holographic roles

```ts
await role.setColors(roleColor.holographic());
```

### Bulk role styling

```ts
import { roleSequence } from "kromatiq";

await roleSequence("sunset", {
  gradient: true,
}).applyTo(roles);
```

Apply colors to multiple roles at once.

- Enable `gradient` to generate smooth role gradients
- Disable it to assign clean, solid color

Style dozens of roles in seconds, with or without gradients.

---

## Palettes = Instant Design System

Use a palette when you want one source of truth for a brand, event, premium tier, or visual theme.

```ts
const fiesta = palette("fiesta");

const heroGradient = fiesta.gradient();
const previewSteps = fiesta.gradientSteps(20);

await role.setColors(fiesta.role(0));
```

Typical use cases:

- keep your role colors visually consistent
- preview or generate smooth transitions for banners and assets
- reuse the same palette across embeds, roles, and UI accents

Example:

```ts
const premium = palette("fiesta");

new EmbedBuilder().setColor(premium.color("amberGold"));
await role.setColors(premium.role(0));

const bannerSteps = premium.gradientSteps(12);
```

---

## Built for Speed

Kromatiq is designed for developers who ship fast:

- zero runtime dependencies
- minimal setup
- no breaking changes to your workflow
- works directly with Discord builders

You write less. You get better results.

---

## Error Handling That Helps

Kromatiq does not fail silently.

- suggests close matches for unknown colors
- validates gradients and sequences
- prevents invalid inputs early

You fix issues faster, without guessing.

---

## Recommended Usage

- import `kromatiq/register` once
- use named colors like `"midnightInk"`
- use `palette()` for consistency
- use `roleSequence()` for scaling
- use `color()` for advanced transforms

---

## Final Thought

Your Discord bot is not just code.

It's a product.

And design is what makes it feel valuable.

Kromatiq gives you that edge without the friction.

---

## Entrypoints

- `kromatiq`
- `kromatiq/register`
