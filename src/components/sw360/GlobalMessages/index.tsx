'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import MessageService from '@/services/message.service'
import { Message } from '@/object-types'
import { Alert } from 'react-bootstrap'
import { FaInfoCircle } from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'


interface Props {
    id?: string
}

const MessageIcon = ( { messageType }: { messageType: string}) => {
    switch (messageType) {
        case 'success':
            return <IoMdCheckmarkCircle />
        case 'danger':
            return <FaInfoCircle />
        default:
            return <FaInfoCircle />
    }
}

function GlobalMessages({ id = 'default-message'}: Props) {
    const pathname = usePathname()
    const autoCloseTime = 7000
    const mounted = useRef(false)
    const [messages, setMessages] = useState<Array<Message>>([])

    useEffect(() => {
        mounted.current = true
        // subscribe to new message notifications
        const subscription = MessageService.enableSubscribing(id)
            .subscribe(message => {
                // clear message when an empty text is received
                if (!message.text) {
                    setMessages(messages => {
                        // filter out messages without 'keepAfterRouteChange' flag
                        const filteredMessages = messages.filter(m => m.keepAfterRouteChange);
                            
                        // remove 'keepAfterRouteChange' flag on the rest
                        return omit(filteredMessages, 'keepAfterRouteChange')
                    });
                } else {
                    // add message to array with unique id
                    message.itemId = Math.random();
                    setMessages(messages => ([...messages, message]))

                    // auto close message if required
                    if (message.autoClose) {
                        setTimeout(() => removeMessage(message), autoCloseTime)
                    }
                }
            })

        // clean up function that runs when the component unmounts
        return () => {
            mounted.current = false

            // unsubscribe to avoid memory leaks
            subscription.unsubscribe()
            MessageService.clear(id)
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    function omit(arr: Array<Message>, key: keyof Message) {
        return arr.map((obj: Message) => {
            return { ...obj, [key]: undefined }
        })
    }

    function removeMessage(message: Message) {
        if (!mounted.current) return
        setMessages(messages => messages.filter(m => m.itemId !== message.itemId))
    };

    return (
        <div className='global-message'>
            {messages.map((message, index) =>
                <Alert key={index} variant={message.type} onClose={() => removeMessage(message)} dismissible>
                    <span>
                        <MessageIcon messageType={message.type} /> {' '}
                        <strong>{message.lead}: </strong>
                        {message.text}
                    </span>
                </Alert>
            )}
        </div>
    );
}

export default GlobalMessages
