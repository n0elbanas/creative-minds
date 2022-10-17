import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function Message({ children, avatar, username, description, timestamp }) {
	return (
		<div className="bg-white p-8 border-b-2 rounded-lg">
			<div className="flex items-center gap-2">
				<img src={avatar} className='w-10 rounded-full' />
				<h2>{username}</h2>
				<h4 className="text-gray-600 text-xs ml-auto">{dayjs(timestamp).fromNow()}</h4>
			</div>
			<div className="py-4">
				<p>{description}</p>
			</div>
			{children}
		</div>
	)
}
