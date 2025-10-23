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
      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
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
      const requestBody: any = {
        prompt: prompt,
        type: promptType,
        isPremium: isPremium,
      };

      if (promptType === 'image' && imageUrl.trim()) {
        requestBody.imageUrl = imageUrl;
      }

      console.log('Sending request:', requestBody);

      const response = await fetch('https://omegatech-api.dixonomega.tech/api/ai/Txt2video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: VideoResponse = await response.json();
      console.log('API Response:', data);

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
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-cyan-400" />
              Video Generator
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Prompt Type Selection */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Input Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPromptType('text')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    promptType === 'text'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-white">Text Prompt</div>
                  <div className="text-sm text-slate-400">Text to video</div>
                </button>
                <button
                  onClick={() => setPromptType('image')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    promptType === 'image'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-white">Image + Text</div>
                  <div className="text-sm text-slate-400">Image to video</div>
                </button>
              </div>
            </div>

            {/* Image URL Input (if image type) */}
            {promptType === 'image' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
            )}

            {/* Prompt Input */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video you want to create..."
                className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none h-32"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={enhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Enhance Prompt
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Premium Toggle */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-white">Premium Mode</div>
                  <div className="text-sm text-slate-400">Higher quality generation</div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setIsPremium(!isPremium)}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      isPremium ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-1 ${
                        isPremium ? 'translate-x-7 ml-1' : 'translate-x-1'
                      }`}
                    ></div>
                  </div>
                </div>
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateVideo}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Video className="w-6 h-6" />
                  Generate Video
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              {generatedVideo && (
                <button
                  onClick={downloadVideo}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                  <p className="text-slate-400">Creating your video...</p>
                  <p className="text-sm text-slate-500 mt-2">This may take a minute</p>
                </div>
              ) : generatedVideo ? (
                <video
                  src={generatedVideo}
                  controls
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center text-slate-500">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Your generated video will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoGenerator;
