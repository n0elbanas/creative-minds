import Message from "../components/message"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { auth, db } from "../utils/firebase"
import { toast } from "react-toastify"
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function Details() {
	const router = useRouter()
	const routeData = router.query
	const [message, setMessage] = useState("")
	const [allMessages, setAllMessages] = useState([])
    let now = dayjs()

    // Submit a message
    const submitMessage = async () => {
        // check if user is logged
        if(!auth.currentUser) return router.push('/auth/login')

        if(!message) {
            toast.error('Message cannot be empty!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            })
        return
        }

        const docRef = doc(db, 'posts', routeData.id)
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                timestamp: now.format(),
            })
        })
        setMessage('')
    }

    // Get comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id)
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setAllMessages(snapshot.data().comments)
        })
        return unsubscribe
    }

    useEffect(() => {
        if(!router.isReady) return
        getComments()
    }, [router.isReady])

	return (
		<div>
			<Message {...routeData}></Message>
			<div className='my-4'>
				<div className='flex'>
					<input
						type='text'
						value={message}
						placeholder='Send a message'
						onChange={(e) => setMessage(e.target.value)}
						className='bg-gray-800 w-full p-2 text-white text-sm'
					/>
                    <button 
                        onClick={submitMessage}
                        className="bg-cyan-500 text-white py-2 px-4 text-sm"
                    >
                        Submit</button>
				</div>
                <div className="py-6">
                    <h2 className="font-bold">Comments</h2>
                    {allMessages?.map((message) => (
                        <div className="bg-white p-4 my-4 border-2" key={message.timestamp}>
                            <div  className='flex items-center gap-2 mb-4'>
                                <img className='w-8 rounded-full' src={message.avatar} alt="" />
                                <h2 className="text-sm">{message.username}</h2>
                            </div>
                            <h2>{message.message}</h2>
                            <h4 className="text-gray-600 text-xs">{dayjs(message.timestamp).fromNow()}</h4>
                        </div>
                    ))}
                </div>
			</div>
		</div>
	)
}
