import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { gsap } from 'gsap';
import { 
  Trophy, XCircle, AlertTriangle, RefreshCw, 
  DollarSign, Calendar, Target, MessageSquare,
  FileText, History
} from 'lucide-react';
import type { GameEndResult, Achievement } from '@/types/game';

interface EndSectionProps {
  result: GameEndResult;
  onRestart: () => void;
}

export function EndSection({ result, onRestart }: EndSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)', delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const getEndData = () => {
    const Icon = result.success 
      ? result.type === 'victory' ? Trophy : AlertTriangle
      : XCircle;
    
    const title = result.success 
      ? result.type === 'victory' ? '胜利！' : '惨胜'
      : '失败';

    const color = result.success 
      ? result.type === 'victory' ? 'text-green-400' : 'text-yellow-400'
      : 'text-red-400';

    const bgColor = result.success 
      ? result.type === 'victory' ? 'bg-green-500/20 border-green-500/50' : 'bg-yellow-500/20 border-yellow-500/50'
      : 'bg-red-500/20 border-red-500/50';

    return { Icon, title, color, bgColor };
  };

  const getTypeText = () => {
    switch (result.type) {
      case 'victory': return '完全胜利';
      case 'pyrrhic': return '惨胜';
      case 'stalemate': return '无果';
      case 'failure': return '失败';
      case 'backfire': return '反噬';
      case 'redirect': return '转移';
      default: return '未知';
    }
  };

  const getTypeDescription = () => {
    switch (result.type) {
      case 'victory': 
        return '你成功地阻止了学校的违规补课行为，维护了学生的合法权益。这是一个值得庆祝的胜利！';
      case 'pyrrhic': 
        return '虽然取得了胜利，但付出了沉重的代价。你被学校处分或孤立，这次胜利来之不易。';
      case 'stalemate': 
        return '补课虽然暂时停止，但学校并未真正整改，下学期可能会卷土重来。';
      case 'failure': 
        return '尽管你付出了努力，但未能阻止补课的进行。不要气馁，下次可以调整策略。';
      default:
        return result.summary;
    }
  };

  // 获取成就稀有度颜色
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-400 bg-gray-900/50';
      case 'uncommon':
        return 'text-green-400 bg-green-900/50';
      case 'rare':
        return 'text-blue-400 bg-blue-900/50';
      case 'epic':
        return 'text-purple-400 bg-purple-900/50';
      case 'legendary':
        return 'text-yellow-400 bg-yellow-900/50';
      default:
        return 'text-gray-400 bg-gray-900/50';
    }
  };

  const { Icon, title, color, bgColor } = getEndData();

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#1d3557] to-[#457b9d] flex items-center justify-center p-4"
    >
      <Card 
        ref={cardRef}
        className={`w-full max-w-3xl ${bgColor} backdrop-blur-md border text-white`}
      >
        <div className="p-8">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${bgColor} mb-4`}>
              <Icon className={`w-12 h-12 ${color}`} />
            </div>
            <h1 className={`text-4xl font-bold ${color} mb-2`}>{title}</h1>
            <Badge className={`${bgColor} ${color} border-0 text-lg px-4 py-2`}>
              {getTypeText()}
            </Badge>
          </div>

          {/* 结局总结 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              结局总结
            </h2>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-300 leading-relaxed">{result.summary}</p>
              <p className="text-gray-400 text-sm mt-3">{getTypeDescription()}</p>
            </div>
          </div>

          {/* 详细统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-2xl font-bold text-white">{result.day}</p>
              <p className="text-xs text-gray-400">天数</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold text-white">{result.totalCost}</p>
              <p className="text-xs text-gray-400">总花费(元)</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold text-white">{result.finalSuccessRate}%</p>
              <p className="text-xs text-gray-400">成功率</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-2xl font-bold text-white">{result.success ? '成功' : '失败'}</p>
              <p className="text-xs text-gray-400">结果</p>
            </div>
          </div>



          {/* AI点评 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">AI点评</h3>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-300 text-sm leading-relaxed">{result.comment}</p>
              {result.finalSuccessRate < 50 && (
                <p className="text-yellow-400 text-sm mt-2">
                  建议：下次可以尝试收集更多高说服力证据，如录音和收费收据，并注意保护自己的匿名性。
                </p>
              )}
              {result.totalCost > 30 && (
                <p className="text-orange-400 text-sm mt-2">
                  提示：你的花费较高，下次可以尝试使用免费的微信小程序或教育局官网渠道。
                </p>
              )}
            </div>
          </div>

          {/* 成就系统 */}
          {result.achievements && result.achievements.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">本次获得的成就</h3>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="mb-3">
                  <span className="text-yellow-400 font-semibold">共获得 {result.achievements.length} 个成就：</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.achievements.map((achievement: Achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`rounded-lg p-3 border ${getRarityColor(achievement.rarity)} border-opacity-30 transition-all hover:scale-105 hover:border-opacity-60`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <p className="text-xs text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity === 'common' ? '普通' :
                           achievement.rarity === 'uncommon' ? '优秀' :
                           achievement.rarity === 'rare' ? '稀有' :
                           achievement.rarity === 'epic' ? '史诗' :
                           achievement.rarity === 'legendary' ? '传说' : '普通'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onRestart}
              size="lg"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              回到首页
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
