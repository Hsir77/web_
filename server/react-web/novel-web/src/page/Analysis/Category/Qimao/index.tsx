import { useEffect, useState } from 'react';
import api from '../../../../api/index';
import Charts from '../../../../components/common/Charts';

export default function DataChartQimao() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  // 轮播配置（顺序：横向柱状 → 饼图 → 纵向柱状）
  const types = ['barH', 'pie', 'bar'] as const;
  const titles = ['七猫分类横向柱状图', '七猫分类占比饼图', '七猫分类纵向柱状图'];
  const colors = ['#36c361', '#2f80ed', '#4096ff'];

  useEffect(() => {
    api.get('/echarts/category/qimao').then(res => {

      // 你要的 ! 断言
      const originData = res.data!;

      // 完全保留你的字段映射（保证图一定能渲染）
      const transformedData = originData.map((item: any) => ({
        category: item.category,
        total_recommend: item.count,
      }));

      setChartData(transformedData);
      setLoading(false);
    });
  }, []);

  const prev = () => {
    setIndex((i) => (i - 1 + types.length) % types.length);
  };

  const next = () => {
    setIndex((i) => (i + 1) % types.length);
  };

  if (loading) {
    return <div style={{ padding: 40 }}>加载中...</div>;
  }

  return (
    <div style={{
      position: 'relative',
      padding: '20px 30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 500 }}>
        {titles[index]}
      </h2>

      <div style={{ width: '100%' }}>
        <Charts
          type={types[index]}
          data={chartData}
          width="100%"
          height={480}
          color={colors[index]}
        />
      </div>

      {/* 左按钮 */}
      <button
        onClick={prev}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          width: 40,
          height: 100,
          border: 'none',
          borderRadius: '0 6px 6px 0',
          background: 'rgba(150,150,150,0.2)',
          color: '#333',
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ←
      </button>

      {/* 右按钮 */}
      <button
        onClick={next}
        style={{
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          width: 40,
          height: 100,
          border: 'none',
          borderRadius: '6px 0 0 6px',
          background: 'rgba(150,150,150,0.2)',
          color: '#333',
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        →
      </button>
    </div>
  );
}