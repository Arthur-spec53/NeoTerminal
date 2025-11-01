// XBoard Geek Theme - TypeScript 类型定义
// 基于 XBoard API v1

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  current_page: number
  per_page: number
  last_page: number
}

/**
 * 用户信息
 */
export interface User {
  email: string
  transfer_enable: number        // 总流量（字节）
  last_login_at: number          // 最后登录时间（时间戳）
  created_at: number             // 创建时间（时间戳）
  banned: number                 // 是否被封禁 (0/1)
  remind_expire: number          // 到期提醒 (0/1)
  remind_traffic: number         // 流量提醒 (0/1)
  expired_at: number             // 过期时间（时间戳）
  balance: number                // 账户余额
  commission_balance: number     // 佣金余额
  plan_id: number | null         // 套餐 ID
  discount: number | null        // 折扣
  commission_rate: number        // 佣金比例
  telegram_id: number | null     // Telegram ID
  uuid: string                   // 用户 UUID
  avatar_url?: string            // 头像 URL
}

/**
 * 用户统计
 */
export interface UserStat {
  pending_orders: number         // 待支付订单数
  pending_tickets: number        // 未关闭工单数
  invited_users: number          // 邀请用户数
}

/**
 * 订阅信息
 */
export interface Subscription {
  plan_id: number | null
  token: string
  expired_at: number             // 过期时间（时间戳）
  u: number                      // 上传流量（字节）
  d: number                      // 下载流量（字节）
  transfer_enable: number        // 总流量（字节）
  email: string
  uuid: string
  device_limit: number | null    // 设备数量限制
  speed_limit: number | null     // 速度限制
  next_reset_at: number | null   // 下次重置时间（时间戳）
  plan: Plan | null              // 套餐信息
  subscribe_url: string          // 订阅链接
  reset_day: number | null       // 重置日期
}

/**
 * 套餐信息
 */
export interface Plan {
  id: number
  name: string
  transfer_enable: number        // 流量（字节）
  month_price: number | null     // 月付价格
  quarter_price: number | null   // 季付价格
  half_year_price: number | null // 半年付价格
  year_price: number | null      // 年付价格
  two_year_price: number | null  // 两年付价格
  three_year_price: number | null// 三年付价格
  onetime_price: number | null   // 一次性价格
  reset_price: number | null     // 流量重置包价格
  content: string | null         // 套餐描述
  group_id: number               // 分组 ID
  capacity_limit: number | null  // 容量限制
  is_show: number                // 是否显示 (0/1)
  is_renew: number               // 是否可续费 (0/1)
  is_sell: number                // 是否可售 (0/1)
  speed_limit: number | null     // 速度限制
  device_limit: number | null    // 设备限制
}

/**
 * 套餐周期类型
 */
export type PlanPeriod =
  | 'month'
  | 'quarter'
  | 'half_year'
  | 'year'
  | 'two_year'
  | 'three_year'
  | 'onetime'
  | 'reset'

/**
 * 节点信息
 */
export interface Server {
  id: number
  name: string
  type: 'shadowsocks' | 'vmess' | 'trojan' | 'hysteria' | 'vless'
  host: string
  port: number
  rate: string                   // 倍率
  tags: string[]                 // 标签
  show: number                   // 是否显示 (0/1)
  last_check_at: number          // 最后检测时间（时间戳）
  status?: 'online' | 'offline'  // 状态（前端计算）
  network?: string               // 网络类型
  settings?: Record<string, any> // 节点配置
}

/**
 * 订单状态
 */
export type OrderStatus = 0 | 1 | 2 | 3 | 4;

/**
 * 订单信息
 */
export interface Order {
  id: number
  trade_no: string               // 订单号
  plan_id: number
  period: PlanPeriod             // 订阅周期
  total_amount: number           // 总金额
  status: OrderStatus            // 订单状态
  created_at: number             // 创建时间（时间戳）
  updated_at?: number            // 更新时间（时间戳）
  plan?: Plan                    // 套餐信息
  discount_amount?: number       // 折扣金额
  balance_amount?: number        // 余额支付金额
  surplus_amount?: number        // 需支付金额
}

/**
 * 支付方式
 */
export interface PaymentMethod {
  id: number
  name: string
  payment: string                // 支付标识（alipay, stripe 等）
  icon: string | null            // 图标
  handling_fee_fixed?: number    // 固定手续费
  handling_fee_percent?: number  // 百分比手续费
}

/**
 * 工单等级
 */
export type TicketLevel = 0 | 1 | 2;

/**
 * 工单状态
 */
export type TicketStatus = 0 | 1;

/**
 * 工单信息
 */
export interface Ticket {
  id: number
  user_id: number
  subject: string                // 标题
  level: TicketLevel             // 等级
  status: TicketStatus           // 状态
  created_at: number             // 创建时间（时间戳）
  updated_at: number             // 更新时间（时间戳）
  reply_status: number           // 回复状态 (0=未回复/1=已回复)
  messages?: TicketMessage[]     // 消息列表
}

/**
 * 工单消息
 */
export interface TicketMessage {
  id: number
  ticket_id: number
  user_id: number
  message: string
  created_at: number             // 创建时间（时间戳）
  is_admin?: boolean             // 是否管理员回复
}

/**
 * 优惠券信息
 */
