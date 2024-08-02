'use client'
// import { Textarea } from '@components/ai/textarea'
import { Textarea, Button } from '@nextui-org/react'
import { useChat } from 'ai/react'
// import { Button } from '@components/ai/button'
import { Send } from 'lucide-react'
import Message from './components/Messges'
import { useRef } from 'react'
export default function Home() {
	const { messages, handleSubmit, input, handleInputChange } = useChat()
	const formRef = useRef<HTMLFormElement>(null)
	// function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
	// 	if (e.key === 'Enter' && !e.shiftKey) {
	// 		e.preventDefault()
	// 		formRef.current?.requestSubmit()
	// 	}
	// }
	return (
		<div className='container h-full w-full flex flex-col py-8'>
			<div className='flex-1 overflow-y-auto'>
				{messages.map(message => (
					<Message key={message.id} message={message} />
				))}
			</div>
			<form ref={formRef} onSubmit={handleSubmit} className='mt-auto relative'>
				<Textarea
					style={{ width: '100%', fontSize: '1rem' }}
					label='Question'
					placeholder='Ask a question'
					value={input}
					onChange={handleInputChange}
					// onKeyDown={handleKeyDown}
				/>
				<Button
					type='submit'
					// size='icon'
					disabled={!input}
					className='absolute top-1/2 transform -translate-y-1/2 right-6 rounded-full cursor-pointer'
				>
					<Send size={24} />
				</Button>
			</form>
		</div>
	)
}
