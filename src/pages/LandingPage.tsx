import { Image, Video, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'image' | 'video') => void;
}

function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden ">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <div className="mt-8 sm:mt-0 mb-8 flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-12 h-12 text-cyan-400" />
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            AhsanLabs Video Gen
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-slate-300 mb-16 text-center max-w-2xl animate-fade-in-delay">
          Transform your ideas into stunning visuals and videos with AI-powered generation
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Image Generator Card */}
          <button
            onClick={() => onNavigate('image')}
            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 animate-slide-in-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-300"></div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Image className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">Image Generator</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Create breathtaking images from text prompts using advanced Flux AI models
              </p>

              <div className="mt-6 flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                Start Creating
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Video Generator Card */}
          <button
            onClick={() => onNavigate('video')}
            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 animate-slide-in-right"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300"></div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Video className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">Video Generator</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Transform text and images into captivating videos with AI technology
              </p>

              <div className="mt-6 flex items-center text-cyan-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                Start Creating
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl text-center">
          <div className="animate-fade-in-delay-2">
            <div className="text-blue-400 text-4xl font-bold mb-2">AI-Powered</div>
            <div className="text-slate-400">Advanced models for stunning results</div>
          </div>
          <div className="animate-fade-in-delay-3">
            <div className="text-cyan-400 text-4xl font-bold mb-2">Lightning Fast</div>
            <div className="text-slate-400">Generate content in seconds</div>
          </div>
          <div className="animate-fade-in-delay-4">
            <div className="text-blue-400 text-4xl font-bold mb-2">No Limits</div>
            <div className="text-slate-400">Create as much as you want</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;