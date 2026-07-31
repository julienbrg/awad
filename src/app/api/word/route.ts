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
            content: 'Show me 5 words in French',
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
