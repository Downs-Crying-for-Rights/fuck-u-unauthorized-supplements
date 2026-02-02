import { useState, useEffect, useRef } from 'react';
import type { GameState, EvidenceType, ChannelType, ActionResult, GameEvent } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, FileText, Clock, AlertTriangle,
  CheckCircle, ChevronRight, Info, Scale,
  MessageSquare, Users, Camera, Mic, FileStack, Smartphone,
  Calendar, TrendingUp, History
} from 'lucide-react';
import { gsap } from 'gsap';

interface GameSectionProps {
  gameState: GameState;
  onCollectEvidence: (type: EvidenceType) => ActionResult;
  onSubmitReport: (channel: ChannelType, evidences: EvidenceType[], isAnonymous?: boolean) => ActionResult;
  onWaitOneDay: () => ActionResult;
  getStatusText: (value: number, type: 'exposure' | 'pressure' | 'fear') => string;
  onGetAIStrategyAdvice: (state: GameState) => string[];
  onGetAIEvidenceAdvice: (state: GameState) => string[];
  onGetAIChannelAdvice: (state: GameState) => string[];
}

const evidenceIcons: Record<EvidenceType, React.ElementType> = {
  chat: MessageSquare,
  receipt: FileText,
  photo: Camera,
  recording: Mic,
  petition: Users,
  schedule: FileStack,
  parent: Users,
  screenshot: Smartphone,
  app: Smartphone,
  illegal: AlertTriangle
};

const channelIcons: Record<ChannelType, React.ElementType> = {
  city_12345: Phone,
  province_12345: Phone,
  ministry_phone: Phone,
  city_bureau: Phone,
  province_bureau: Phone,
  web_12345: Smartphone,
  bureau_website: Smartphone,
  leader_board: Smartphone,
  state_council: Smartphone,
  education_supervision: Smartphone,
  social_media: MessageSquare,
  onsite_petition: FileText,
  mail_petition: FileText,
  discipline_inspection: Scale
};

const EVIDENCE_LIST = [
  { id: 'chat', name: '班级群聊天记录', power: 6, risk: 3, difficulty: 2, description: '包含老师明确补课指令的群聊记录' },
  { id: 'receipt', name: '收费收据/转账记录', power: 8, risk: 5, difficulty: 5, description: '盖学校公章为决定性证据' },
  { id: 'photo', name: '现场照片/视频', power: 8, risk: 8, difficulty: 7, description: '拍摄角度清晰含时间水印' },
  { id: 'recording', name: '录音', power: 10, risk: 6, difficulty: 7, description: '需包含老师承认强制或收费内容' },
  { id: 'petition', name: '同学联名信', power: 6, risk: 9, difficulty: 5, description: '若泄露所有签名者暴露' },
  { id: 'schedule', name: '课表/作息表', power: 3, risk: 2, difficulty: 2, description: '仅作辅助证据' },
  { id: 'parent', name: '家长证言', power: 6, risk: 5, difficulty: 5, description: '家长可能反悔撤证' },
  { id: 'screenshot', name: '网络截图', power: 3, risk: 2, difficulty: 1, description: '易被质疑真实性' },
  { id: 'app', name: '缴费APP记录', power: 7, risk: 5, difficulty: 3, description: '显示收款方为学校或关联企业' }
];

const CHANNEL_LIST = [
  { id: 'city_12345', name: '市12345', anonymous: true, cost: 1, replyDays: 15 },
  { id: 'province_12345', name: '省12345', anonymous: true, cost: 1.5, replyDays: 15 },
  { id: 'ministry_phone', name: '教育部举报电话', anonymous: false, cost: 3, replyDays: 30 },
  { id: 'city_bureau', name: '市教育局公开电话', anonymous: false, cost: 1, replyDays: 15 },
  { id: 'province_bureau', name: '省教育厅电话', anonymous: false, cost: 2, replyDays: 20 },
  { id: 'web_12345', name: '12345微信小程序', anonymous: true, cost: 0, replyDays: 15 },
  { id: 'bureau_website', name: '教育局官网投诉', anonymous: false, cost: 0, replyDays: 15 },
  { id: 'leader_board', name: '领导留言板', anonymous: false, cost: 0, replyDays: 30 },
  { id: 'state_council', name: '国务院互联网+督查', anonymous: false, cost: 0, replyDays: 30 },
  { id: 'education_supervision', name: '中国教育督导', anonymous: false, cost: 0, replyDays: 30 },
  { id: 'social_media', name: '抖音/微博曝光', anonymous: false, cost: 0, replyDays: 7 },
  { id: 'onsite_petition', name: '现场信访', anonymous: false, cost: 5, replyDays: 60 },
  { id: 'mail_petition', name: '邮寄信访', anonymous: false, cost: 3, replyDays: 63 },
  { id: 'discipline_inspection', name: '纪委监委现场举报', anonymous: false, cost: 0, replyDays: 90 }
];

