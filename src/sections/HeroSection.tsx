import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { gsap } from 'gsap';
import { Phone, AlertTriangle, Users, Scale, ChevronDown, ExternalLink, AlertCircle, History, Globe, BookOpen } from 'lucide-react';
import { Changelog } from '@/components/Changelog';
import type { Difficulty } from '@/types/game';

interface HeroSectionProps {
  onStartGame: (difficulty: Difficulty, enableAI: boolean) => void;
}

export function HeroSection({ onStartGame }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [enableAI, setEnableAI] = useState(true);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.3 }
      );
      gsap.fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo(buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.9 }
      );
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('.feature-card');
        gsap.fromTo(cards,
          { y: 60, opacity: 0, rotateX: 15 },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 1.1 }
        );
      }
      if (linksRef.current) {
        const linkCards = linksRef.current.querySelectorAll('.link-card');
        gsap.fromTo(linkCards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 1.3 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const difficultyConfig = {
    easy: { name: '简易', color: 'bg-green-500', description: '校长怕事，教育局相对公正' },
    medium: { name: '中等', color: 'bg-yellow-500', description: '标准难度，平衡体验' },
    hard: { name: '地狱', color: 'bg-red-500', description: '校长强硬，教育局护短，时间紧迫，金钱限制' }
  };

  const features = [
    { icon: Scale, title: '策略模拟', desc: '基于现实逻辑的回合制游戏' },
    { icon: Phone, title: '多渠道举报', desc: '电话、网络、现场多种选择' },
    { icon: Users, title: '随机事件', desc: '政策变化、学校应对、同学反应' },
    { icon: AlertTriangle, title: '风险评估', desc: '暴露风险、学校压力、教育局忌惮' }
  ];

  return (
    <div 
        ref={containerRef}
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#1d3557]"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#e63946] rounded-full filter blur-[150px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#457b9d] rounded-full filter blur-[120px] animate-pulse" />
        </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/20 border border-amber-400/50 rounded-full mb-6">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">仅供娱乐 · 请勿模仿违法行为</span>
          </div>
          
          <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold text-[#f1faee] mb-6 leading-tight">
            学生举报学校
            <br />
            <span className="text-[#e63946]">补课模拟器</span>
          </h1>
          
          <p ref={subtitleRef} className="text-xl md:text-2xl text-[#a8dadc] max-w-2xl mx-auto mb-8">
            扮演一名对违规补课不满的学生，通过合法途径争取权益
          </p>

          <div ref={buttonRef} className="space-y-6">
            <div className="relative inline-block">
              <button
                onClick={() => setShowDifficulty(!showDifficulty)}
                className={`px-8 py-4 rounded-xl text-white font-medium flex items-center gap-3 transition-all ${difficultyConfig[selectedDifficulty].color} hover:opacity-90 shadow-lg`}
              >
                选择难度: {difficultyConfig[selectedDifficulty].name}
                <ChevronDown className={`w-5 h-5 transition-transform ${showDifficulty ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md">
              <span className="text-white font-medium">AI辅助功能</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAI}
                  onChange={(e) => setEnableAI(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                <span className={`ml-3 text-sm font-medium ${enableAI ? 'text-cyan-300' : 'text-gray-400'}`}>
                  {enableAI ? '开启' : '关闭'}
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onStartGame(selectedDifficulty, enableAI)}
                size="lg"
                className="bg-gradient-to-r from-[#e63946] to-[#c1121f] hover:from-[#c1121f] hover:to-[#e63946] text-white text-lg px-12 py-6 rounded-full shadow-lg shadow-[#e63946]/30 transition-all duration-300 hover:scale-105"
              >
                开始游戏
              </Button>
              <Button
                onClick={() => setShowChangelog(true)}
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
              >
                <History className="w-5 h-5 mr-2 text-white" />
                更新日志
              </Button>
            </div>
          </div>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="feature-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 text-center p-6 shadow-xl hover:shadow-2xl hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10 transition-all duration-500 group hover:-translate-y-1"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#e63946]/20 rounded-full blur-lg group-hover:scale-110 transition-transform duration-500"></div>
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-[#e63946] relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#f1faee] mb-2 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
              <p className="text-sm text-[#a8dadc] group-hover:text-cyan-300 transition-colors duration-300">{feature.desc}</p>
            </Card>
          ))}
        </div>

        <div ref={linksRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <Card className="link-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 p-6 shadow-lg hover:shadow-xl hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10 transition-all duration-500 group hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e63946]/20 rounded-full blur-md group-hover:scale-110 transition-transform duration-500"></div>
                <Globe className="w-6 h-6 text-[#e63946] relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#f1faee] group-hover:text-white transition-colors duration-300">频道官网</h3>
            </div>
            <a 
              href="https://xshzpd.mysxl.cn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#a8dadc] hover:text-[#e63946] transition-colors duration-300 break-all flex items-center gap-2 group-hover:underline"
            >
              https://xshzpd.mysxl.cn
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <p className="text-xs text-[#a8dadc] mt-2 group-hover:text-cyan-300 transition-colors duration-300">学生互助频道官方站点</p>
          </Card>

          <Card className="link-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 p-6 shadow-lg hover:shadow-xl hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10 transition-all duration-500 group hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e63946]/20 rounded-full blur-md group-hover:scale-110 transition-transform duration-500"></div>
                <BookOpen className="w-6 h-6 text-[#e63946] relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#f1faee] group-hover:text-white transition-colors duration-300">互助教程下载</h3>
            </div>
            <a 
              href="https://cloud.dcr.smart-teach.cn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#a8dadc] hover:text-[#457b9d] transition-colors duration-300 break-all flex items-center gap-2 group-hover:underline"
            >
              https://cloud.dcr.smart-teach.cn/
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <p className="text-xs text-[#a8dadc] mt-2 group-hover:text-cyan-300 transition-colors duration-300">教程资源与互助文档</p>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-[#a8dadc] text-sm">
            基于现实逻辑的回合制策略游戏 · 请通过合法途径维护权益
          </p>
        </div>
      </div>

      {showDifficulty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center" onClick={() => setShowDifficulty(false)}>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">选择游戏难度</h3>
            {Object.entries(difficultyConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedDifficulty(key as Difficulty);
                  setShowDifficulty(false);
                }}
                className={`w-full p-4 mb-3 rounded-xl text-left transition-all ${
                  selectedDifficulty === key 
                    ? `${config.color} text-white shadow-lg hover:opacity-90` 
                    : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${config.color}`} />
                  <div>
                    <p className="font-medium">{config.name}</p>
                    <p className={`text-xs ${selectedDifficulty === key ? 'text-white/80' : 'text-gray-400'}`}>
                      {config.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Changelog isOpen={showChangelog} onClose={() => setShowChangelog(false)} />
    </div>
  );
}
