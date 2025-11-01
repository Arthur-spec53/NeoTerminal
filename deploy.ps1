# XBoard 前端一键部署脚本 (Windows PowerShell)
# 版本: 1.0.0
# 需要以管理员权限运行

#Requires -RunAsAdministrator

# 设置错误处理
$ErrorActionPreference = "Stop"

# 配置变量
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DistDir = Join-Path $ScriptDir "dist"
$BackupDir = Join-Path $ScriptDir "backups"
$LogFile = Join-Path $ScriptDir "deploy.log"

# 颜色函数
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Message)
    Write-Host "▶ $Message" -ForegroundColor Blue
}

# 日志函数
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$timestamp] $Message" | Out-File -FilePath $LogFile -Append
}

# 打印横幅
function Show-Banner {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  🚀 XBoard 前端一键部署脚本 v1.0.0 (Windows)" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

# 确认提示
function Confirm-Action {
    param(
        [string]$Message,
        [bool]$Default = $false
    )
    
    $choices = if ($Default) { "[Y/n]" } else { "[y/N]" }
    $response = Read-Host "$Message $choices"
    
    if ([string]::IsNullOrWhiteSpace($response)) {
        return $Default
    }
    
    return $response -match "^[yY]"
}

# 检查前置条件
function Test-Prerequisites {
    Write-Step "检查部署前置条件..."
    
    if (-not (Test-Path $DistDir)) {
        Write-ErrorMsg "未找到 dist 目录！请先运行 'npm run build' 进行构建"
        exit 1
    }
    
    if (-not (Test-Path "$DistDir\index.html")) {
        Write-ErrorMsg "dist 目录中未找到 index.html！构建可能未完成"
        exit 1
    }
    
    Write-Success "前置条件检查通过"
}

# 检查 IIS
function Test-IIS {
    $iis = Get-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole -ErrorAction SilentlyContinue
    return $iis -and $iis.State -eq "Enabled"
}

# 安装 IIS
function Install-IIS {
    Write-Step "安装 IIS..."
    
    try {
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpErrors -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpRedirect -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-ApplicationDevelopment -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-HealthAndDiagnostics -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpLogging -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-LoggingLibraries -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-RequestMonitor -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpTracing -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-Security -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-URLAuthorization -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-RequestFiltering -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-IPSecurity -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-Performance -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpCompressionDynamic -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerManagementTools -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-ManagementScriptingTools -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-IIS6ManagementCompatibility -All -NoRestart
        Enable-WindowsOptionalFeature -Online -FeatureName IIS-Metabase -All -NoRestart
        
        Write-Success "IIS 安装完成"
        Write-Warning "请重启计算机以完成 IIS 安装"
        
        if (Confirm-Action "是否立即重启计算机？" $false) {
            Restart-Computer -Force
            exit
        }
    }
    catch {
        Write-ErrorMsg "IIS 安装失败: $_"
        return $false
    }
    
    return $true
}

# 生成 IIS web.config
function New-WebConfig {
    param([string]$Path)
    
    $webConfig = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <!-- URL 重写规则 - SPA 路由支持 -->
        <rewrite>
            <rules>
                <rule name="SPA Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/" />
                </rule>
            </rules>
        </rewrite>
        
        <!-- HTTP 压缩 -->
        <httpCompression>
            <dynamicTypes>
                <add mimeType="text/*" enabled="true" />
                <add mimeType="message/*" enabled="true" />
                <add mimeType="application/javascript" enabled="true" />
                <add mimeType="application/json" enabled="true" />
                <add mimeType="*/*" enabled="false" />
            </dynamicTypes>
            <staticTypes>
                <add mimeType="text/*" enabled="true" />
                <add mimeType="message/*" enabled="true" />
                <add mimeType="application/javascript" enabled="true" />
                <add mimeType="application/json" enabled="true" />
                <add mimeType="*/*" enabled="false" />
            </staticTypes>
        </httpCompression>
        
        <!-- 静态内容缓存 -->
        <staticContent>
            <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" />
        </staticContent>
        
        <!-- 安全头 -->
        <httpProtocol>
            <customHeaders>
                <add name="X-Frame-Options" value="SAMEORIGIN" />
                <add name="X-Content-Type-Options" value="nosniff" />
                <add name="X-XSS-Protection" value="1; mode=block" />
                <add name="Referrer-Policy" value="no-referrer-when-downgrade" />
            </customHeaders>
        </httpProtocol>
    </system.webServer>
</configuration>
"@
    
    $webConfig | Out-File -FilePath (Join-Path $Path "web.config") -Encoding UTF8
    Write-Success "web.config 已生成"
}

# IIS 部署
function Deploy-IIS {
    Write-Step "开始 IIS 部署..."
    
    # 检查 IIS
    if (-not (Test-IIS)) {
        Write-Warning "未检测到 IIS"
        if (Confirm-Action "是否安装 IIS？" $true) {
            if (-not (Install-IIS)) {
                return
            }
        } else {
            Write-ErrorMsg "IIS 是必需的，部署已取消"
            return
        }
    } else {
        Write-Success "检测到 IIS 已安装"
    }
    
    # 获取配置
    $siteName = Read-Host "请输入网站名称 (默认: XBoard)"
    if ([string]::IsNullOrWhiteSpace($siteName)) { $siteName = "XBoard" }
    
    $webRoot = Read-Host "请输入网站根目录 (默认: C:\inetpub\wwwroot\xboard)"
    if ([string]::IsNullOrWhiteSpace($webRoot)) { $webRoot = "C:\inetpub\wwwroot\xboard" }
    
    $port = Read-Host "请输入端口号 (默认: 80)"
    if ([string]::IsNullOrWhiteSpace($port)) { $port = "80" }
    
    # 确认配置
    Write-Host ""
    Write-Info "═══ 部署配置确认 =══"
    Write-Host "网站名称: $siteName"
    Write-Host "网站目录: $webRoot"
    Write-Host "端口号: $port"
    Write-Host ""
    
    if (-not (Confirm-Action "确认配置无误？" $true)) {
        Write-Info "部署已取消"
        return
    }
    
    # 创建目录
    Write-Step "创建网站目录..."
    if (-not (Test-Path $webRoot)) {
        New-Item -ItemType Directory -Path $webRoot -Force | Out-Null
    }
    
    # 备份
    if ((Test-Path $webRoot) -and (Get-ChildItem $webRoot -Force | Measure-Object).Count -gt 0) {
        if (Confirm-Action "目录不为空，是否备份现有文件？" $true) {
            $backupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            $backupPath = Join-Path $BackupDir $backupName
            New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
            Copy-Item -Path $webRoot -Destination $backupPath -Recurse -Force
            Write-Success "备份已保存: $backupPath"
        }
    }
    
    # 复制文件
    Write-Step "复制文件..."
    Copy-Item -Path "$DistDir\*" -Destination $webRoot -Recurse -Force
    Write-Success "文件复制完成"
    
    # 生成 web.config
    Write-Step "生成 web.config..."
    New-WebConfig -Path $webRoot
    
    # 配置 IIS
    try {
        Import-Module WebAdministration
        
        # 检查网站是否存在
        $existingSite = Get-Website -Name $siteName -ErrorAction SilentlyContinue
        if ($existingSite) {
            if (Confirm-Action "网站 '$siteName' 已存在，是否删除重建？" $true) {
                Remove-Website -Name $siteName
            } else {
                Write-Info "保留现有网站"
                return
            }
        }
        
        # 创建应用程序池
        $appPool = "XBoardAppPool"
        if (-not (Test-Path "IIS:\AppPools\$appPool")) {
            New-WebAppPool -Name $appPool
            Set-ItemProperty "IIS:\AppPools\$appPool" -Name managedRuntimeVersion -Value ""
            Write-Success "应用程序池已创建: $appPool"
        }
        
        # 创建网站
        New-Website -Name $siteName -PhysicalPath $webRoot -ApplicationPool $appPool -Port $port
        Write-Success "IIS 网站已创建"
        
        # 启动网站
        Start-Website -Name $siteName
        Write-Success "网站已启动"
        
        Write-Host ""
        Write-Success "═══ IIS 部署完成！ =══"
        Write-Info "访问地址: http://localhost:$port"
        Write-Info "网站名称: $siteName"
        Write-Info "网站目录: $webRoot"
        
    } catch {
        Write-ErrorMsg "IIS 配置失败: $_"
    }
}

# 简单部署
function Deploy-Simple {
    Write-Step "简单部署模式..."
    
    $targetDir = Read-Host "请输入目标目录"
    
    if ([string]::IsNullOrWhiteSpace($targetDir)) {
        Write-ErrorMsg "目标目录不能为空"
        return
    }
    
    # 创建目录
    if (-not (Test-Path $targetDir)) {
        if (Confirm-Action "目录不存在，是否创建？" $true) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        } else {
            return
        }
    }
    
    # 备份
    if ((Test-Path $targetDir) -and (Get-ChildItem $targetDir -Force | Measure-Object).Count -gt 0) {
        if (Confirm-Action "目录不为空，是否备份？" $true) {
            $backupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            $backupPath = Join-Path $BackupDir $backupName
            New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
            Copy-Item -Path $targetDir -Destination $backupPath -Recurse -Force
            Write-Success "备份已保存: $backupPath"
        }
    }
    
    # 复制文件
    Write-Step "复制文件..."
    Copy-Item -Path "$DistDir\*" -Destination $targetDir -Recurse -Force
    Write-Success "文件已复制到: $targetDir"
    
    Write-Host ""
    Write-Info "提示: 您还需要配置 Web 服务器指向该目录"
}

