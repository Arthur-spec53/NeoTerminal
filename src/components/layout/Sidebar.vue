<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <router-link to="/" class="logo-link">
        <pre class="ascii-logo">
╦ ╦╔╗ ╔═╗╔═╗╦═╗╔╦╗
╔╩╦╝╠╩╗║ ║╠═╣╠╦╝ ║║
╩ ╚═╚═╝╚═╝╩ ╩╩╚══╩╝</pre>
      </router-link>
    </div>
    <nav class="main-nav">
      <ul>
        <li v-for="item in navigation" :key="item.name">
          <router-link :to="item.path" class="nav-link" active-class="active">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <div class="version">[v1.0.0-HACKER]</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const navigation = [
  { name: '仪表盘', path: '/dashboard', icon: '>' },
  { name: '使用文档', path: '/docs', icon: '?' },
  { name: '我的订单', path: '/billing/orders', icon: '*' },
  { name: '我的邀请', path: '/billing/invite', icon: '+' },
  { name: '购买订阅', path: '/subscription/plans', icon: '$' },
  { name: '节点列表', path: '/nodes', icon: '#' },
  { name: '个人中心', path: '/user/profile', icon: '@' },
  { name: '我的工单', path: '/user/tickets', icon: '!' },
  { name: '流量明细', path: '/user/traffic', icon: '~' },
]
</script>

<style scoped>

.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--hacker-bg);
  border-right: 1px solid var(--hacker-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: var(--glow-lg);
}

.sidebar-header {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid var(--hacker-border);
}

.logo-link {
  text-decoration: none;
  display: block;
}

.ascii-logo {
  font-size: 8px;
  line-height: 1;
  color: var(--hacker-primary-bright);
  text-shadow: var(--glow-sm);
  margin: 0;
  white-space: pre;
}

.main-nav {
  flex-grow: 1;
  padding: 1rem 0;
}

.main-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--hacker-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 14px;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: var(--hacker-primary-translucent);
  color: var(--hacker-primary-bright);
  border-left-color: var(--hacker-primary);
}

.nav-link.active {
  background: var(--hacker-primary-translucent);
  color: var(--hacker-primary-bright);
  border-left-color: var(--hacker-primary-bright);
  box-shadow: inset 3px 0 15px -5px var(--hacker-primary-bright);
}

.nav-icon {
  margin-right: 1rem;
  color: var(--hacker-primary-bright);
  font-weight: bold;
  font-size: 16px;
  width: 20px;
  display: inline-block;
  text-align: center;
}

.nav-link:hover .nav-icon,
.nav-link.active .nav-icon {
  text-shadow: var(--glow-md);
}

.sidebar-footer {
  padding: 1rem;
  text-align: center;
  font-size: 12px;
  color: var(--hacker-text-dim);
  border-top: 1px solid var(--hacker-border);
}
</style>