export interface Coupon {
  id: number
  code: string
  name: string
  type: number                   // 类型 (1=金额/2=百分比)
  value: number                  // 优惠值
  limit_use: number | null       // 使用次数限制
  limit_use_with_user: number | null // 每用户使用次数限制
  limit_plan_ids: number[] | null    // 限制套餐
  limit_period: string[] | null      // 限制周期
  started_at: number             // 开始时间（时间戳）
  ended_at: number               // 结束时间（时间戳）
}

/**
 * 邀请码信息
 */
export interface InviteCode {
  id: number
  code: string
  status: number                 // 状态 (0=未使用/1=已使用)
  pv: number                     // 访问量
  created_at?: number            // 创建时间（时间戳）
}

/**
 * 邀请统计
 */
export interface InviteStat {
  codes: InviteCode[]
  stat: [number, number, number] // [总邀请数, 有效邀请数, 佣金收入]
  link: string
  commission_rate: number
  registered_count: number
  total_commission: number
}

/**
 * 邀请详情 (佣金记录)
 */
export interface InviteDetail {
  id: number
  order_amount: number
  get_amount: number
  status: number // 0: pending, 1: confirmed, 2: cancelled
  created_at: number
  email?: string // May not always be present
}

/**
 * 公告信息
 */
export interface Notice {
  id: number
  title: string
  content: string
  img_url: string | null
  created_at: number             // 创建时间（时间戳）
  tags: string[]
}

/**
 * 知识库分类
 */
export interface KnowledgeCategory {
  id: number
  name: string
  count: number                  // 文章数量
}

/**
 * 知识库文章
 */
export interface Knowledge {
  id: number
  category: string
  title: string
  body: string
  created_at: number             // 创建时间（时间戳）
  updated_at?: number            // 更新时间（时间戳）
}

/**
 * 流量日志
 */
export interface TrafficLog {
  date: string                   // 日期（YYYY-MM-DD）
  u: number                      // 上传（字节）
  d: number                      // 下载（字节）
}

/**
 * 系统配置
 */
export interface SystemConfig {
  is_email_verify: boolean       // 是否需要邮箱验证
  is_invite_force: boolean       // 是否强制邀请码
  email_whitelist_suffix: string[] // 邮箱白名单后缀
  is_recaptcha: boolean          // 是否启用 reCAPTCHA
  recaptcha_site_key: string     // reCAPTCHA Site Key
  app_name: string               // 应用名称/站点名称
  app_description: string        // 应用描述
  app_url: string                // 应用 URL
  logo: string | null            // Logo
  subscribe_url: string          // 订阅 URL
  try_out_plan_id: number | null // 试用套餐 ID
  try_out_hour: number           // 试用时长（小时）
  currency: string               // 货币代码
  currency_symbol: string        // 货币符号
}

/**
 * 登录请求
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * 注册请求
 */
export interface RegisterRequest {
  email: string
  password: string
  invite_code?: string
  email_code: string
}

/**
 * 认证响应
 */
export interface AuthResponse {
  token: string
  auth_data: string
}

/**
 * 修改密码请求
 */
export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

/**
 * 创建订单请求
 */
export interface CreateOrderRequest {
  plan_id: number
  period: PlanPeriod
  coupon_code?: string
}

/**
 * 创建订单响应
 */
export interface CreateOrderResponse {
  trade_no: string
}

/**
 * 订单结账请求
 */
export interface CheckoutOrderRequest {
  trade_no: string
  method: number                 // 支付方式 ID
}

/**
 * 订单结账响应
 */
export interface CheckoutOrderResponse {
  type: number                   // 类型 (0=无需跳转/1=跳转URL/2=二维码)
  url?: string                   // 支付 URL
  data?: string                  // 二维码数据
}

/**
 * 创建工单请求
 */
export interface CreateTicketRequest {
  subject: string
  level: TicketLevel
  message: string
}

/**
 * 回复工单请求
 */
export interface ReplyTicketRequest {
  id: number
  message: string
}

/**
 * Telegram Bot 信息
 */
export interface TelegramBotInfo {
  username: string
}

/**
 * 礼品卡类型
 */
export interface GiftCardType {
  id: number
  name: string
  description: string | null
}

/**
 * 礼品卡兑换请求
 */
export interface RedeemGiftCardRequest {
  code: string
}

/**
 * 用户会话
 */
export interface UserSession {
  session_id: string
  ip: string
  location?: string
  device?: string
  last_active: number            // 最后活动时间（时间戳）
}

/**
 * 导航菜单项
 */
export interface NavigationItem {
  title: string
  icon: string
  path?: string
  badge?: string | number | 'dynamic' | null
  children?: NavigationItem[]
  action?: string
  style?: 'default' | 'danger' | 'success' | 'warning'
  divider?: boolean
}

/**
 * 流量使用信息（计算后的）
 */
export interface TrafficUsage {
  used: number                   // 已使用（字节）
  total: number                  // 总量（字节）
  remaining: number              // 剩余（字节）
  percentage: number             // 使用百分比
  usedFormatted: string          // 格式化的已使用量
  totalFormatted: string         // 格式化的总量
  remainingFormatted: string     // 格式化的剩余量
}

/**
 * 到期信息（计算后的）
 */
export interface ExpirationInfo {
  expiredAt: number              // 过期时间戳
  daysLeft: number               // 剩余天数
  isExpiringSoon: boolean        // 是否即将过期（<7天）
  isExpired: boolean             // 是否已过期
  formatted: string              // 格式化的到期时间
}
