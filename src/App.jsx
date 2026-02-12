import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import envelopeImg from './assets/images/valentines-day-envelope.png'

const App = () => {
    const [scene, setScene] = useState(0)
    const [note, setNote] = useState("")
    const [loading, setLoading] = useState(false)
    const [writer, setWriter] = useState("Unknown")
    const [showSignature, setShowSignature] = useState(false)
    const [noClicks, setNoClicks] = useState(0)
    const [noMessage, setNoMessage] = useState("")

    const nextScene = () => setScene(scene + 1)

    const noMessages = [
        "That button is shy. Try again.",
        "The stars rearranged themselves. Tap again.",
        "We rehearsed this moment. Encore?",
        "That ‘No’ was cute. Ineffective, but cute."
    ]

    const handleNoClick = () => {
        const nextCount = noClicks + 1
        setNoClicks(nextCount)

        if (nextCount <= 3) {
            setNoMessage(noMessages[nextCount - 1])
        } else {
            setNoMessage(noMessages[3])
        }
    }

    const generateLoveNote = async () => {
        setScene(2)
        setLoading(true)
        setNote("")
        setWriter("")
        setShowSignature(false)

        const res = await fetch("http://localhost:8000/generate-note", {
            method: "POST",
        })

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        setLoading(false)

        let done = false
        let fullText = ""
        let signatureText = ""
        let foundSignature = false
        
        while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading
            const chunk = decoder.decode(value || new Uint8Array(), { stream: true })
            fullText += chunk
            
            // Check if we've hit the signature marker
            if (fullText.includes("[SIGNATURE]")) {
                if (!foundSignature) {
                    foundSignature = true
                    const parts = fullText.split("[SIGNATURE]")
                    setNote(parts[0].trim())
                    signatureText = parts[1] || ""
                } else {
                    // Continue collecting signature text after marker
                    signatureText += chunk
                }
            } else {
                // Normal streaming before signature marker
                setNote(prev => prev + chunk)
            }
            
            // Add delay for smoother streaming effect
            await new Promise(resolve => setTimeout(resolve, 30))
        }

        const placeholderPattern = /\[YOUR NAME\]/gi
        const cleanedSignature = signatureText.replace(placeholderPattern, "").trim()

        // Remove placeholder from any streamed note text as well.
        setNote(prev => prev.replace(placeholderPattern, "").trim())

        // Set the final signature text
        if (cleanedSignature) {
            setWriter(cleanedSignature)
        } else {
            setWriter("Unknown")
        }

        // Delay before showing signature
        setTimeout(() => {
            setShowSignature(true)
        }, 500)
    }




    const variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.1 }
    }

    const afterSignatureContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { delay: 0.2, staggerChildren: 0.18 }
        }
    }

    const afterSignatureItem = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    }

    return (
        <main className="flex w-full bg-[#332f2b] text-white h-screen items-center">
            <AnimatePresence mode="wait">
                { scene === 0 && (
                    <motion.div
                    key="scene0"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="mx-auto h-fit text-center relative flex flex-col items-center"
                    >
                        <span className="absolute inset-x-0 h-0.5 top-px bg-linear-to-r w-3/4 mx-auto from-transparent via-[#e1a847] to-transparent"></span>
                        <FontAwesomeIcon icon={faHeart} className="glow-icon text-4xl pt-8" />
                        <h1 className="text-[#d9d5cc] pt-8">Unknown made something for you....</h1>
                        <button className="text-[#9d9587] py-5 hover:cursor-pointer" onClick={nextScene}>Tap here to begin</button>
                        <span className="absolute inset-x-0 h-0.5 -bottom-px bg-linear-to-r w-3/4 mx-auto from-transparent via-[#e1a847] to-transparent"></span>
                    </motion.div>
                )}

                { scene === 1 && (
                    <motion.div 
                    key="scene1"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="mx-auto h-fit text-center relative flex flex-col items-center leading-relaxed"
                    >
                        <h1 className="font-medium">You have a love letter from</h1>
                        <span className="playwrite text-2xl glow-text mt-3 text-[#e8c8d8]">Unknown</span>
                        <p className="text-[#9d9487] mt-10 font-medium text-sm">TAP TO OPEN YOUR LETTER</p>
                        <motion.img 
                            src={envelopeImg} 
                            alt="Valentine's Letter" 
                            className="mt-10 w-80 hover:cursor-pointer"
                            onClick={generateLoveNote}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                    </motion.div>
                )}

                { scene === 2 && (
                    <motion.div
                    key="scene2"
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className="overflow-scroll overflow-x-hidden mx-auto h-[80vh] text-center relative flex flex-col items-center bg-[#31302c] border border-solid border-[#4c422f] rounded-lg leading-relaxed w-[27%] p-10 scroll-smooth"
                    >
                        <FontAwesomeIcon icon={faHeart} className="small-heart text-4xl pt-8 pb-5" />
                        {loading ? (
                            <p className="text-white text-3xl animate-pulse">Writing your Love note...</p>
                        ) : (
                            <>
                            <p className="text-white text-2xl leading-relaxed">{note}</p>
                            {showSignature && (
                                <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="playwrite text-2xl glow-text mt-3 text-[#e8c8d8]"
                                >
                                {writer}
                                </motion.span>
)}
                            <motion.div
                                variants={afterSignatureContainer}
                                initial="hidden"
                                animate={showSignature ? "visible" : "hidden"}
                                className="w-full flex flex-col items-center"
                            >
                                <motion.div variants={afterSignatureItem} className="text-[#daa345] flex items-center gap-1 mt-8">
                                    <FontAwesomeIcon icon={faHeart} className="" />
                                    <h1 className="playwrite">Will you be my Valentine?</h1>
                                    <FontAwesomeIcon icon={faHeart} className="" />
                                </motion.div>
                                <motion.div
                                    className="mt-6 flex items-center justify-center overflow-hidden"
                                    animate={{ height: noMessage ? "2.75rem" : 0, opacity: noMessage ? 1 : 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    <AnimatePresence>
                                        {noMessage && (
                                            <motion.p
                                                key={noClicks}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="text-sm text-[#f2d7b1] bg-[#3a342b] border border-solid border-[#7b5a2e] px-4 py-2 rounded-md shadow-[0_0_12px_rgba(218,163,69,0.25)]"
                                            >
                                                {noMessage}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                <motion.div variants={afterSignatureItem} className={`mt-8 flex gap-5 items-center ${noClicks >= 4 ? "justify-center" : ""}`}>
                                    <button className="bg-[#eab559] text-black rounded-4xl w-32 py-3 hover:cursor-pointer" onClick={nextScene}>Yes 💕</button>
                                    {noClicks < 4 && (
                                        <button
                                            className="bg-transparent border border-solid border-[#b1a99a] text-[#b1a99a] rounded-4xl w-32 py-3 hover:cursor-pointer"
                                            style={{ transform: `scale(${Math.max(0.7, 1 - noClicks * 0.1)})` }}
                                            onClick={handleNoClick}
                                        >
                                            No 💔
                                        </button>
                                    )}
                                </motion.div>
                            </motion.div>
                            </>
                        )}
                    </motion.div>
                )}

                { scene === 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto h-fit text-center relative flex flex-col items-center px-10"
                    >
                        <h1 className="text-4xl text-center playwrite text-[#e1a847] text-gold-glow">Yay! You're my Valentine! 💕</h1>
                        <p className="text-[#d9d5cc] mt-8 w-[60%] leading-relaxed">Thank you for choosing me. I promise to keep loving you, growing with you, and showing up for you every single day.</p>
                        <button 
                            className="mt-12 bg-transparent border-2 border-solid border-[#e1a847] text-[#e1a847] rounded-lg px-6 py-3.5 hover:cursor-pointer hover:bg-[#e1a847] hover:text-black transition-all duration-300 font-medium shadow-[0_0_20px_rgba(225,168,71,0.3)] hover:shadow-[0_0_30px_rgba(225,168,71,0.5)]" 
                            onClick={() => {
                                setScene(0)
                                setNoClicks(0)
                                setNoMessage("")
                                setNote("")
                                setWriter("Unknown")
                                setShowSignature(false)
                            }}
                        >
                            ✨ Watch This Journey Again ✨
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}

export default App