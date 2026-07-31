import { NextResponse } from 'next/server'

export async function POST() {
  const response = await fetch(
    `https://api.infomaniak.com/2/ai/${process.env.PRODUCT_ID}/openai/v1/chat/completions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.INFOMANIAK_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            content:
              'Give me 5 French words that are sophisticated, rare, and literary — ' +
              'the kind found in advanced literature or an educated adult vocabulary, ' +
              'not everyday conversational words. Avoid common, simple words. ' +
              'Respond with ONLY a JSON array of 5 strings, no other text, no markdown, no code fences.',
            role: 'user',
          },
        ],
        model: 'qwen3',
      }),
    }
  )

  const data = await response.json()
  console.log(data)

  return NextResponse.json(data)
}
