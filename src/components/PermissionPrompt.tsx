import { Webcam, Mic } from 'lucide-react'

export default function PermissionPrompt() {
	return (
		<div className='flex flex-col items-center gap-3'>
			<div className='flex items-center gap-3'>
				<Webcam size={40} />
				<Mic size={40} />
			</div>
			<p className='text-center'>
				Пожалуйста, разрешите доступ к микрофону и камере, чтобы присоединиться к звонку
			</p>
		</div>
	)
}
