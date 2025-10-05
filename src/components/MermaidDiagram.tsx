/**
 * Mermaid 图表组件
 * 文件路径: src/components/MermaidDiagram.tsx
 * 创建时间: 2025-10-05
 * 
 * 功能: 渲染 Mermaid 语法树图表
 */

'use client';

import { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (ref.current && chart) {
        try {
          // 动态导入 mermaid
          const mermaid = (await import('mermaid')).default;
          
          // 配置 mermaid
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
          });

          // 处理转义字符
          const cleanChart = chart
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');

          // 生成唯一ID
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          // 渲染图表
          const { svg } = await mermaid.render(id, cleanChart);
          
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid渲染失败:', error);
          if (ref.current) {
            ref.current.innerHTML = `
              <div class="text-orange-600 text-sm p-4 bg-orange-50 rounded">
                <p class="font-semibold mb-2">⚠️ 图表渲染失败</p>
                <p class="text-xs mb-2">您可以复制下面的代码到 <a href="https://mermaid.live" target="_blank" class="text-blue-600 underline">mermaid.live</a> 查看</p>
                <pre class="p-2 bg-gray-100 rounded text-xs overflow-x-auto">${chart}</pre>
              </div>
            `;
          }
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div className="bg-white p-4 rounded border border-gray-200">
      <div ref={ref} className="mermaid" />
    </div>
  );
}
