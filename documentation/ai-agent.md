# AI Agent

## Overview

ElizaICP uses AI to enhance the token creation experience:
- **GPT-4** for description enhancement
- **DALL·E 3** for logo generation

---

## What the AI Does

### 1. Description Enhancement

**Input:** User's raw description
```
"A dog coin for moon missions"
```

**Output:** GPT-4 enhanced version
```
"The ultimate canine cryptocurrency engineered for 
interplanetary wealth generation. DOGE holders, prepare 
for liftoff! 🚀🐕"
```

### 2. Logo Prompt Generation

**Input:** Token name, symbol, description

**Output:** DALL·E prompt
```
"A minimalist crypto token logo featuring a cartoon dog 
in an astronaut suit, purple and blue gradient background, 
flat design, suitable for token icon"
```

### 3. Logo Image Generation

**Input:** Logo prompt

**Output:** 1024x1024 PNG image URL

---

## Prompting Strategy

### Description Enhancement Prompt
```typescript
{
  role: 'system',
  content: `You are a creative crypto meme token writer. 
    Enhance token descriptions to be engaging, humorous, 
    and meme-worthy while maintaining the core idea. 
    Keep descriptions under 280 characters.`
}
```

### Logo Prompt Generation
```typescript
{
  role: 'system',
  content: `You are an expert at creating DALL·E image 
    prompts for crypto token logos. Create concise, 
    visual prompts that describe iconic, meme-style logos.`
}
```

### Logo Style Suffix
```typescript
prompt += `. Style: flat, minimalist, crypto token logo, 
  transparent background, suitable for token icon`
```

---

## Safety Constraints

### Content Moderation
- OpenAI's built-in content filters active
- No NSFW content possible
- Hate speech rejected

### Rate Limiting
```typescript
const LIMITS = {
  AI_GENERATION: { max: 10, windowMs: 3600000 }  // 10/hr
};
```

### Cost Protection
- Internal counter for hourly API calls
- Graceful degradation on limit hit
- Fallback to user's original description

---

## Code Examples

### Description Enhancement
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [...],
  max_tokens: 150,
  temperature: 0.8,  // Creative but controlled
});
```

### Logo Generation
```typescript
const response = await openai.images.generate({
  model: 'dall-e-3',
  prompt: enhancedPrompt,
  n: 1,
  size: '1024x1024',
  quality: 'standard',
});
```

---

## Fallback Behavior

| Failure | Fallback |
|---------|----------|
| GPT-4 timeout | Use original description |
| DALL·E failure | Error message, retry prompt |
| Rate limit | Notify user to wait |
| Invalid content | Reject, ask to revise |

---

## Cost Estimates

| Operation | Cost |
|-----------|------|
| GPT-4 enhancement | ~$0.01 |
| DALL·E generation | ~$0.04 |
| **Total per token** | **~$0.05** |

At 100 tokens/day = ~$5/day in AI costs.
