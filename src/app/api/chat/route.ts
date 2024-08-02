import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
	try {
		const { messages } = await req.json()

		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			stream: true,
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful assistant, who can support a person in difficult situations.',
				},
				...messages,
			],
		})

		// Check if the response is ok
		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.error.message ||
					'An error occurred while processing your request.'
			)
		}

		const stream = OpenAIStream(response)
		return new StreamingTextResponse(stream)
	} catch (error) {
		console.error('Error in API route:', error)
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
