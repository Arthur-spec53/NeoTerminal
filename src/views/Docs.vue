<template>
  <div class="docs-page">
    <div class="page-header">
      <TerminalPrompt />
      <h1 class="page-title">使用文档</h1>
    </div>

    <GeekCard title="快速开始">
      <div class="doc-section">
        <h3 class="section-title">[1] 购买订阅</h3>
        <p class="section-content">
          点击左侧菜单"购买订阅"，选择适合您的套餐，完成支付即可开通服务。
        </p>
      </div>

      <div class="doc-section">
        <h3 class="section-title">[2] 获取订阅链接</h3>
        <p class="section-content">
          在"仪表盘"页面的"一键订阅"区域，您可以找到适用于不同客户端的订阅链接。
        </p>
      </div>

      <div class="doc-section">
        <h3 class="section-title">[3] 配置客户端</h3>
        <p class="section-content">
          根据您使用的设备和系统，选择相应的客户端：
        </p>
        <ul class="doc-list">
          <li><span class="list-marker">[>]</span> <strong>Windows/Mac/Linux:</strong> Clash、V2Ray</li>
          <li><span class="list-marker">[>]</span> <strong>iOS:</strong> Shadowrocket、Surge</li>
          <li><span class="list-marker">[>]</span> <strong>Android:</strong> Clash for Android、V2rayNG</li>
        </ul>
      </div>

      <div class="doc-section">
        <h3 class="section-title">[4] 导入订阅</h3>
        <p class="section-content">
          在客户端中点击"添加订阅"或"从URL导入"，粘贴您的订阅链接即可。
        </p>
      </div>
    </GeekCard>

    <GeekCard title="常见问题">
      <div class="doc-section">
        <h3 class="section-title">[Q] 如何查看流量使用情况？</h3>
        <p class="section-content">
          在"仪表盘"或"流量明细"页面可以查看详细的流量使用记录。
        </p>
      </div>

      <div class="doc-section">
        <h3 class="section-title">[Q] 订阅链接失效怎么办？</h3>
        <p class="section-content">
          前往"个人中心"，点击"重置订阅链接"按钮即可生成新的订阅链接。注意：旧链接将失效。
        </p>
      </div>

      <div class="doc-section">
        <h3 class="section-title">[Q] 如何查看节点状态？</h3>
        <p class="section-content">
          在"节点列表"页面可以查看所有可用节点及其在线状态、倍率等信息。
        </p>
      </div>

      <div class="doc-section">
        <h3 class="section-title">[Q] 如何联系客服？</h3>
        <p class="section-content">
          在"我的工单"页面可以创建工单，我们会尽快回复您的问题。
        </p>
      </div>
    </GeekCard>

    <GeekCard title="注意事项">
      <div class="doc-section">
        <ul class="doc-list warning-list">
          <li><span class="list-marker">[!]</span> 请勿分享您的订阅链接给他人</li>
          <li><span class="list-marker">[!]</span> 请遵守当地法律法规，合理使用服务</li>
          <li><span class="list-marker">[!]</span> 流量重置日期请查看"仪表盘"的订阅信息</li>
          <li><span class="list-marker">[!]</span> 如需邀请好友，请使用"我的邀请"页面的专用邀请链接</li>
        </ul>
      </div>
    </GeekCard>
  </div>
</template>

<script setup lang="ts">
import GeekCard from '@/components/common/GeekCard.vue'
import TerminalPrompt from '@/components/effects/TerminalPrompt.vue'
</script>

<style scoped>
.docs-page {
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
  letter-spacing: 2px;
  text-shadow: var(--glow-md);
}

.doc-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--hacker-primary-dim);
}

.doc-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  color: var(--hacker-primary-bright);
  font-size: 16px;
  margin-bottom: 0.75rem;
  text-shadow: var(--glow-sm);
}

.section-content {
  color: var(--hacker-text-dim);
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
}

.doc-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.doc-list li {
  padding: 0.5rem 0;
  color: var(--hacker-text-dim);
  font-size: 14px;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.list-marker {
  color: var(--hacker-primary-bright);
  flex-shrink: 0;
}

.doc-list strong {
  color: var(--hacker-primary);
}

.warning-list li {
  color: var(--hacker-warning);
}

.warning-list .list-marker {
  color: var(--hacker-warning);
}
</style>

