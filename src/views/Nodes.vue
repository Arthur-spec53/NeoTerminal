<template>
  <div class="nodes-page">
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">节点列表</h1>
    </div>

    <GeekCard title="服务器列表">
      <div class="nodes-table">
        <div class="table-header">
          <div>[编号]</div>
          <div>[名称]</div>
          <div>[类型]</div>
          <div>[地址]</div>
          <div>[倍率]</div>
          <div>[状态]</div>
        </div>
        <div v-for="server in servers" :key="server.id" class="table-row">
          <div>{{ server.id }}</div>
          <div>{{ server.name }}</div>
          <div>{{ server.type }}</div>
          <div>{{ server.host }}</div>
          <div>x{{ server.rate }}</div>
          <div :class="statusClass(server.status)">{{ getStatusText(server.status) }}</div>
        </div>
        <div v-if="servers.length === 0" class="no-data">
          [暂无可用节点]
        </div>
      </div>
    </GeekCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { serverService } from '@/api'
import GeekCard from '@/components/common/GeekCard.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'
import type { Server } from '@/types'

const servers = ref<Server[]>([])

const fetchServers = async () => {
  try {
    console.log('[Nodes] 正在获取节点列表...')
    const response = await serverService.fetch()
    console.log('[Nodes] API响应:', response)
    
    if (response.success) {
      const now = Math.floor(Date.now() / 1000)
      const fiveMinutesAgo = now - 300 // 5 minutes in seconds

      // 确保 response.data 是数组
      let serverData: Server[] = []
      
      if (Array.isArray(response.data)) {
        serverData = response.data
        console.log('[Nodes] ✅ 直接获取到数组，共', serverData.length, '个节点')
      } else if (response.data && typeof response.data === 'object') {
        // 尝试从嵌套的 data 属性中获取数组
        if (Array.isArray(response.data.data)) {
          serverData = response.data.data
          console.log('[Nodes] ✅ 从嵌套data中提取，共', serverData.length, '个节点')
        } else {
          console.warn('[Nodes] ⚠️ 数据格式异常:', response.data)
          serverData = []
        }
      } else {
        console.warn('[Nodes] ⚠️ response.data 不是数组:', response.data)
        serverData = []
      }

      // 过滤和处理节点数据
      if (serverData.length > 0) {
        console.log('[Nodes] 开始过滤节点，原始数据样例:', JSON.stringify(serverData[0], null, 2))
        console.log('[Nodes] show字段值:', serverData[0]?.show, '类型:', typeof serverData[0]?.show)
        console.log('[Nodes] 所有字段名:', Object.keys(serverData[0]))
      }
      
      servers.value = serverData
        .filter((server: any) => {
          // show 字段是 number 类型（0/1）
          // 也可能是 boolean 或者字段名是 is_show
          const showField = server.show !== undefined ? server.show : server.is_show
          const isVisible = showField === true || showField === 1 || showField === '1' || showField === undefined
          
          console.log('[Nodes] 节点:', server.name, 'show=', server.show, 'is_show=', server.is_show, 'showField=', showField, '可见=', isVisible)
          
          return isVisible
        })
        .map((server: any) => ({
          ...server,
          status: server.last_check_at > fiveMinutesAgo ? 'online' : 'offline',
        }))
      
      console.log('[Nodes] ✅ 处理完成，可见节点:', servers.value.length, '个，总节点:', serverData.length, '个')
      if (servers.value.length > 0) {
        console.log('[Nodes] 节点列表样例:', servers.value[0])
      } else if (serverData.length > 0) {
        console.warn('[Nodes] ⚠️ 所有节点都被过滤了！第一个节点完整数据:', serverData[0])
      }
    } else {
      console.warn('[Nodes] ⚠️ API返回失败:', response.message)
    }
  } catch (error) {
    console.error('[Nodes] ❌ 获取节点列表失败:', error)
    servers.value = []
  }
}

const statusClass = (status: string | undefined) => {
  return status === 'online' ? 'status-online' : 'status-offline'
}

const getStatusText = (status: string | undefined) => {
  return status === 'online' ? '在线' : '离线'
}

onMounted(() => {
  fetchServers()
})
</script>

<style scoped>
.nodes-page {
  padding: 2rem;
  font-family: var(--font-mono);
  color: var(--hacker-primary);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 24px;
  color: var(--hacker-primary-bright);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: var(--glow-md);
}

.nodes-table {
  font-size: 12px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr 2fr 0.5fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--hacker-primary-dim);
}

.table-header {
  color: var(--hacker-primary-bright);
  font-weight: bold;
  text-shadow: var(--glow-sm);
}

.table-row:hover {
  background: rgba(0, 255, 0, 0.05);
}

.status-online {
  color: var(--hacker-success);
}

.status-offline {
  color: var(--hacker-error);
}

.no-data {
  text-align: center;
  padding: 2rem 0;
  color: var(--hacker-text-dim);
  opacity: 0.7;
  grid-column: 1 / -1;
}
</style>
