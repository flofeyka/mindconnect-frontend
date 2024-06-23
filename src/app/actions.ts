'use server'

import { StreamClient } from '@stream-io/node-sdk'

export async function getToken(userId: string) {
	const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY
	const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET

	if (!streamApiKey || !streamApiSecret) {
		throw new Error('Stream api key or secret not set')
	}

	const streamClient = new StreamClient(streamApiKey, streamApiSecret)

	const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60
	const issuedAt = Math.floor(Date.now() / 1000) - 60

	const token = streamClient.createToken(userId, expirationTime, issuedAt)

	console.log(token)

	return token
}

export async function getUsersIds(emailAddresses: string[]) {}
