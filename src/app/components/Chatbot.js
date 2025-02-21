"use client"

import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import logo from '../../../public/professor_logo.png';
import Image from 'next/image';
import TourGuide from './TourGuide';

export default function Chatbot() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'bot', text: "Hi! I'm your AI professor assistant. How can I help?" }
    ]);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [scraping, setScraping] = useState(false);

    // Create a ref for the chat container
    const chatContainerRef = useRef(null);

    const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const warn = (message) => {

        toast(message, {

            icon: '⚠️',

            style: {

                borderRadius: '10px',

                background: '#f9c22e',

                color: '#000'

            }

        });

    };

    // Effect to scroll to the bottom when chatHistory changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const sendMessage = async () => {
        if (!message.trim()) return;
        const newChat = [...chatHistory, { sender: 'user', text: message }];
        setChatHistory(newChat);
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${URL}/chat/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: message })
            });
            const data = await response.json();
            setChatHistory([...newChat, { sender: 'bot', text: data.response.response }]);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const scrapeData = async () => {
        if (!url.trim()) return;
        setScraping(true);

        try {
            const response = await fetch(`${URL}/scrape/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();
            console.log("Data:", data);

            if (data.code === 100) {
                toast.success(data.message);
                setUrl(""); // Clear input
            } else if (data.code === 300) {
                warn(data.message);
                setUrl("");
            } else {
                toast.error(data.detail);
                setUrl("");
            }
        } catch (error) {
            toast.error("Scraping Error:", error);
        }

        setScraping(false);
    };

    return (
        <div className="flex flex-col h-screen w-full max-w-lg mx-auto border shadow-lg rounded-lg bg-white">

            {/* Include Shepherd TourGuide Component */}
            <TourGuide isOpen={true} />
            {/* Header */}
            <div className="flex flex-row bg-cyan-900 text-white justify-center text-center py-2 text-lg font-semibold rounded-b-lg shadow-md">
                <Image
                    src={logo}
                    alt="Logo"
                    width={50} // Adjust width as needed
                    height={100} // Adjust height as needed
                    style={{ objectFit: 'contain' }} // Use style prop for custom styling 
                    priority
                />
                <div className='p-2'> {/* Adjusted margin-top to move the image down */}
                    AI Rate My Professor
                </div>
            </div>


            {/* URL Input */}
            <div className="p-4 flex gap-2 scrape">
                <input
                    type="text"
                    placeholder="Enter Professor's Page URL"
                    className="flex-1 p-2 border rounded-md outline-none"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    onClick={() => {
                        toast('Scraping and indexing in progress...', {
                            icon: '🤖',
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                        });
                        scrapeData();
                    }}
                    className={`px-4 py-2 rounded-md text-white scrape ${url.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed opacity-50"}`}
                    disabled={!url.trim() || scraping}
                >
                    {scraping ? <span className="flex items-center">
                        <FaSpinner className="animate-spin mr-2" />
                    </span>
                        : "SCRAPE"}
                </button>
            </div>

            {/* Chat Messages */}
            <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 chat-container"
            >
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex ${chat.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow ${chat.sender === 'bot' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                                }`}
                        >
                            <ReactMarkdown
                                className="prose prose-sm max-w-none"
                                components={{
                                    p: ({ node, ...props }) => (
                                        <p className="m-0" {...props} />
                                    ),
                                    a: ({ node, ...props }) => (
                                        <a className="text-blue-200 hover:text-blue-100" {...props} />
                                    ),
                                    code: ({ node, inline, ...props }) => (
                                        inline
                                            ? <code className="bg-blue-600 px-1 rounded" {...props} />
                                            : <code className="block bg-blue-600 p-2 rounded" {...props} />
                                    ),
                                }}
                            >
                                {chat.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-lg max-w-xs text-sm shadow bg-blue-500 text-white flex items-center">
                            <FaSpinner className="animate-spin mr-2" /> Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="p-4 flex gap-2 border-t chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-md outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className={`bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={loading}
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                </button>
            </div>
        </div>
    );
}