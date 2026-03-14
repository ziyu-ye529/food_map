const EXAMPLE_ENV = `VITE_MAPBOX_ACCESS_TOKEN=pk.***`;

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-[#E6EAF2]">
      <div className="text-lg font-semibold">使用说明</div>
      <div className="mt-2 text-sm text-[#AAB3C5]">这是一个纯前端脚手架，用于快速搭建 Mapbox 交互原型。</div>

      <div className="mt-6 grid gap-4">
        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">快速开始</div>
          <div className="mt-2 text-sm text-[#AAB3C5]">
            <div>1) 安装依赖：npm install</div>
            <div>2) 启动开发：npm run dev</div>
            <div>3) 类型检查：npm run check</div>
            <div>4) 构建产物：npm run build</div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Token 配置</div>
          <div className="mt-2 text-sm text-[#AAB3C5]">在项目根目录创建 .env.local，写入以下变量：</div>
          <pre className="mt-3 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-[#E6EAF2]">
            {EXAMPLE_ENV}
          </pre>
          <div className="mt-2 text-sm text-[#AAB3C5]">请不要把真实 Token 提交到仓库。</div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">扩展建议</div>
          <div className="mt-2 text-sm text-[#AAB3C5]">
            <div>• 页面：在 src/pages 新增页面并在 src/App.tsx 注册路由。</div>
            <div>• 地图：优先把交互封装为可复用组件/Hook，并用 zustand 存储 UI 状态。</div>
            <div>• 数据：后续你可把需要后端的内容先在前端写死，再替换成真实 API。</div>
          </div>
        </section>
      </div>
    </div>
  );
}

