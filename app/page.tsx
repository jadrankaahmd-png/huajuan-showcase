'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { getTotalCapabilities } from './data/capabilities';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Bot, 
  Zap, 
  Target,
  TrendingUp,
  Activity,
  Database,
  Cpu,
  Rocket
} from 'lucide-react';

export default function Home() {
  const totalCapabilities = getTotalCapabilities();
  
  return (
    <main className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #fff5f8 0%, #ffeef8 25%, #f0f4ff 50%, #f5f0ff 75%, #fff0f5 100%)',
      fontFamily: '"Segoe UI", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
    }}>
      {/* 统一导航栏 */}
      <Navigation currentLayer={0} />
      
      {/* Hero Section - 可爱二次元风格 */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #ffeef8 0%, #fff0f5 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div 
              className="flex justify-center mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-20 h-20" style={{ color: '#ff6b9d' }} />
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold mb-4"
              style={{ 
                background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.05em'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              花卷美股智能投资系统
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 max-w-3xl mx-auto"
              style={{ color: '#8b7b9e', fontWeight: 500 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              基于AI的三层架构投资系统，从数据采集、智能分析到真实选股，全流程自动化投资决策 ✨
            </motion.p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { value: `${totalCapabilities}+`, label: '总能力', color: '#ff6b9d', bgColor: '#fff0f5', Icon: Database },
                { value: '3', label: '层级架构', color: '#9c88ff', bgColor: '#f0f4ff', Icon: Cpu },
                { value: 'AI', label: '智能驱动', color: '#74b9ff', bgColor: '#e8f4ff', Icon: Rocket }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="px-6 py-3 rounded-3xl shadow-lg"
                  style={{ 
                    backgroundColor: stat.bgColor,
                    border: '2px solid rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 8px 25px rgba(255,107,157,0.3)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <stat.Icon className="w-5 h-5" style={{ color: stat.color }} />
                    <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  </div>
                  <div className="text-sm" style={{ color: '#8b7b9e' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 装饰元素 - 可爱圆形 */}
        <motion.div 
          className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, #ffb6c1 0%, transparent 70%)' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, #dda0dd 0%, transparent 70%)' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/2 w-72 h-72 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, #add8e6 0%, transparent 70%)' }}
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -50, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </section>

      {/* 三层架构介绍 - 可爱卡片风格 */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #fff0f5 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold mb-4"
              style={{ 
                background: 'linear-gradient(135deg, #ff6b9d 0%, #9c88ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              三层架构
            </motion.h2>
            <motion.p 
              className="text-lg"
              style={{ color: '#8b7b9e' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              从数据到决策的完整链路 ✨
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8" style={{ gap: '2rem' }}>
            {[
              {
                href: '/coe',
                Icon: Sparkles,
                title: '第一层：能力中心',
                desc: `数据采集与基础能力层，包含${totalCapabilities}+个能力`,
                features: ['全球宏观地缘风险监控', '实时数据采集', '新闻情绪分析', 'Telegram新闻流', '知识库系统'],
                gradient: 'linear-gradient(135deg, #fff0f5 0%, #ffe4ec 100%)',
                borderColor: '#ffb6c1',
                textColor: '#ff6b9d'
              },
              {
                href: '/dynamic-model',
                Icon: Bot,
                title: '第二层：动态模型',
                desc: 'AI分析与量化策略层，智能研判市场',
                features: ['AI自动研究引擎', '量化策略回测', '市场情绪分析', 'AI美股市场分析师', 'QVeris 万级数据接入'],
                gradient: 'linear-gradient(135deg, #f0f4ff 0%, #e4e8ff 100%)',
                borderColor: '#b4a7d6',
                textColor: '#9c88ff'
              },
              {
                href: '/stock-picker',
                Icon: Target,
                title: '第三层：选股推荐',
                desc: '真实选股推荐层，输出投资决策',
                features: ['智能选股系统', '风险评估模型', '投资组合优化', '实时推荐更新', '回测验证'],
                gradient: 'linear-gradient(135deg, #e8f4ff 0%, #d4ebff 100%)',
                borderColor: '#87ceeb',
                textColor: '#74b9ff'
              }
            ].map((layer, index) => (
              <Link key={index} href={layer.href}>
                <motion.div
                  className="h-full p-8 cursor-pointer"
                  style={{ 
                    background: layer.gradient,
                    borderRadius: '2rem',
                    border: `2px solid ${layer.borderColor}`,
                    boxShadow: '0 4px 20px rgba(255,182,193,0.2)'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 8px 30px rgba(255,107,157,0.3)',
                    borderColor: layer.textColor
                  }}
                >
                  <motion.div 
                    className="flex justify-center mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <layer.Icon className="w-16 h-16" style={{ color: layer.textColor }} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: layer.textColor }}>
                    {layer.title}
                  </h3>
                  <p className="mb-4" style={{ color: '#8b7b9e', fontSize: '0.95rem' }}>
                    {layer.desc}
                  </p>
                  <ul className="text-sm space-y-2 mb-6" style={{ color: '#a093b3' }}>
                    {layer.features.map((feature, i) => (
                      <li key={i}>✓ {feature}</li>
                    ))}
                  </ul>
                  <motion.div 
                    className="font-semibold"
                    style={{ color: layer.textColor }}
                    whileHover={{ x: 5 }}
                  >
                    进入{layer.title.split('：')[0]} →
                  </motion.div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 核心优势 - 可爱圆形卡片 */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #fff5f8 0%, #f0f4ff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold mb-4"
              style={{ 
                background: 'linear-gradient(135deg, #74b9ff 0%, #ff6b9d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              核心优势
            </motion.h2>
            <motion.p 
              className="text-lg"
              style={{ color: '#8b7b9e' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              AI驱动的美股投资决策系统 ✨
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ gap: '2rem' }}>
            {[
              { Icon: TrendingUp, title: `${totalCapabilities}+能力`, desc: '数据采集、分析、监控全覆盖', color: '#ff6b9d', bgColor: '#fff0f5' },
              { Icon: Bot, title: 'AI驱动', desc: '智能分析、自动研判', color: '#9c88ff', bgColor: '#f0f4ff' },
              { Icon: Activity, title: '实时数据', desc: '全球数据实时更新', color: '#74b9ff', bgColor: '#e8f4ff' },
              { Icon: Target, title: '真实推荐', desc: '可执行的投资建议', color: '#ffb347', bgColor: '#fff8e8' }
            ].map((advantage, index) => (
              <motion.div
                key={index}
                className="text-center p-8"
                style={{ 
                  backgroundColor: advantage.bgColor,
                  borderRadius: '2rem',
                  border: '2px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 4px 20px rgba(255,182,193,0.2)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 8px 30px rgba(255,107,157,0.3)'
                }}
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                >
                  <advantage.Icon className="w-12 h-12" style={{ color: advantage.color }} />
                </motion.div>
                <h3 className="text-xl font-bold mb-2" style={{ color: advantage.color }}>
                  {advantage.title}
                </h3>
                <p className="text-sm" style={{ color: '#8b7b9e' }}>
                  {advantage.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - 简洁可爱 */}
      <footer className="py-8" style={{ 
        background: 'linear-gradient(135deg, #fff0f5 0%, #f0f4ff 100%)',
        borderTop: '2px solid rgba(255,182,193,0.3)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ color: '#8b7b9e' }}>
          <p>🌸 花卷美股智能投资系统 © 2026</p>
          <p className="text-sm mt-2" style={{ color: '#a093b3' }}>AI-Powered US Stock Investment System ✨</p>
        </div>
      </footer>
    </main>
  );
}
