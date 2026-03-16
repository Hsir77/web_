import React from 'react';
// 引入封装好的 TrustChart 组件
import TrustChart from '../../components/common/Echarts';
import styles from './index.module.css';

// 功能卡片数据
const featureCards = [
  {
    title: '小说排行榜',
    desc: '生成小说阅读量、热度等维度的人气排行榜。'
  },
  {
    title: '我的书库',
    desc: '集中管理所有导入的小说数据和基础信息。'
  },
  {
    title: '可视化图表',
    desc: '将小说数据转化为各类直观的图表展示。'
  },
  {
    title: 'AI分析',
    desc: 'AI自动分析小说数据，挖掘读者偏好等规律。'
  },
  {
    title: '管理权限',
    desc: '设置人员权限，管控小说数据的查看和编辑。'
  }
];
const chartData = {
  xData: ['维度A', '维度B', '维度C', '维度D', '维度E', '维度F'],
  yData: [120, 200, 150, 80, 70, 110],
  seriesName: '示例数据',
  color: ['#6089c3', '#181053'],
  height: 400,
  title: '数据趋势可视化示例',
};

const App: React.FC = () => {

  return (
    <div className={styles.body}>
      <div className={styles.mainContainer}>
        <div className={styles.leftContent}>
          <header className={styles.header}>
            <h1 className={styles.title}>网络小说数据分析与可视化平台</h1>
            <p className={styles.desc}>
              支持小说数据可视化分析、查看书库排行榜、管理个人书架，还有 AI 智能分析功能，只需输入小说 URL 就能自动爬取数据，不用写代码就能轻松看懂小说数据。
            </p>
          </header>

          <main className={styles.main}>
            <div className={`${styles.card} ${styles.cardPaddingMd}`}>
              <TrustChart
                xData={chartData.xData}
                yData={chartData.yData}
                seriesName={chartData.seriesName}
                color={chartData.color}
                height={chartData.height}
                title={chartData.title}
                gridLeft="1%"
                axisFontSize={11}
              />
            </div>
          </main>

          {/* 底部说明 */}
          <footer className={styles.footer}>
            <p className={styles.footerText}>
              网络小说数据分析可视化平台 © 20**31** 版权所有 | ***大学***
            </p>
          </footer>
        </div>

        {/* 右侧：5个卡片（两列排版） */}
        <div className={styles.rightCards}>
          <section className={styles.section}>
            <div className={styles.gridContainer}>
              {featureCards.map((card, index) => (
                <div 
                  key={index} 
                  className={`${styles.card} ${styles.cardPaddingSm}`}
                  style={{height:"130px"}}
                >
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;