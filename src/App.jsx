import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import envelopeImg from './assets/images/valentines-day-envelope.png'

const App = () => {
    const [scene, setScene] = useState(0)
    const nextScene = () => setScene(scene + 1)

    const variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.1 }
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
                            onClick={nextScene}
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
                    className="mx-auto h-fit text-center relative flex flex-col items-center border border-solid border-[#4c422f] leading-relaxed"
                    >
                        <FontAwesomeIcon icon={faHeart} className="glow-icon text-4xl pt-8" />
                        <p></p>
                        <div className="text-[#daa345] flex items-center gap-1 mt-5">
                            <FontAwesomeIcon icon={faHeart} className="" />
                            <h1 className="playwrite">Will you be my Valentine?</h1>
                            <FontAwesomeIcon icon={faHeart} className="" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}

export default App