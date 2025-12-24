import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface EnhancedDescription {
    description: string;
    suggestedSymbol?: string;
}

/**
 * Enhance user-provided token description using GPT-4
 */
export async function enhanceTokenDescription(
    name: string,
    symbol: string,
    userDescription: string
): Promise<EnhancedDescription> {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are a creative crypto meme token writer. Enhance token descriptions to be engaging, humorous, and meme-worthy while maintaining the core idea. Keep descriptions under 280 characters.`,
                },
                {
                    role: 'user',
                    content: `Token Name: ${name}\nSymbol: ${symbol}\nUser Description: ${userDescription}\n\nEnhance this description to be more engaging and meme-worthy:`,
                },
            ],
            max_tokens: 150,
            temperature: 0.8,
        });

        const enhanced = completion.choices[0]?.message?.content?.trim() || userDescription;

        return {
            description: enhanced,
        };
    } catch (error) {
        console.error('OpenAI enhancement failed:', error);
        return { description: userDescription }; // Fallback to original
    }
}

/**
 * Generate DALL·E prompt for token logo
 */
export async function generateLogoPrompt(
    name: string,
    symbol: string,
    description: string
): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert at creating DALL·E image prompts for crypto token logos. Create concise, visual prompts that describe iconic, meme-style logos.`,
                },
                {
                    role: 'user',
                    content: `Token: ${name} (${symbol})\nDescription: ${description}\n\nGenerate a DALL·E prompt for this token's logo (max 100 words):`,
                },
            ],
            max_tokens: 100,
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content?.trim() ||
            `A minimalist crypto token logo for ${name}, featuring ${symbol}`;
    } catch (error) {
        console.error('Logo prompt generation failed:', error);
        return `A minimalist crypto token logo for ${name}`;
    }
}

/**
 * Generate logo image using DALL·E 3
 */
export async function generateLogo(prompt: string): Promise<string> {
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: `${prompt}. Style: flat, minimalist, crypto token logo, transparent background, suitable for token icon`,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
        });

        return response.data[0]?.url || '';
    } catch (error) {
        console.error('DALL·E logo generation failed:', error);
        throw new Error('Failed to generate logo');
    }
}

/**
 * Complete AI-powered token metadata generation
 */
export async function generateTokenMetadata(
    name: string,
    symbol: string,
    userDescription: string
): Promise<{
    description: string;
    logoUrl: string;
    logoPrompt: string;
}> {
    // Step 1: Enhance description
    const { description } = await enhanceTokenDescription(name, symbol, userDescription);

    // Step 2: Generate logo prompt
    const logoPrompt = await generateLogoPrompt(name, symbol, description);

    // Step 3: Generate logo
    const logoUrl = await generateLogo(logoPrompt);

    return {
        description,
        logoUrl,
        logoPrompt,
    };
}
