import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1)
  const [loading, setLoading] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false) // for button feedback

  const { generateImage } = useContext(AppContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    // ✅ Check token before generating
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login first to generate images!", {
        position: "top-right",
        autoClose: 3000
      })
      navigate("/login")
      return
    }

    // ✅ Check if input is empty
    if (!input.trim()) {
      toast.warn("Please write something to generate!", {
        position: "top-center",
        autoClose: 3000
      })
      // Button shake animation
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setLoading(true)
    setIsImageLoaded(false)

    const generatedImage = await generateImage(input, token) // pass token
    if (generatedImage) {
      setImage(generatedImage)
    } else {
      setLoading(false)
    }
  }

  const handleImgLoad = () => {
    if (!loading) return
    setLoading(false)
    setIsImageLoaded(true)
    setHasResult(true)
  }

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      <div>
        <div className="relative">
          <img
            src={image}
            alt="Generated"
            className="max-w-sm rounded"
            onLoad={handleImgLoad}
          />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
              loading ? 'w-full transition-all duration-[10s]' : 'w-0'
            }`}
          />
        </div>
        {loading && <p>Loading...</p>}
      </div>

      {!hasResult && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to Generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
          />
          <motion.button
            type="submit"
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            whileHover={{scale:1.05}}
            transition={{default: {duration: 0.5}, opacity: {delay: 0.8, duration: 1}}}
          >
            Generate
          </motion.button>
        </div>
      )}

      {hasResult && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            onClick={() => {
              setHasResult(false)
              setIsImageLoaded(false)
              setInput('')
              setImage(assets.sample_img_1)
            }}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
          >
            Generate Another
          </p>
          <a href={image} download className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:scale-105 transition-all duration-300">
            Download
          </a>
        </div>
      )}
    </motion.form>
  )
}

export default Result
