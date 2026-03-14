# React + Mapbox GL JS 脚手架｜页面设计说明（Desktop-first）

## 全局设计（适用于所有页面）

### Layout
- 框架：顶部导航（Top App Bar）+ 主内容区（Content）布局。
- 实现：CSS Grid（推荐）
  - `grid-template-rows: 56px 1fr;`
  - 内容区可用 `grid-template-columns: 1fr 360px;` 形成“地图 + 右侧信息面板”。
- 响应式：
  - Desktop（>=1024px）：地图与侧栏并排。
  - Tablet/Phone（<1024px）：侧栏改为折叠抽屉或下方面板（stack）。

### Meta Information
- 默认 Title：`React Mapbox GL JS Scaffold`
- 默认 Description：`A minimal React + Mapbox GL JS scaffold with basic map rendering and playground.`
- Open Graph：
  - `og:title` 与页面标题一致
  - `og:description` 与页面描述一致

### Global Styles（Design Tokens）
- 背景色：`--bg: #0B1220`（深色） / 备选浅色：`#F7F8FA`
- 卡片背景：`--surface: #111A2E`
- 文字：主文字 `#E6EAF2`，次文字 `#AAB3C5`
- 强调色：`--accent: #3B82F6`
- 边框：`rgba(255,255,255,0.08)`
- 字体：系统字体栈（`ui-sans-serif, system-ui`）
- 字号：12/14/16/20/24
- 按钮：
  - Primary：accent 背景 + 白字
  - Hover：亮度 +8%
  - Disabled：不透明度 40%
- 链接：accent 色；hover 下划线

### 交互与动效
- 面板展开/收起：200ms ease-out
- Toast/错误提示：淡入淡出 150ms

---

## 页面 1：首页（地图演示）

### Meta
- Title：`地图演示 | React Mapbox Scaffold`
- Description：`展示地图初始化、控件、示例图层与基础交互事件。`

### Page Structure
- 顶栏：左侧 Logo/项目名；中间导航（首页/Playground/关于）；右侧 GitHub/版本信息占位。
- 主内容区：两列布局
  - 左：地图区（占比 1fr）
  - 右：信息面板（固定宽 360px）

### Sections & Components
1. 顶栏（AppBar）
   - 元素：Logo、NavLinks、外链按钮（可选）
   - 状态：当前路由高亮；hover 背景微亮
2. 地图区（Map Canvas）
   - 容器：100% 宽高，最小高度建议 `calc(100vh - 56px)`
   - 覆盖层（Overlay）：左上角显示“当前 center/zoom”只读小标签（chip）
3. 右侧信息面板（Inspector Panel）
   - 卡片 1：运行状态
     - map loaded（是/否）、style loaded（是/否）
   - 卡片 2：交互事件
     - 显示最后一次 click/hover 的经纬度、zoom、时间
   - 卡片 3：选中要素属性（Feature Properties）
     - 当点选到示例 layer/marker 时，展示属性表格；无选中时显示空态文案
4. 错误提示（Error Banner）
   - 触发：Token 缺失/加载失败
   - 展示：错误标题 + 一段排查说明 + 跳转“关于/使用说明”链接

---

## 页面 2：地图 Playground

### Meta
- Title：`Playground | React Mapbox Scaffold`
- Description：`调试样式、视图参数与示例图层开关。`

### Page Structure
- 顶栏同首页
- 主内容区：左地图 + 右控制面板（表单为主）

### Sections & Components
1. 地图区
   - 与首页一致
2. 控制面板（Control Panel）
   - 模块 A：样式切换
     - 组件：下拉选择（Select）
     - 选项：Streets/Light/Dark/Satellite（作为预置项）
   - 模块 B：视图参数
     - 组件：输入框/滑杆（Zoom、Bearing、Pitch）与经纬度输入
     - 按钮：应用（Apply）、重置（Reset）
   - 模块 C：示例图层/数据开关
     - 组件：Switch/Checkbox 列表（Marker、GeoJSON Layer）
   - 模块 D：调试信息
     - 文本区：sources 数量、layers 数量、当前 style 名称

---

## 页面 3：关于 / 使用说明

### Meta
- Title：`使用说明 | React Mapbox Scaffold`
- Description：`本地运行、Token 配置与扩展方式说明。`

### Page Structure
- 单列内容区（居中，最大宽度 920px），顶部保留顶栏。

### Sections & Components
1. 快速开始（Quick Start）
   - 步骤列表：安装依赖、启动、构建
2. Token 配置
   - 说明：使用环境变量（如 `.env.local`）提供 Token
   - 安全提示：不要提交真实 Token 到仓库
3. 扩展指引
   - 列表：新增页面路由、封装 Map 组件、添加 source/layer 的推荐组织方式
4. 常见问题（FAQ）
   - 如：地图空白、Token 无效、容器高度为 0 等典型排查点（仅提示方向）
