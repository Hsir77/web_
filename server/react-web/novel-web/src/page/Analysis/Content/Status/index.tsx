import { useEffect, useState } from 'react';
import api from '../../../../api/index';
import Charts from '../../../../components/common/Charts';

export default function StatusPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  // 2张图：柱状图 → 饼图
  const chartList = [
    { type: 'barH' as const, title: '作品状态统计', color: '#36c361', data: data },
    { type: 'pie'  as const, title: '作品状态占比', color: '#2f80ed',  data: data },
  ];

  useEffect(() => {
    // 请求状态接口
    api.get('/echarts/content/status').then(res => {
      // 严格按照你的真实返回值：status + value
      const list = res.data!.map((item: any) => ({
        category: item.status,    // 你的字段：完结 / 连载中
        total_recommend: item.value, // 你的字段：数量
      }));
      setData(list);
      setLoading(false);
    });
  }, []);

  const prev = () => {
    setIndex((i) => (i - 1 + chartList.length) % chartList.length);
  };

  const next = () => {
    setIndex((i) => (i + 1) % chartList.length);
  };

  if (loading) {
    return <div style={{ padding: 40 }}>加载中...</div>;
  }

  const current = chartList[index];

  return (
    <div style={{
      position: 'relative',
      padding: '20px 30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 500 }}>
        {current.title}
      </h2>

      <div style={{ width: '100%' }}>
        <Charts
                key={index}
          type={current.type}
          data={current.data}
          width="100%"
          height={480}
          color={current.color}
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
          fontSize: 20,
          cursor: 'pointer',
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
          background: 'rgba(150,150,150,0.2)',
          width: 40,
          height: 100,
          border: 'none',
          borderRadius: '6px 0 0 6px',
          fontSize: 20,
          cursor: 'pointer',
        }}
      >
        →
      </button>
    </div>
  );
}