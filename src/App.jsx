import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'

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
                        <span className="absolute inset-x-0 h-0.5 top-px bg-linear-to-r w-3/4 mx-auto from-transparent via-rose-300 to-transparent"></span>
                        <FontAwesomeIcon icon={faHeart} className="glow-icon text-4xl pt-8" />
                        <h1 className="text-[#d9d5cc] pt-8">Marius made something for you....</h1>
                        <button className="text-[#9d9587] py-5 hover:cursor-pointer">Tap here to begin</button>
                        <span className="absolute inset-x-0 h-0.5 -bottom-px bg-linear-to-r w-3/4 mx-auto from-transparent via-rose-300 to-transparent"></span>
                    </motion.div>
                ) }
            </AnimatePresence>
        </main>
    )
}

export default App