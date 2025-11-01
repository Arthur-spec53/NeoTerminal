// XBoard Geek Theme - API Services 统一导出
// 方便统一导入所有 API 服务

export { apiClient } from './client'

// 导入所有服务
import { authService } from './services/auth'
import { userService } from './services/user'
import { planService } from './services/plan'
import { serverService } from './services/server'
import { orderService } from './services/order'
import { ticketService } from './services/ticket'
import { noticeService } from './services/notice'
import { knowledgeService } from './services/knowledge'
import { inviteService } from './services/invite'
import { statService } from './services/stat'
import { configService } from './services/config'
import { couponService } from './services/coupon'
import { giftCardService } from './services/giftcard'
import { telegramService } from './services/telegram'

// 重新导出所有服务
export {
  authService,
  userService,
  planService,
  serverService,
  orderService,
  ticketService,
  noticeService,
  knowledgeService,
  inviteService,
  statService,
  configService,
  couponService,
  giftCardService,
  telegramService
}

// 便捷使用的默认导出
export default {
  auth: authService,
  user: userService,
  plan: planService,
  server: serverService,
  order: orderService,
  ticket: ticketService,
  notice: noticeService,
  knowledge: knowledgeService,
  invite: inviteService,
  stat: statService,
  config: configService,
  coupon: couponService,
  giftCard: giftCardService,
  telegram: telegramService
}

