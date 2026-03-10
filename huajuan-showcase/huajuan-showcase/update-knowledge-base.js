const fs = require('fs');
const path = require('path');

const filePath = './app/data/capabilities.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// 找到 knowledge-base 分类的 items 数组的结束位置
// 在 'GLM MCP 深度测试成功' 后面添加新能力

const searchStr = `      {
        name: 'GLM MCP 深度测试成功',
        description: '🎉 GLM MCP 深度测试全部通过！4个工具（联网搜索、网页读取、视觉理解、开源仓库）测试成功率100%',
        status: 'active',
        type: 'MCP工具',
        details: {
          whatItDoes: '深度测试GLM MCP的4个工具',
          howItWorks: '4个工具全部测试通过',
          currentStatus: '✅ 测试通过\\n- 联网搜索：41.4秒\\n- 网页读取：54.7秒\\n- 视觉理解：34.2秒\\n- 开源仓库：53.5秒',
          usage: 'GLM MCP已整合进选股系统',
          dependencies: ['GLM MCP Server', '智谱AI API']
        }
      }`;

const replaceStr = `      {
        name: 'GLM MCP 深度测试成功',
        description: '🎉 GLM MCP 深度测试全部通过！4个工具（联网搜索、网页读取、视觉理解、开源仓库）测试成功率100%',
        status: 'active',
        type: 'MCP工具',
        details: {
          whatItDoes: '深度测试GLM MCP的4个工具',
          howItWorks: '4个工具全部测试通过',
          currentStatus: '✅ 测试通过\\n- 联网搜索：41.4秒\\n- 网页读取：54.7秒\\n- 视觉理解：34.2秒\\n- 开源仓库：53.5秒',
          usage: 'GLM MCP已整合进选股系统',
          dependencies: ['GLM MCP Server', '智谱AI API']
        }
      },
      {
        name: '$AAOI 1.6T数据中心收发器首单分析',
        description: 'AAOI首个2亿美元1.6T收发器订单，预计成为美国最大800G/1.6T产能',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '分析AAOI首个2亿美元1.6T数据中心收发器订单',
          howItWorks: '投资逻辑、风险因素、关键指标分析',
          currentStatus: '✅ 已保存到知识库\\n- 新增时间：2026-03-09 21:01\\n- 所在页面：/coe/knowledge-base',
          usage: 'https://www.huajuan.news/coe/knowledge-base',
          dependencies: ['knowledge_base/aaoi_investment_thesis_2026-03-09.md']
        }
      }`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✅ capabilities.ts 已更新');
  console.log('新增能力：$AAOI 1.6T数据中心收发器首单分析');
} else {
  console.log('❌ 未找到匹配的文本');
  console.log('请检查 searchStr 是否正确');
}
