'use client'

import { useState, useRef, useEffect } from 'react'
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoPlayerProps {
  videoUrl: string
  posterUrl?: string
  title?: string
  duration?: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
}

// Helper function to detect YouTube URLs
const isYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/
  return youtubeRegex.test(url)
}

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

// YouTube Player Component
const YouTubePlayer = ({ videoId, posterUrl, title, className }: {
  videoId: string
  posterUrl?: string
  title?: string
  className?: string
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

  return (
    <div className={`relative group ${className}`}>
      {!isPlaying ? (
        <>
          <div 
            className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            {posterUrl && (
              <img
                src={posterUrl}
                alt={title || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <PlayIcon className="w-6 h-6 text-gray-900 ml-1" />
              </motion.button>
            </div>
            {title && (
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-medium text-lg drop-shadow-lg">{title}</h3>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <iframe
            src={embedUrl}
            title={title || 'YouTube video'}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}

// Native Video Player Component
const NativeVideoPlayer = ({ videoUrl, posterUrl, title, autoPlay = false, controls = true, className }: {
  videoUrl: string
  posterUrl?: string
  title?: string
  autoPlay?: boolean
  controls?: boolean
  className?: string
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => setIsMuted(video.muted)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    video.currentTime = newTime
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleMouseMove = () => {
    showControlsTemporarily()
  }

  const handleClick = () => {
    if (!showControls) {
      showControlsTemporarily()
    } else {
      togglePlay()
    }
  }

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className="w-full h-full object-cover rounded-xl"
        autoPlay={autoPlay}
        muted={autoPlay} // Auto-play videos should be muted by default
        playsInline
      />
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Custom Controls */}
      {controls && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl pointer-events-none"
            >
              {/* Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                  }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 pointer-events-auto"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-6 h-6 text-white" />
                  ) : (
                    <PlayIcon className="w-6 h-6 text-white ml-1" />
                  )}
                </motion.button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
                {/* Progress Bar */}
                <div 
                  className="w-full h-2 bg-white/20 rounded-full mb-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSeek(e)
                  }}
                >
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-200"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMute()
                      }}
                      className="text-white hover:text-gray-300 transition-colors duration-200"
                    >
                      {isMuted ? (
                        <SpeakerXMarkIcon className="w-5 h-5" />
                      ) : (
                        <SpeakerWaveIcon className="w-5 h-5" />
                      )}
                    </button>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  {title && (
                    <h3 className="text-white font-medium text-sm truncate max-w-xs">{title}</h3>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

// Main Video Player Component
export default function VideoPlayer({
  videoUrl,
  posterUrl,
  title,
  duration,
  className = '',
  autoPlay = false,
  controls = true
}: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No video available</p>
      </div>
    )
  }

  // Check if it's a YouTube video
  if (isYouTubeUrl(videoUrl)) {
    const videoId = getYouTubeVideoId(videoUrl)
    if (videoId) {
      return (
        <YouTubePlayer
          videoId={videoId}
          posterUrl={posterUrl}
          title={title}
          className={className}
        />
      )
    }
  }

  // Use native video player for regular video files
  return (
    <NativeVideoPlayer
      videoUrl={videoUrl}
      posterUrl={posterUrl}
      title={title}
      autoPlay={autoPlay}
      controls={controls}
      className={className}
    />
  )
}