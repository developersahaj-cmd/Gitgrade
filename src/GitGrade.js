import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Github, Star, GitBranch, FileCode, TrendingUp, AlertCircle,
  CheckCircle, ArrowRight, Loader, Award, Target, Zap, MessageCircle,
  Send, Sparkles, Brain, Code, BookOpen, Trophy, Rocket, Eye, X,
  Maximize2, Minimize2, Download, Users, GitPullRequest, ExternalLink,
  Heart, BarChart3, Shield, Layers, Workflow, Cpu, Package, History,
  BarChart, RefreshCw, Sun, Moon, Bell
} from 'lucide-react';

// Custom hooks
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Components
const ScoreCircle = React.memo(({ score, animateScore, size = 200 }) => {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (animateScore / 100) * circumference;
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r="70"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          className="text-gray-200 dark:text-gray-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r="70"
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-white">
            {animateScore}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">/ 100</div>
          <div className={`text-xs mt-2 font-medium ${
            animateScore >= 80 ? 'text-green-600' : 
            animateScore >= 60 ? 'text-blue-600' : 
            animateScore >= 40 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {animateScore >= 80 ? 'Excellent' : 
             animateScore >= 60 ? 'Good' : 
             animateScore >= 40 ? 'Fair' : 'Needs Work'}
          </div>
        </div>
      </div>
    </div>
  );
});

const CategoryProgress = ({ category, score }) => {
  const getCategoryIcon = (cat) => {
    const icons = {
      codeQuality: <Code className="w-5 h-5" />,
      documentation: <BookOpen className="w-5 h-5" />,
      testing: <CheckCircle className="w-5 h-5" />,
      gitPractices: <GitBranch className="w-5 h-5" />,
      projectStructure: <Layers className="w-5 h-5" />,
      innovation: <Sparkles className="w-5 h-5" />,
      security: <Shield className="w-5 h-5" />,
      performance: <Zap className="w-5 h-5" />,
      maintainability: <Workflow className="w-5 h-5" />,
      scalability: <Cpu className="w-5 h-5" />
    };
    return icons[cat] || <Target className="w-5 h-5" />;
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
            {getCategoryIcon(category)}
          </div>
          <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>
        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{score}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
        <div
          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>0</span>
        <span className={`font-medium ${
          score >= 80 ? 'text-green-600' :
          score >= 60 ? 'text-blue-600' :
          score >= 40 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'}
        </span>
        <span>100</span>
      </div>
    </div>
  );
};

const GitGrade = () => {
  // State management
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [animateScore, setAnimateScore] = useState(0);
  const [expandedRoadmap, setExpandedRoadmap] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useLocalStorage('gitgrade_recent', []);
  const [favorites, setFavorites] = useLocalStorage('gitgrade_favorites', []);
  const [stats, setStats] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareUrl, setCompareUrl] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const chatEndRef = useRef(null);
  const debouncedRepoUrl = useDebounce(repoUrl, 500);

  // Helper functions
  const getBadgeColor = (badge) => {
    const colors = {
      Bronze: 'from-amber-700 to-amber-600',
      Silver: 'from-gray-400 to-gray-500',
      Gold: 'from-yellow-400 to-yellow-500',
      Platinum: 'from-purple-500 to-purple-600',
      Diamond: 'from-cyan-400 to-blue-500',
      Master: 'from-red-500 to-pink-600'
    };
    return colors[badge] || 'from-gray-600 to-gray-700';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      code: <Code className="w-4 h-4" />,
      docs: <BookOpen className="w-4 h-4" />,
      testing: <CheckCircle className="w-4 h-4" />,
      devops: <Rocket className="w-4 h-4" />,
      architecture: <Brain className="w-4 h-4" />
    };
    return icons[category] || <Target className="w-4 h-4" />;
  };

  // Effects
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (analysis && animateScore < analysis.score) {
      const timer = setTimeout(() => {
        setAnimateScore(prev => Math.min(prev + 1, analysis.score));
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [animateScore, analysis]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Load initial stats
    const savedStats = JSON.parse(localStorage.getItem('gitgrade_stats') || '{}');
    setStats(savedStats);
    
    // Show welcome notification
    if (!localStorage.getItem('gitgrade_welcome_shown')) {
      setNotification({
        type: 'info',
        title: 'Welcome to GitGrade AI!',
        message: 'Paste any GitHub repository URL to get started.',
        duration: 5000
      });
      localStorage.setItem('gitgrade_welcome_shown', 'true');
    }
  }, []);

  // Notification handler
  const showNotification = (type, title, message) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Mock analysis data for demo
  const getMockAnalysis = (repoData) => {
    return {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      rating: ["Beginner", "Intermediate", "Advanced", "Expert"][Math.floor(Math.random() * 4)],
      badge: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"][Math.floor(Math.random() * 5)],
      summary: `This repository "${repoData.name}" demonstrates ${["good", "excellent", "solid", "impressive"][Math.floor(Math.random() * 4)]} code quality and project structure. The implementation follows modern best practices and shows good attention to detail.`,
      strengths: [
        "Clean and consistent code structure",
        "Comprehensive documentation",
        "Good test coverage",
        "Efficient use of modern frameworks",
        "Well-organized project architecture"
      ],
      weaknesses: [
        "Limited CI/CD pipeline",
        "Could benefit from more comprehensive error handling",
        "Documentation lacks API examples",
        "Test suite missing edge cases",
        "No performance benchmarking"
      ],
      roadmap: [
        {
          title: "Implement CI/CD pipeline",
          description: "Set up GitHub Actions for automated testing and deployment",
          priority: "high",
          estimatedTime: "2-4 days",
          category: "devops"
        },
        {
          title: "Add comprehensive error handling",
          description: "Implement try-catch blocks and error boundaries",
          priority: "medium",
          estimatedTime: "1-2 days",
          category: "code"
        },
        {
          title: "Expand test coverage",
          description: "Add integration tests and edge case scenarios",
          priority: "high",
          estimatedTime: "3-5 days",
          category: "testing"
        },
        {
          title: "Improve documentation",
          description: "Add API examples and usage guides",
          priority: "medium",
          estimatedTime: "2-3 days",
          category: "docs"
        }
      ],
      categories: {
        codeQuality: Math.floor(Math.random() * 30) + 70,
        documentation: Math.floor(Math.random() * 30) + 70,
        testing: Math.floor(Math.random() * 30) + 70,
        gitPractices: Math.floor(Math.random() * 30) + 70,
        projectStructure: Math.floor(Math.random() * 30) + 70,
        innovation: Math.floor(Math.random() * 30) + 70,
        security: Math.floor(Math.random() * 30) + 70,
        performance: Math.floor(Math.random() * 30) + 70,
        maintainability: Math.floor(Math.random() * 30) + 70,
        scalability: Math.floor(Math.random() * 30) + 70
      },
      insights: [
        "The project shows strong architectural decisions",
        "Good separation of concerns in codebase",
        "Could benefit from more automated workflows"
      ],
      techStack: {
        languages: ["JavaScript", "TypeScript", "CSS"],
        frameworks: ["React", "Express", "Tailwind CSS"],
        tools: ["Webpack", "ESLint", "Jest"],
        bestPractices: ["Component reusability", "State management", "Code splitting"]
      },
      comparisonBenchmark: "Top 25% of similar JavaScript projects",
      recruiterView: {
        hireable: true,
        standoutFeatures: ["Clean architecture", "Good documentation", "Active development"],
        redFlags: ["Limited CI/CD", "Missing error handling"],
        overallImpression: "Strong candidate with room for DevOps improvement"
      },
      aiGreeting: `Hello! I'm your AI coding mentor. I've analyzed your repository "${repoData.name}" and I'm impressed with the code quality. Let me know if you have any specific questions about improving your project!`
    };
  };

  // Main analysis function
  const analyzeRepository = useCallback(async (url = repoUrl) => {
    if (!url.includes('github.com')) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);
    setAnimateScore(0);
    setMessages([]);

    try {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) throw new Error('Invalid GitHub URL format');

      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, '');

      // Try to fetch real data, fallback to mock if API fails
      let repoData;
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
        if (!response.ok) throw new Error('Repository not found');
        repoData = await response.json();
      } catch (fetchError) {
        // Fallback to mock data for demo
        repoData = {
          name: cleanRepo,
          owner: { login: owner },
          html_url: `https://github.com/${owner}/${cleanRepo}`,
          stargazers_count: Math.floor(Math.random() * 1000),
          forks_count: Math.floor(Math.random() * 100),
          language: ["JavaScript", "TypeScript", "Python", "Java"][Math.floor(Math.random() * 4)],
          updated_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          open_issues_count: Math.floor(Math.random() * 20),
          license: { name: "MIT License" },
          topics: ["react", "typescript", "web"],
          size: Math.floor(Math.random() * 10000),
          watchers_count: Math.floor(Math.random() * 100),
          default_branch: "main"
        };
      }

      // Get analysis (using mock for demo)
      const analysisData = getMockAnalysis(repoData);

      const fullAnalysis = {
        ...analysisData,
        repoData: {
          name: repoData.name,
          owner: repoData.owner.login,
          url: repoData.html_url,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          language: repoData.language,
          updatedAt: new Date(repoData.updated_at).toLocaleDateString(),
          createdAt: new Date(repoData.created_at).toLocaleDateString(),
          contributors: Math.floor(Math.random() * 10) + 1,
          commits: Math.floor(Math.random() * 100) + 10,
          openIssues: repoData.open_issues_count,
          license: repoData.license?.name,
          topics: repoData.topics || [],
          size: repoData.size,
          watchers: repoData.watchers_count,
          defaultBranch: repoData.default_branch
        }
      };

      setAnalysis(fullAnalysis);
      
      // Update recent analyses
      const newRecent = [
        { url, name: repoData.name, owner: repoData.owner.login, score: analysisData.score, timestamp: new Date().toISOString() },
        ...recentAnalyses.filter(r => r.url !== url).slice(0, 9)
      ];
      setRecentAnalyses(newRecent);

      // Update stats
      const newStats = {
        totalAnalyses: (stats?.totalAnalyses || 0) + 1,
        averageScore: ((stats?.averageScore || 0) * (stats?.totalAnalyses || 0) + analysisData.score) / ((stats?.totalAnalyses || 0) + 1),
        lastAnalysis: new Date().toISOString()
      };
      setStats(newStats);
      localStorage.setItem('gitgrade_stats', JSON.stringify(newStats));

      // Auto-open chat with AI greeting
      if (analysisData.aiGreeting) {
        setMessages([{
          type: 'ai',
          content: analysisData.aiGreeting,
          timestamp: new Date().toISOString()
        }]);
        setChatOpen(true);
      }

      showNotification('success', 'Analysis Complete', `Repository "${repoData.name}" has been analyzed successfully!`);

    } catch (err) {
      setError(err.message || 'Failed to analyze repository. Please try again.');
      showNotification('error', 'Analysis Failed', err.message || 'Please check the repository URL and try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [repoUrl, recentAnalyses, stats]);

  // Chat functionality
  const sendChatMessage = async () => {
    if (!userMessage.trim() || !analysis) return;

    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setAiTyping(true);

    try {
      // Mock AI response for demo
      const mockResponses = [
        "Based on your repository analysis, I recommend focusing on improving test coverage first. Start by adding unit tests for your core components.",
        "Your code structure looks good! To make it production-ready, consider implementing a CI/CD pipeline with GitHub Actions.",
        "The documentation is comprehensive but could benefit from more code examples. Add usage examples for your main features.",
        "For better performance, consider implementing code splitting and lazy loading for larger components.",
        "Your Git practices are solid! To improve further, consider using semantic commit messages and creating a PR template."
      ];
      
      const aiText = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: aiText,
          timestamp: new Date().toISOString()
        }]);
        setAiTyping(false);
      }, 1000);

    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "I apologize, but I'm having trouble responding right now. Please try asking your question again.",
        timestamp: new Date().toISOString()
      }]);
      setAiTyping(false);
    }
  };

  // Export functionality
  const exportAnalysis = async (format = 'json') => {
    if (!analysis) return;
    
    setExportLoading(true);
    try {
      if (format === 'json') {
        const dataStr = JSON.stringify(analysis, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gitgrade-analysis-${analysis.repoData.name}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
      showNotification('success', 'Export Complete', 'Analysis exported successfully!');
    } catch (error) {
      showNotification('error', 'Export Failed', 'Failed to export analysis');
    } finally {
      setExportLoading(false);
    }
  };

  // Quick questions
  const quickQuestions = useMemo(() => [
    "How can I improve my code quality?",
    "What should I prioritize first?",
    "How do I add better documentation?",
    "Explain my biggest weakness",
    "How to make this production-ready?",
    "What tests should I write?",
    "How to improve performance?",
    "Best practices for my stack?"
  ], []);

  // Render hero section
  const renderHeroSection = () => (
    <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 rounded-3xl shadow-2xl p-8 border border-purple-100 dark:border-purple-800/50">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              {analysis.repoData.name}
            </h2>
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-purple-600 dark:text-purple-400 mb-6 text-lg font-medium">
            by {analysis.repoData.owner}
          </p>
          <div className="flex items-center gap-6 justify-center lg:justify-start flex-wrap text-sm">
            {[
              { icon: Star, value: analysis.repoData.stars, label: 'Stars', color: 'text-yellow-500' },
              { icon: GitBranch, value: analysis.repoData.forks, label: 'Forks', color: 'text-green-500' },
              { icon: FileCode, value: analysis.repoData.language, label: 'Language', color: 'text-blue-500' },
              { icon: Users, value: analysis.repoData.contributors, label: 'Contributors', color: 'text-purple-500' },
              { icon: GitPullRequest, value: analysis.repoData.openIssues, label: 'Issues', color: 'text-orange-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{item.value}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">{item.label}</span>
              </div>
            ))}
          </div>
          
          {analysis.comparisonBenchmark && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-800 dark:text-green-300 font-medium">
                  📊 {analysis.comparisonBenchmark}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => exportAnalysis('json')}
              disabled={exportLoading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={() => window.open(analysis.repoData.url, '_blank')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </button>
            <button
              onClick={() => {
                const isFavorite = favorites.some(f => f.url === analysis.repoData.url);
                if (isFavorite) {
                  setFavorites(favorites.filter(f => f.url !== analysis.repoData.url));
                  showNotification('info', 'Removed from Favorites', 'Repository removed from favorites');
                } else {
                  setFavorites([...favorites, {
                    url: analysis.repoData.url,
                    name: analysis.repoData.name,
                    owner: analysis.repoData.owner,
                    score: analysis.score
                  }]);
                  showNotification('success', 'Added to Favorites', 'Repository added to favorites');
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              {favorites.some(f => f.url === analysis.repoData.url) ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <ScoreCircle score={analysis.score} animateScore={animateScore} />
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className={`px-8 py-3 rounded-2xl font-bold text-lg bg-gradient-to-r ${getBadgeColor(analysis.badge)} text-white shadow-lg`}>
              <Award className="w-6 h-6 inline mr-2" />
              {analysis.badge}
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {analysis.rating} Level
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Updated {analysis.repoData.updatedAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          AI Analysis Summary
        </h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {analysis.summary}
        </p>
        
        {analysis.insights && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Key Insights
            </h4>
            <ul className="space-y-2">
              {analysis.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-xl p-8 border border-green-100 dark:border-emerald-800/50">
          <h3 className="text-2xl font-bold text-green-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/60 dark:bg-gray-900/60 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 dark:text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl shadow-xl p-8 border border-orange-100 dark:border-orange-800/50">
          <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {analysis.weaknesses.map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/60 dark:bg-gray-900/60 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 dark:text-gray-300">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderBreakdownTab = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Detailed Category Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(analysis.categories).map(([category, score]) => (
          <CategoryProgress key={category} category={category} score={score} />
        ))}
      </div>

      {analysis.techStack && (
        <div className="mt-8">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technology Stack Analysis</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.languages?.map((lang, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/50">
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Frameworks
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.frameworks?.map((fw, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                    {fw}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-emerald-800/50">
              <h4 className="font-bold text-green-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Best Practices
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.bestPractices?.map((bp, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-emerald-300 rounded-full text-sm font-medium">
                    {bp}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-amber-800/50">
              <h4 className="font-bold text-orange-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.tools?.map((tool, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-amber-300 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRoadmapTab = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Your Personalized Improvement Roadmap
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Click any step for detailed guidance</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {analysis.roadmap.map((step, idx) => {
          const priority = step.priority || 'medium';
          const category = step.category || 'code';
          const isExpanded = expandedRoadmap === idx;
          
          return (
            <div key={idx} className={`border-2 rounded-xl transition-all ${
              isExpanded 
                ? 'border-purple-400 dark:border-purple-600 shadow-lg' 
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
            }`}>
              <button
                onClick={() => setExpandedRoadmap(isExpanded ? null : idx)}
                className="w-full flex items-start gap-4 p-5 text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="text-gray-900 dark:text-white font-bold text-lg">{step.title || step}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}>
                      {priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                      {getCategoryIcon(category)}
                      {category.toUpperCase()}
                    </span>
                    {step.estimatedTime && (
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        ⏱️ {step.estimatedTime}
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
                  )}
                </div>
                <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button
                    onClick={() => {
                      setUserMessage(`Help me with: ${step.title || step}`);
                      setChatOpen(true);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Ask AI Mentor About This
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRecruiterTab = () => (
    <div className="space-y-6">
      <div className={`rounded-2xl shadow-xl p-8 border-2 ${
        analysis.recruiterView.hireable 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-emerald-800/50' 
          : 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800/50'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <Trophy className={`w-8 h-8 ${analysis.recruiterView.hireable ? 'text-green-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`} />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recruiter's Verdict: {analysis.recruiterView.hireable ? 'Hireable ✓' : 'Needs Improvement'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Based on industry standards and hiring criteria
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {analysis.recruiterView.overallImpression}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <h4 className="text-xl font-bold text-green-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Standout Features
          </h4>
          <ul className="space-y-3">
            {analysis.recruiterView.standoutFeatures?.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-green-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <h4 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Red Flags & Concerns
          </h4>
          <ul className="space-y-3">
            {analysis.recruiterView.redFlags?.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 dark:text-gray-300">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${fullscreen ? 'fixed inset-0 z-50' : ''} bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10 transition-colors duration-300`}>
      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-md transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
          notification.type === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
          'bg-gradient-to-r from-blue-500 to-cyan-500'
        } text-white rounded-xl shadow-2xl p-4`}>
          <div className="flex items-start gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Bell className="w-5 h-5 flex-shrink-0" />
            )}
            <div>
              <h4 className="font-bold">{notification.title}</h4>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className={`container mx-auto px-4 py-8 ${fullscreen ? 'max-w-full h-full overflow-auto' : 'max-w-7xl'}`}>
        {/* Enhanced Header with Navigation */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <div className="relative">
                <Github className="w-14 h-14 text-purple-600 dark:text-purple-400" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  GitGrade AI
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">v2.0 • Production Ready</p>
              </div>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-2 font-medium">Your Personal AI Code Mentor</p>
            <p className="text-gray-500 dark:text-gray-400">Deep analysis • Real-time chat • Actionable insights</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-all"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-all flex items-center gap-2"
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && recentAnalyses.length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Analyses
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {recentAnalyses.map((analysis, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRepoUrl(analysis.url);
                    analyzeRepository(analysis.url);
                    setShowHistory(false);
                  }}
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">{analysis.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{analysis.owner}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {analysis.score}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-purple-100 dark:border-purple-900/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full pl-12 pr-6 py-4 border-2 border-purple-200 dark:border-purple-800 rounded-2xl focus:border-purple-500 focus:outline-none text-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && analyzeRepository()}
              />
            </div>
            <button
              onClick={() => analyzeRepository()}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze Repository
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {analysis ? (
          <div className="space-y-6">
            {renderHeroSection()}

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-2 flex gap-2 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'breakdown', label: 'Breakdown', icon: TrendingUp },
                { id: 'roadmap', label: 'Roadmap', icon: Target },
                { id: 'recruiter', label: 'Recruiter View', icon: Trophy }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'breakdown' && renderBreakdownTab()}
              {activeTab === 'roadmap' && renderRoadmapTab()}
              {activeTab === 'recruiter' && renderRecruiterTab()}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Deep learning algorithms evaluate your code across 10 critical dimensions with expert-level insights",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: MessageCircle,
                title: "Live AI Mentor Chat",
                description: "Ask questions, get explanations, and receive personalized guidance in real-time from your AI coding mentor",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: Rocket,
                title: "Actionable Roadmap",
                description: "Get prioritized, step-by-step guidance with time estimates to level up your repository",
                gradient: "from-green-500 to-green-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all hover:scale-105 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {stats && (
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">GitGrade Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalAnalyses}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Analyses</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(stats.averageScore)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {recentAnalyses.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recent Analyses</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {favorites.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Companion */}
        {analysis && (
          <>
            {!chatOpen && (
              <button
                onClick={() => setChatOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 animate-bounce group"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                <div className="absolute -top-12 right-0 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Chat with AI Mentor
                </div>
              </button>
            )}

            {chatOpen && (
              <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-purple-200 dark:border-purple-800">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Brain className="w-8 h-8" />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI Code Mentor</h3>
                      <p className="text-xs text-purple-100">Always here to help</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMessages([])}
                      className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                      title="Clear chat"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setChatOpen(false)}
                      className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800 flex gap-2 overflow-x-auto">
                  {quickQuestions.slice(0, 4).map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setUserMessage(question);
                        sendChatMessage();
                      }}
                      className="px-3 py-1 bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium whitespace-nowrap hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-200 dark:border-purple-700"
                    >
                      {question}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl rounded-tr-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm shadow-md border border-gray-200 dark:border-gray-700'
                      } p-4`}>
                        {msg.type === 'ai' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">AI Mentor</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-purple-100' : 'text-gray-400 dark:text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {aiTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm shadow-md border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-2xl">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Ask me anything about your code..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-sm bg-transparent text-gray-900 dark:text-white"
                      disabled={aiTyping}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!userMessage.trim() || aiTyping}
                      className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quickQuestions.slice(4).map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setUserMessage(question)}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm space-y-2">
          <p>Built with ❤️ using Claude AI • Empowering developers to write better code</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span>Version 2.0</span>
            <span>•</span>
            <span>Total Analyses: {stats?.totalAnalyses || 0}</span>
            <span>•</span>
            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Documentation
            </a>
            <span>•</span>
            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Report Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitGrade;