# 显示部署信息
function Show-DeployInfo {
    Write-Host ""
    Write-Info "═══ 部署环境信息 =══"
    Write-Host ""
    Write-Host "操作系统: $($PSVersionTable.OS)"
    Write-Host "PowerShell: $($PSVersionTable.PSVersion)"
    Write-Host "脚本目录: $ScriptDir"
    Write-Host "构建目录: $DistDir"
    Write-Host "备份目录: $BackupDir"
    Write-Host "日志文件: $LogFile"
    Write-Host ""
    
    if (Test-Path $DistDir) {
        $distSize = (Get-ChildItem $DistDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1KB
        $fileCount = (Get-ChildItem $DistDir -Recurse -File | Measure-Object).Count
        Write-Host "构建大小: $([math]::Round($distSize, 2)) KB"
        Write-Host "文件数量: $fileCount"
    } else {
        Write-Warning "未找到构建目录"
    }
    
    Write-Host ""
    Write-Host "已安装的工具:"
    if (Test-IIS) {
        Write-Host "  ✓ IIS" -ForegroundColor Green
    } else {
        Write-Host "  ✗ IIS" -ForegroundColor Red
    }
    Write-Host ""
}

# 主菜单
function Show-Menu {
    Write-Host ""
    Write-Host "请选择部署方式:"
    Write-Host ""
    Write-Host "  1) IIS 部署 (推荐) - 自动配置 IIS"
    Write-Host "  2) 简单部署 - 仅复制文件"
    Write-Host "  3) 查看部署信息"
    Write-Host "  4) 退出"
    Write-Host ""
    
    $choice = Read-Host "请输入选项 [1-4]"
    
    switch ($choice) {
        "1" { Deploy-IIS }
        "2" { Deploy-Simple }
        "3" { Show-DeployInfo }
        "4" { 
            Write-Info "退出部署脚本"
            exit 0
        }
        default {
            Write-ErrorMsg "无效的选项"
            Show-Menu
        }
    }
}

# 主程序
function Main {
    Show-Banner
    Write-Log "===== 部署开始 ====="
    
    # 检查管理员权限
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $isAdmin) {
        Write-Warning "建议以管理员权限运行此脚本"
    }
    
    # 检查前置条件
    Test-Prerequisites
    
    # 显示菜单
    Show-Menu
    
    # 询问是否继续
    Write-Host ""
    if (Confirm-Action "是否继续其他操作？" $false) {
        Show-Menu
    }
    
    Write-Host ""
    Write-Success "感谢使用 XBoard 部署脚本！"
    Write-Log "===== 部署完成 ====="
}

# 运行主程序
try {
    Main
} catch {
    Write-ErrorMsg "部署过程中发生错误: $_"
    Write-Log "ERROR: $_"
    exit 1
}

