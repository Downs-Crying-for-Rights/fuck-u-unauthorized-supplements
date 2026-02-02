import type { } from 'react';
import { X, History, Tag, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChangelogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UpdateItem {
  version: string;
  date: string;
  changes: Array<{
    type: 'feature' | 'fix' | 'balance' | 'ui';
    text: string;
  }>;
}

const updates: UpdateItem[] = [
  {
    version: '2.2.0',
    date: '2026-01-29',
    changes: [
      { type: 'feature', text: '新增举报记录回复时间提示，显示距离最长回复时间还有多少天' },
      { type: 'feature', text: '添加随机事件弹窗提醒，确保玩家不会错过重要事件' },
      { type: 'balance', text: '降低游戏难度：减少暴露风险增加量，提高举报效果' },
      { type: 'feature', text: '添加匿名举报选项，支持强制实名渠道的自动禁用' },
      { type: 'fix', text: '修复举报渠道状态显示，添加"等待回复"提示' },
      { type: 'balance', text: '增强各举报渠道的效果，提高纪委监委受理概率' },
      { type: 'feature', text: '扩展举报回复模板，增加信访受理告知书、电话反馈等类型' },
      { type: 'ui', text: '优化举报界面，添加匿名举报复选框' }
    ]
  },
  {
    version: '2.1.0',
    date: '2026-01-24',
    changes: [
      { type: 'feature', text: '新增"跳过到明天"按钮，行动完毕后可直接进入下一天' },
      { type: 'fix', text: '修复更新日志弹窗被其他元素遮挡的问题' },
      { type: 'ui', text: '优化游戏结束界面，添加详细经过和AI点评' },
      { type: 'feature', text: '添加行动限制提示，每天只能执行一个行动' }
    ]
  },
  {
    version: '2.0.0',
    date: '2026-01-24',
    changes: [
      { type: 'feature', text: '新增难度选择系统：简易/中等/地狱三档' },
      { type: 'feature', text: '困难模式加入金钱限制（≤50元）' },
      { type: 'feature', text: '新增大量随机事件（共25+种）' },
      { type: 'feature', text: '智能回复系统：根据学校档案动态生成回复' },
      { type: 'ui', text: '全新液态玻璃UI设计' },
      { type: 'balance', text: '补课时长调整为1-60天，收费0-2000元' },
      { type: 'fix', text: '修复难度选择弹窗被遮挡问题' },
      { type: 'feature', text: '添加频道官网和互助教程站链接' },
      { type: 'feature', text: '新增更新日志功能' }
    ]
  },
  {
    version: '1.0.0',
    date: '2026-01-24',
    changes: [
      { type: 'feature', text: '游戏正式上线' },
      { type: 'feature', text: '9种证据类型：聊天记录、录音、联名信等' },
      { type: 'feature', text: '14种举报渠道：电话、网络、现场等' },
      { type: 'feature', text: '随机事件系统' },
      { type: 'feature', text: '7种教育局回复模板' },
      { type: 'feature', text: '多结局判定系统' }
    ]
  }
];

const changeTypeConfig = {
  feature: { label: '新功能', color: 'bg-green-500' },
  fix: { label: '修复', color: 'bg-red-500' },
  balance: { label: '平衡', color: 'bg-blue-500' },
  ui: { label: '界面', color: 'bg-purple-500' }
};

export function Changelog({ isOpen, onClose }: ChangelogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">更新日志</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-8">
            {updates.map((update, index) => (
              <div key={index} className="relative">
                {index !== updates.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 to-transparent" />
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{update.version}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {update.date}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {update.changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="flex items-start gap-3">
                          <Badge className={`${changeTypeConfig[change.type].color} text-white text-xs flex-shrink-0`}>
                            {changeTypeConfig[change.type].label}
                          </Badge>
                          <span className="text-gray-300 text-sm">{change.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-none"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            了解了
          </Button>
        </div>
      </div>
    </div>
  );
}
