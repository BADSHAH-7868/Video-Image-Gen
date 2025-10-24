import { useState } from 'react';
import { ArrowLeft, Sparkles, Download, Loader2, Video } from 'lucide-react';

interface VideoGeneratorProps {
  onBack: () => void;
}

type PromptType = 'text' | 'image';

interface VideoResponse {
  success?: boolean;
  status?: string;
  videoUrl?: string;
  video_url?: string;
  url?: string;
  message?: string;
  error?: string;
}

function VideoGenerator({ onBack }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [promptType, setPromptType] = useState<PromptType>('text');
  const [imageUrl, setImageUrl] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await fetch(`/api/text/${encodeURIComponent(prompt)}`);
      const enhanced = await response.text();
      setPrompt(enhanced);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      setError('Failed to enhance prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateVideo = async () => {
    if (!prompt.trim()) return;
    if (promptType === 'image' && !imageUrl.trim()) {
      setError('Please provide an image URL');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);

    try {
      const params = new URLSearchParams();
      params.append('prompt', prompt);
      params.append('type', promptType);
      params.append('isPremium', isPremium.toString());
      if (promptType === 'image' && imageUrl.trim()) {
        params.append('imageUrl', imageUrl);
      }

      const response = await fetch('/api/ai/Txt2video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data: VideoResponse = await response.json();
      const videoUrl = data.videoUrl || data.video_url || data.url;

      if (videoUrl) {
        setGeneratedVideo(videoUrl);
      } else if (data.success === false || data.status === 'error') {
        setError(data.message || data.error || 'Failed to generate video');
      } else if (!response.ok) {
        setError(`API error: ${response.status} - ${data.message || 'Unknown error'}`);
      } else {
        setError('No video URL in response. Please try again.');
      }
    } catch (error: any) {
      console.error('Error generating video:', error);
      setError(error.message || 'Failed to generate video. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (!generatedVideo) return;

    const link = document.createElement('a');
    link.href = generatedVideo;
    link.download = `mediaforge-video-${Date.now()}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* FIXED RESPONSIVE HEADER */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex-1 max-w-xs sm:max-w-none px-2 sm:px-0">
              <h1 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center justify-center gap-1 sm:gap-2 truncate">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400 flex-shrink-0" />
                <span className="hidden xs:inline sm:text-base md:text-lg truncate">Video Generator</span>
              </h1>
            </div>
            
            <div className="w-6 sm:w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Prompt Type Selection */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                Input Type
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={() => setPromptType('text')}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ${
                    promptType === 'text'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-white">Text</div>
                  <div className="text-xs text-slate-400">Text to video</div>
                </button>
                <button
                  onClick={() => setPromptType('image')}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ${
                    promptType === 'image'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-white">Image</div>
                  <div className="text-xs text-slate-400">Image to video</div>
                </button>
              </div>
            </div>

            {/* Image URL Input */}
            {promptType === 'image' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-slate-900 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-sm"
                />
              </div>
            )}

            {/* Prompt Input */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create..."
                className="w-full bg-slate-900 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none h-24 sm:h-32 text-sm"
              />

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={enhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      Enhance
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Premium Toggle */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
              <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-2 sm:gap-0">
                <div>
                  <div className="font-medium text-white text-sm">Premium Mode</div>
                  <div className="text-xs sm:text-sm text-slate-400">Higher quality generation</div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="premium-toggle"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="premium-toggle"
                    className={`w-14 h-8 rounded-full transition-colors cursor-pointer peer ${
                      isPremium ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 absolute top-1 ${
                        isPremium ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    ></div>
                  </label>
                </div>
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateVideo}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                  Generate Video
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 sm:p-4 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* FIXED: PERFECT MOBILE VIDEO SCALING */}
          <div className="order-1 lg:order-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-white">Preview</h3>
                {generatedVideo && (
                  <button
                    onClick={downloadVideo}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors text-sm"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                )}
              </div>

              {/* 🔥 PERFECT RESPONSIVE VIDEO CONTAINER */}
              <div className="w-full bg-slate-900 rounded-lg overflow-hidden">
                {/* MOBILE: 100% width, 56% height (16:9) */}
                {/* DESKTOP: aspect-video */}
                <div className="w-full pt-[56.25%] sm:pt-0 sm:aspect-video relative">
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    {isGenerating ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
                        <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400 animate-spin mb-2 sm:mb-4" />
                        <p className="text-slate-400 text-xs sm:text-base text-center">Creating your video...</p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">This may take a minute</p>
                      </div>
                    ) : generatedVideo ? (
                      <video
                        src={generatedVideo}
                        controls
                        className="absolute inset-0 w-full h-full object-contain"
                        playsInline
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
                        <Video className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-4 opacity-50" />
                        <p className="text-sm text-slate-500 text-center">Your generated video will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoGenerator;