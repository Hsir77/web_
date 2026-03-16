import { useEffect, useState } from 'react';
import api from '../../../../api/index';
import Charts from '../../../../components/common/Charts';

export default function DataChartShuqi() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const types = ['barH', 'pie', 'bar'] as const;
  const titles = ['书旗分类横向柱状图', '书旗分类占比饼图', '书旗分类纵向柱状图'];
  const colors = ['#36c361', '#2f80ed', '#4096ff'];

  useEffect(() => {
    api.get('/echarts/category/shuqi').then(res => {
      const originData = res.data!;

      // 1. 先算总数
      const total = originData.reduce((sum: number, item: any) => sum + item.count, 0);

      // 2. 小分类（<1%）丢到其他
      const map: Record<string, number> = {};
      originData.forEach((item: any) => {
        const ratio = item.count / total;
        if (ratio < 0.01) {
          map.其他 = (map.其他 || 0) + item.count;
        } else {
          map[item.category] = (map[item.category] || 0) + item.count;
        }
      });

      // 3. 转成图表需要的格式
      const transformedData = Object.entries(map).map(([category, total_recommend]) => ({
        category,
        total_recommend,
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