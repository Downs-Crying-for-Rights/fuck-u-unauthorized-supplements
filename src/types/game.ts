// 学校类型
export type SchoolType = '省重点' | '市重点' | '普通' | '民办' | '初中' | '高中';
export type Region = '高考大省' | '省会' | '三四线城市' | '县城' | '农村';
export type SchoolLevel = '超级中学' | '名校' | '普通' | '薄弱';
export type PrincipalStyle = '强硬' | '怀柔' | '投机' | '怕事' | '背景深厚';
export type BureauStyle = '护短' | '和稀泥' | '敷衍' | '谨慎' | '高效' | '腐败';

// 补课形式
export type ClassType = '校内集中' | '校外租借场地' | '线上直播' | '小班分散' | '自愿返校' | '校企合作基地';
export type ClassName = '周末托管' | '课后服务' | '夏令营' | '研学' | '培优补差' | '开放自习室' | '假期托管' | '军事拓展训练';
export type ForceLevel = '强制全员' | '名义自愿但威胁' | '仅尖子生' | '完全自愿但大多参加' | '分层教学';

// 证据类型
export type EvidenceType = 'chat' | 'receipt' | 'photo' | 'recording' | 'petition' | 'schedule' | 'parent' | 'screenshot' | 'app' | 'illegal';

export interface Evidence {
  id: string;
  type: EvidenceType;
  name: string;
  power: number; // 说服力 1-10
  risk: number; // 风险 1-10
  difficulty: number; // 获取难度 1-10
  description: string;
  specialEffect?: string;
}

// 举报渠道
export type ChannelType = 
  | 'city_12345' 
  | 'province_12345' 
  | 'ministry_phone'
  | 'city_bureau'
  | 'province_bureau'
  | 'web_12345'
  | 'bureau_website'
  | 'leader_board'
  | 'state_council'
  | 'education_supervision'
  | 'social_media'
  | 'onsite_petition'
  | 'mail_petition'
  | 'discipline_inspection';

export interface Channel {
  id: ChannelType;
  name: string;
  successRate: number; // 接通率
  waitTime: number; // 等待时间(分钟)
  cost: number; // 话费(元)
  anonymous: boolean;
  replyDays: number;
  effect: string;
  description: string;
}

// 随机事件
export type EventType = 'policy' | 'school' | 'personal' | 'external' | 'reward';

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  effects: {
    schoolPressure?: number;
    bureauFear?: number;
    exposureRisk?: number;
    workOrders?: number;
    successRate?: number;
  };
  duration?: number; // 持续天数
}

// 难度类型
export type Difficulty = 'easy' | 'medium' | 'hard';

// 游戏状态
export interface GameState {
  // 难度
  difficulty: Difficulty;
  
  // AI辅助
  enableAI: boolean;
  
  // 学校档案
  schoolProfile: {
    type: SchoolType;
    region: Region;
    level: SchoolLevel;
    principal: PrincipalStyle;
    bureau: BureauStyle;
  };

  // 补课详情
  classDetail: {
    form: ClassType;
    duration: number; // 补课时长(天)
    startIn: number; // 多久后开始(天)
    fee: number; // 收费金额
    name: ClassName;
    force: ForceLevel;
  };

  // 隐藏数值
  schoolPressure: number; // 0-100
  bureauFear: number; // 0-100
  exposureRisk: number; // 0-100
  workOrders: number;
  day: number;

  // 玩家数据
  totalCost: number;
  collectedEvidences: Evidence[];
  submittedWorkOrders: WorkOrder[];
  gameEvents: GameEvent[];
  activeEffects: ActiveEffect[];

  // 游戏流程
  gamePhase: 'init' | 'playing' | 'ended';
  isWaiting: boolean;
  lastActionResult: ActionResult | null;
}

export interface WorkOrder {
  id: string;
  channel: ChannelType;
  evidences: Evidence[];
  day: number;
  status: 'pending' | 'replied';
  reply?: BureauReply;
  replyShown?: boolean;
}

export interface BureauReply {
  template: ReplyTemplate;
  content: string;
  day: number;
}

export type ReplyTemplate = 
  | 'deny_hard'
  | 'disguise'
  | 'vague'
  | 'emotional'
  | 'delay'
  | 'compromise'
  | 'deflect'
  | '信访_acceptance'
  | 'phone_feedback'
  | 'web_12345';

export interface ActiveEffect {
  id: string;
  name: string;
  duration: number;
  effects: {
    successRate?: number;
    schoolPressure?: number;
    bureauFear?: number;
  };
}

export interface ActionResult {
  success: boolean;
  description: string;
  feedback?: string;
  changes: {
    schoolPressure?: number;
    bureauFear?: number;
    exposureRisk?: number;
    workOrders?: number;
    cost?: number;
  };
  newEvent?: GameEvent;
}
// 成就类型
export type AchievementType = 
  | 'first_victory'         // 首次胜利
  | 'perfect_victory'       // 完美胜利（简单模式1次举报）
  | 'persistent_fighter'    // 坚持不懈（中等模式3次举报）
  | 'hardcore_champion'     // 硬核冠军（困难模式9次举报）
  | 'evidence_master'       // 证据大师（收集所有证据）
  | 'channel_master'        // 渠道大师（使用所有举报渠道）
  | 'low_cost_victory'      // 低成本胜利（花费低于10元）
  | 'speed_run'             // 速通大师（10天内胜利）
  | 'high_risk_high_reward' // 高风险高回报（暴露风险超过80但胜利）
  | 'social_media_star'     // 社交媒体明星（使用社交媒体3次以上）
  | 'discipline_inspector'  // 纪律检查官（使用纪委监委渠道）
  | 'petition_expert'       // 信访专家（使用信访渠道）
  | 'ministry_contact'      // 部委联系人（使用教育部电话）
  | 'state_council_reporter'; // 国务院举报人（使用国务院渠道）

// 成就接口
export interface Achievement {
  id: AchievementType;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// 游戏结束结果
export interface GameEndResult {
  success: boolean;
  type: 'victory' | 'pyrrhic' | 'stalemate' | 'failure' | 'backfire' | 'redirect';
  day: number;
  totalCost: number;
  finalSuccessRate: number;
  summary: string;
  comment: string;
  achievements?: Achievement[];
}