export function GameSection({ 
  gameState, 
  onCollectEvidence, 
  onSubmitReport,
  onWaitOneDay,
  getStatusText,
  onGetAIStrategyAdvice,
  onGetAIEvidenceAdvice,
  onGetAIChannelAdvice
}: GameSectionProps) {
  const [selectedAction, setSelectedAction] = useState<'evidence' | 'report' | null>(null);
  const [selectedEvidences, setSelectedEvidences] = useState<EvidenceType[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | null>(null);
  const [lastResult, setLastResult] = useState<ActionResult | null>(null);
  const [actionUsed, setActionUsed] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentReply, setCurrentReply] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [eventCount, setEventCount] = useState(0);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const leftCardsRef = useRef<HTMLDivElement>(null);
  const rightCardsRef = useRef<HTMLDivElement>(null);

  // 监听gameState变化，重置行动状态并检查新回复
  useEffect(() => {
    // 使用setTimeout延迟设置状态，避免同步setState调用
    setTimeout(() => {
      // 重置行动状态
      setActionUsed(false);
      
      // 检查是否有新的已回复工单
      const newRepliedOrders = gameState.submittedWorkOrders.filter(
        order => order.status === 'replied' && !order.replyShown
      );
      
      if (newRepliedOrders.length > 0) {
        // 显示最新的回复
        const latestReply = newRepliedOrders[newRepliedOrders.length - 1];
        if (latestReply.reply) {
          setCurrentReply(latestReply.reply.content);
          setShowReplyModal(true);
          // 标记回复已显示
          latestReply.replyShown = true;
        }
      }
    }, 0);
  }, [gameState.day, gameState.submittedWorkOrders]);

  // 监听游戏事件变化，显示新事件弹窗
  useEffect(() => {
    if (gameState.gameEvents.length > eventCount) {
      const newEvent = gameState.gameEvents[gameState.gameEvents.length - 1];
      // 使用setTimeout延迟设置状态，避免同步setState调用
      setTimeout(() => {
        setCurrentEvent(newEvent);
        setShowEventModal(true);
        setEventCount(gameState.gameEvents.length);
      }, 0);
    }
  }, [gameState.gameEvents, eventCount]);

  useEffect(() => {
    if (contentRef.current && selectedAction) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      
      // 为新显示的内容添加子元素动画
      setTimeout(() => {
        const items = contentRef.current?.querySelectorAll('[data-animate="item"]');
        if (items && items.length > 0) {
          gsap.from(items,
            { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out', stagger: 0.05 }
          );
        }
      }, 100);
    }
  }, [selectedAction]);

  useEffect(() => {
    if (resultRef.current && lastResult) {
      gsap.fromTo(resultRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    }
  }, [lastResult]);

  // 为左侧和右侧卡片添加进入动画
  useEffect(() => {
    if (leftCardsRef.current) {
      const cards = leftCardsRef.current.querySelectorAll('.card');
      gsap.from(cards,
        { opacity: 0, x: -50, y: 20, duration: 0.5, ease: 'power2.out', stagger: 0.1 }
      );
    }

    if (rightCardsRef.current) {
      const cards = rightCardsRef.current.querySelectorAll('.card');
      gsap.from(cards,
        { opacity: 0, x: 50, y: 20, duration: 0.5, ease: 'power2.out', stagger: 0.1 }
      );
    }
  }, []);

  const handleCollectEvidence = (type: EvidenceType) => {
    if (actionUsed) {
      setLastResult({
        success: false,
        description: '每天只能执行一个行动',
        feedback: '请先等待一天或完成当前行动',
        changes: {}
      });
      return;
    }
    const result = onCollectEvidence(type);
    setLastResult(result);
    setSelectedAction(null);
    setActionUsed(true);
  };

  const handleSubmitReport = () => {
    if (actionUsed) {
      setLastResult({
        success: false,
        description: '每天只能执行一个行动',
        feedback: '请先等待一天或完成当前行动',
        changes: {}
      });
      return;
    }
    if (selectedChannel && selectedEvidences.length > 0) {
      if (gameState.difficulty === 'hard') {
        const cost = CHANNEL_LIST.find(c => c.id === selectedChannel)?.cost || 0;
        if (gameState.totalCost + cost > 50) {
          setLastResult({
            success: false,
            description: '困难模式限制：总花费不能超过50元',
            feedback: '请尝试更便宜的举报渠道',
            changes: {}
          });
          return;
        }
      }
      const result = onSubmitReport(selectedChannel, selectedEvidences, isAnonymous);
      setLastResult(result);
      setSelectedAction(null);
      setSelectedChannel(null);
      setSelectedEvidences([]);
      setIsAnonymous(true);
      setActionUsed(true);
    }
  };

  const handleWaitOneDay = () => {
    if (actionUsed) {
      setLastResult({
        success: false,
        description: '每天只能执行一个行动',
        feedback: '请先等待一天或完成当前行动',
        changes: {}
      });
      return;
    }
    const result = onWaitOneDay();
    setLastResult(result);
    setActionUsed(true);
  };



  const getClassColor = (value: number, type: 'exposure' | 'pressure' | 'fear') => {
    const status = getStatusText(value, type);
    if (status === '低') return 'bg-green-500';
    if (status === '中') return 'bg-yellow-500';
    if (status === '高') return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getDaysUntilStart = () => {
    const days = gameState.classDetail.startIn - gameState.day;
    if (days > 0) return `距离补课开始：${days}天`;
    const progress = gameState.day - gameState.classDetail.startIn;
    if (progress < gameState.classDetail.duration) return `补课进行中第${progress}天`;
    return '补课已结束';
  };

  const getDifficultyName = (diff: string) => {
    const names = { easy: '简易', medium: '中等', hard: '地狱' };
    return names[diff as keyof typeof names] || diff;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3">
      {/* 顶部状态栏 - 液态玻璃风格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-semibold text-white">游戏状态</h3>
              <p className="text-lg font-bold text-white">第{gameState.day}天 | {getDaysUntilStart()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">当前暴露风险</h3>
              <p className="text-lg font-bold text-white">{getStatusText(gameState.exposureRisk, 'exposure')}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">学校压力</h3>
              <div className="flex items-center gap-2">
                <Progress value={gameState.schoolPressure} className={`h-2 flex-1 ${getClassColor(gameState.schoolPressure, 'pressure')} rounded-full`} />
                <span className="text-sm font-medium text-white">{gameState.schoolPressure}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">教育局忌惮</h3>
              <div className="flex items-center gap-2">
                <Progress value={gameState.bureauFear} className={`h-2 flex-1 ${getClassColor(gameState.bureauFear, 'fear')} rounded-full`} />
                <span className="text-sm font-medium text-white">{gameState.bureauFear}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">累计工单</h3>
              <p className="text-lg font-bold text-white">{gameState.workOrders}件</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">总花费</h3>
              <p className="text-lg font-bold text-white">{gameState.totalCost}元</p>
              {gameState.difficulty === 'hard' && (
                <p className="text-xs text-red-400">限制: ≤50元</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 行动结果展示 */}
      {lastResult && (
        <Card ref={resultRef} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">本回合行动结果</h3>
          <p className="text-white mb-4">{lastResult.description}</p>
          
          {lastResult.feedback && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">获得反馈</h4>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                <p className="text-white whitespace-pre-line">{lastResult.feedback}</p>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">系统判定</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">学校压力值变化:</span>
                <span className={`font-medium ${lastResult.changes.schoolPressure && lastResult.changes.schoolPressure > 0 ? 'text-red-400' : 'text-green-400'}`}>{lastResult.changes.schoolPressure || 0}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">教育局忌惮值变化:</span>
                <span className={`font-medium ${lastResult.changes.bureauFear && lastResult.changes.bureauFear > 0 ? 'text-red-400' : 'text-green-400'}`}>{lastResult.changes.bureauFear || 0}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">暴露风险变化:</span>
                <span className={`font-medium ${lastResult.changes.exposureRisk && lastResult.changes.exposureRisk > 0 ? 'text-red-400' : 'text-green-400'}`}>{lastResult.changes.exposureRisk || 0}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">总花费:</span>
                <span className="font-medium text-white">{lastResult.changes.cost || 0}元 (累计: {gameState.totalCost}元)</span>
              </div>
            </div>
          </div>
          
          {lastResult.newEvent && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">新发生事件</h4>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
                <p className="text-white">{lastResult.newEvent.description}</p>
              </div>
            </div>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 左侧：学校档案和补课详情 */}
        <div ref={leftCardsRef} className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 animate-pulse" />
              学校档案
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">学校类型:</span>
                <span className="text-white font-medium">{gameState.schoolProfile.type}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">所在地区:</span>
                <span className="text-white font-medium">{gameState.schoolProfile.region}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">校长风格:</span>
                <Badge variant="outline" className="border-orange-400 text-orange-400 text-[10px]">
                  {gameState.schoolProfile.principal}
                </Badge>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">教育局风格:</span>
                <Badge variant="outline" className="border-blue-400 text-blue-400 text-[10px]">
                  {gameState.schoolProfile.bureau}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-sm font-semibold text-white mb-3">补课详情</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">补课形式:</span>
                <span className="text-white">{gameState.classDetail.form}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">时长:</span>
                <span className="text-white">{gameState.classDetail.duration}天</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">收费:</span>
                <span className="text-white font-bold text-yellow-400">
                  {gameState.classDetail.fee}元
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                <span className="text-gray-400">名义:</span>
                <span className="text-white">{gameState.classDetail.name}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <Badge className={`${
                  gameState.classDetail.force === '强制全员' 
                    ? 'bg-red-500' 
                    : gameState.classDetail.force === '完全自愿但大多参加'
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
                } text-white text-[10px]`}>
                  {gameState.classDetail.force}
                </Badge>
              </div>
              <div className="pt-2">
                <p className="text-[10px] text-gray-400">{getDaysUntilStart()}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-sm font-semibold text-white mb-2">当前难度</h3>
            <Badge className={`${
              gameState.difficulty === 'easy' ? 'bg-green-500' :
              gameState.difficulty === 'hard' ? 'bg-red-500' :
              'bg-yellow-500'
            } text-white text-xs px-3 py-1`}>
              {getDifficultyName(gameState.difficulty)}
            </Badge>
            {gameState.difficulty === 'hard' && (
              <p className="text-[10px] text-red-400 mt-1">限制: ≤50元</p>
            )}
          </Card>

          {gameState.collectedEvidences.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="text-sm font-semibold text-white mb-3">已收集证据</h3>
              <div className="space-y-2">
                {gameState.collectedEvidences.map((evidence, index) => {
                  const Icon = evidenceIcons[evidence.type];
                  return (
                    <div key={index} className="flex items-center gap-2 text-xs p-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                      <Icon className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-white">{evidence.name}</span>
                      <Badge variant="outline" className="ml-auto text-[10px] text-white border-white/30">
                        说服力{evidence.power}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

        </div>

        {/* 中间：行动区域 */}
        <div ref={contentRef} className="lg:col-span-2">
          {!selectedAction ? (
            <Card className="bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#1d3557] backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-[#f1faee] mb-6">选择行动</h3>
              <div className="space-y-4">
                <Button
                  onClick={() => setSelectedAction('evidence')}
                  disabled={actionUsed}
                  className="w-full justify-start h-auto py-4 bg-gradient-to-r from-[#457b9d] to-[#1d3557] hover:from-[#a8dadc] hover:to-[#457b9d] border border-white/30 text-left rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FileText className="w-5 h-5 mr-3 text-[#e63946] animate-pulse" />
                  <div>
                    <p className="font-medium text-[#f1faee]">收集证据</p>
                    <p className="text-xs text-[#a8dadc]">获取新的证据材料</p>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-[#a8dadc]" />
                </Button>

                <Button
                  onClick={() => setSelectedAction('report')}
                  disabled={actionUsed}
                  className="w-full justify-start h-auto py-4 bg-gradient-to-r from-[#457b9d] to-[#1d3557] hover:from-[#a8dadc] hover:to-[#457b9d] border border-white/30 text-left rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Phone className="w-5 h-5 mr-3 text-[#e63946] animate-pulse" />
                  <div>
                    <p className="font-medium text-[#f1faee]">提交举报</p>
                    <p className="text-xs text-[#a8dadc]">通过官方渠道举报</p>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-[#a8dadc]" />
                </Button>

                <Button
                  onClick={() => handleWaitOneDay()}
                  disabled={actionUsed}
                  className="w-full justify-start h-auto py-4 bg-gradient-to-r from-[#457b9d] to-[#1d3557] hover:from-[#a8dadc] hover:to-[#457b9d] border border-white/30 text-left rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Clock className="w-5 h-5 mr-3 text-[#e63946] animate-pulse" />
                  <div>
                    <p className="font-medium text-[#f1faee]">等待一天</p>
                    <p className="text-xs text-[#a8dadc]">跳过到明天</p>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-[#a8dadc]" />
                </Button>

              </div>
              {actionUsed && (
                <div className="text-center mt-4">
                  <p className="text-[#e63946] text-sm mb-2">今天已行动完毕</p>
                </div>
              )}
            </Card>
          ) : selectedAction === 'evidence' ? (
            <Card className="bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#1d3557] backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-[#f1faee] mb-4">收集证据</h3>
              <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
                {EVIDENCE_LIST.filter(e => !gameState.collectedEvidences.some(ce => ce.id === e.id)).map((evidence) => {
                  const Icon = evidenceIcons[evidence.id as EvidenceType];
                  return (
                    <div
                      key={evidence.id}
                      data-animate="item"
                      className="p-4 rounded-xl border bg-gradient-to-r from-[#457b9d] to-[#1d3557] border-white/30 hover:from-[#a8dadc] hover:to-[#457b9d] transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 mt-0.5 text-[#e63946] animate-pulse" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-[#f1faee]">{evidence.name}</h4>
                          </div>
                          <p className="text-xs text-[#a8dadc] mb-2">{evidence.description}</p>
                          <div className="flex gap-4 text-xs">
                            <span className="text-[#a8dadc]">
                              说服力: <span className="text-green-400 font-medium">{evidence.power}/10</span>
                            </span>
                            <span className="text-[#a8dadc]">
                              风险: <span className="text-red-400 font-medium">{evidence.risk}/10</span>
                            </span>
                            <span className="text-[#a8dadc]">
                              难度: <span className="text-yellow-400 font-medium">{evidence.difficulty}/10</span>
                            </span>
                          </div>
                        </div>
                        <Button
                  size="sm"
                  onClick={() => handleCollectEvidence(evidence.id as EvidenceType)}
                  className="bg-[#e63946] hover:bg-[#c1121f] text-white transition-all"
                >
                  收集
                </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedAction(null)}
                className="mt-4 border-white/20 text-gray-400 hover:bg-white/10 transition-all"
              >
                返回
              </Button>
            </Card>
          ) : selectedAction === 'report' ? (
            <Card className="bg-gradient-to-br from-[#1d3557] via-[#457b9d] to-[#1d3557] backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-[#f1faee] mb-4">提交举报</h3>
              
              <div className="mb-6">
                <p className="text-sm text-[#a8dadc] mb-3">选择举报渠道</p>
                <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-2">
                  {CHANNEL_LIST.map((channel) => {
                    const Icon = channelIcons[channel.id as ChannelType];
                    const isHardModeLimit = gameState.difficulty === 'hard' && gameState.totalCost + (channel.cost || 0) > 50;
                    // 检查渠道是否有未回复的工单
                    const hasPendingOrder = gameState.submittedWorkOrders.some(
                      order => order.channel === channel.id && order.status === 'pending'
                    );
                    const isDisabled = isHardModeLimit || hasPendingOrder;
                    
                    return (
                      <button
                        key={channel.id}
                        data-animate="item"
                        onClick={() => !isDisabled && setSelectedChannel(channel.id as ChannelType)}
                        disabled={isDisabled}
                        className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                          selectedChannel === channel.id
                            ? 'bg-gradient-to-r from-[#e63946]/30 to-[#457b9d]/30 border-[#e63946]'
                            : isDisabled 
                            ? 'bg-[#1d3557] border-white/10 opacity-50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#457b9d] to-[#1d3557] border-white/30 hover:from-[#a8dadc] hover:to-[#457b9d]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#e63946] animate-pulse" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#f1faee]">{channel.name}</p>
                            <p className="text-xs text-[#a8dadc]">
                              {channel.anonymous ? '可匿名' : '需实名'} · {channel.cost}元 · {channel.replyDays}天回复
                              {isHardModeLimit && ' (超出限制)'}
                              {hasPendingOrder && ' (等待回复)'}
                            </p>
                          </div>
                          {selectedChannel === channel.id && (
                            <CheckCircle className="w-4 h-4 text-[#e63946] animate-pulse" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {gameState.collectedEvidences.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-[#a8dadc] mb-3">选择证据 (1-3份)</p>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                    {gameState.collectedEvidences.map((evidence, index) => {
                      const Icon = evidenceIcons[evidence.type];
                      const isSelected = selectedEvidences.includes(evidence.type as EvidenceType);
                      
                      return (
                        <button
                          key={index}
                          data-animate="item"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedEvidences(prev => prev.filter(e => e !== evidence.type));
                            } else if (selectedEvidences.length < 3) {
                              setSelectedEvidences(prev => [...prev, evidence.type as EvidenceType]);
                            }
                          }}
                          className={`w-full p-2 rounded-xl border text-left transition-all duration-300 ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#e63946]/30 to-[#457b9d]/30 border-[#e63946]'
                              : 'bg-gradient-to-r from-[#457b9d] to-[#1d3557] border-white/30 hover:from-[#a8dadc] hover:to-[#457b9d]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-[#e63946] animate-pulse" />
                            <span className="text-sm text-[#f1faee]">{evidence.name}</span>
                            <span className="ml-auto text-xs text-[#a8dadc]">说服力{evidence.power}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-[#a8dadc] mt-2">
                    已选择 {selectedEvidences.length}/3 份证据
                  </p>
                </div>
              )}

              {/* 匿名举报选项 */}
              {selectedChannel && (
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      disabled={!CHANNEL_LIST.find(c => c.id === selectedChannel)?.anonymous}
                      className="rounded border-[#a8dadc] text-[#e63946] focus:ring-[#e63946]"
                    />
                    <label
                      htmlFor="anonymous"
                      className={`text-sm ${!CHANNEL_LIST.find(c => c.id === selectedChannel)?.anonymous ? 'text-[#a8dadc]' : 'text-[#f1faee]'}`}
                    >
                      匿名举报
                      {!CHANNEL_LIST.find(c => c.id === selectedChannel)?.anonymous && ' (该渠道强制实名)'}
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitReport}
                  disabled={!selectedChannel || selectedEvidences.length === 0}
                  className="flex-1 bg-[#e63946] hover:bg-[#c1121f] text-white transition-all"
                >
                  提交举报
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAction(null);
                    setSelectedChannel(null);
                    setSelectedEvidences([]);
                  }}
                  className="border-white/30 text-[#a8dadc] hover:bg-white/10 transition-all"
                >
                  返回
                </Button>
              </div>
            </Card>
          ) : null}
        </div>

        {/* 右侧：举报记录和随机事件 */}
        <div ref={rightCardsRef} className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400 animate-pulse" />
              举报记录
            </h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {gameState.submittedWorkOrders.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">暂无举报记录</p>
              ) : (
                gameState.submittedWorkOrders.slice(-5).map((order, index) => {
                  const Icon = channelIcons[order.channel];
                  return (
                    <div key={index} className="border border-white/10 rounded-lg p-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-3 h-3 text-gray-400 animate-pulse" />
                        <span className="text-xs font-medium text-white">
                          {(() => {
                            switch(order.channel) {
                              case 'city_12345': return '市12345';
                              case 'province_12345': return '省12345';
                              case 'ministry_phone': return '教育部电话';
                              case 'city_bureau': return '市教育局';
                              case 'province_bureau': return '省教育厅';
                              case 'web_12345': return '12345小程序';
                              case 'bureau_website': return '教育局官网';
                              case 'leader_board': return '领导留言板';
                              case 'state_council': return '国务院督查';
                              case 'education_supervision': return '教育督导';
                              case 'social_media': return '社交媒体';
                              case 'onsite_petition': return '现场信访';
                              case 'mail_petition': return '邮寄信访';
                              case 'discipline_inspection': return '纪委监委';
                              default: return order.channel;
                            }
                          })()}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`ml-auto text-[10px] ${
                            order.status === 'replied' 
                              ? 'border-green-500 text-green-400' 
                              : 'border-yellow-500 text-yellow-400'
                          }`}
                        >
                          {order.status === 'replied' ? '已回复' : '待回复'}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-400 mb-1">
                        第{order.day}天 · 使用{order.evidences.length}份证据
                      </p>
                      {order.status === 'pending' && (
                        <p className="text-[10px] text-yellow-400 mb-2">
                          {(() => {
                            const channel = CHANNEL_LIST.find(c => c.id === order.channel);
                            if (channel) {
                              const maxReplyDays = channel.replyDays + 3; // 加上3天随机延迟
                              const daysPassed = gameState.day - order.day;
                              const daysLeft = Math.max(0, maxReplyDays - daysPassed);
                              return `距离最长回复时间还有 ${daysLeft} 天`;
                            }
                            return '';
                          })()}
                        </p>
                      )}
                      {order.status === 'replied' && order.reply && (
                        <Button
                          size="sm"
                          onClick={() => {
                            if (order.reply) {
                              setCurrentReply(order.reply.content);
                              setShowReplyModal(true);
                            }
                          }}
                          className="w-full text-[10px] py-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 border border-white/20 text-white transition-all"
                        >
                          查看回复
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />
              随机事件
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {gameState.gameEvents.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">暂无事件</p>
              ) : (
                gameState.gameEvents.slice(-5).map((event, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-300">
                      <p className="text-xs font-medium text-white mb-1">{event.title}</p>
                      <p className="text-[10px] text-gray-400">{event.description}</p>
                      <p className="text-[10px] text-cyan-400 mt-1">第{gameState.day}天</p>
                    </div>
                ))
              )}
            </div>
          </Card>

          {/* AI助手 */}
          {gameState.enableAI && (
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl hover:shadow-3xl hover:scale-[1.01] transition-all duration-300">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400 animate-pulse" />
                AI助手
              </h3>
              
              {/* 策略建议 */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-cyan-400 mb-2">策略建议</h4>
                <div className="space-y-2">
                  {onGetAIStrategyAdvice(gameState).slice(0, 3).map((advice, index) => (
                    <p key={index} className="text-xs text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200">{advice}</p>
                  ))}
                </div>
              </div>
              
              {/* 证据建议 */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-cyan-400 mb-2">证据建议</h4>
                <div className="space-y-2">
                  {onGetAIEvidenceAdvice(gameState).slice(0, 2).map((advice, index) => (
                    <p key={index} className="text-xs text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200">{advice}</p>
                  ))}
                </div>
              </div>
              
              {/* 渠道建议 */}
              <div>
                <h4 className="text-xs font-medium text-cyan-400 mb-2">渠道建议</h4>
                <div className="space-y-2">
                  {onGetAIChannelAdvice(gameState).slice(0, 2).map((advice, index) => (
                    <p key={index} className="text-xs text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200">{advice}</p>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 回复反馈弹窗 */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mx-4 max-w-2xl w-full">
            <h3 className="text-lg font-semibold text-white mb-4">收到回复</h3>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <p className="text-white whitespace-pre-line">{currentReply}</p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowReplyModal(false)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 随机事件弹窗 */}
      {showEventModal && currentEvent && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mx-4 max-w-xl w-full">
            <h3 className="text-lg font-semibold text-white mb-4">新事件发生</h3>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <h4 className="text-white font-medium mb-2">{currentEvent.title}</h4>
              <p className="text-gray-300 whitespace-pre-line">{currentEvent.description}</p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowEventModal(false)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
