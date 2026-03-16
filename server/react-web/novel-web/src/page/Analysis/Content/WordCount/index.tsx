import { useEffect, useState } from 'react';
import api from '../../../../api/index';
import Charts from '../../../../components/common/Charts';

export default function WordCountPage() {
  const [data1, setData1] = useState<any[]>([]); // 纯字数区间数据
  const [data2, setData2] = useState<any[]>([]); // 字数+状态数据
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  // 轮播顺序：接口1柱状 → 接口2柱状 → 接口1饼图 → 接口2饼图
  const chartList = [
    { type: 'barH' as const, title: '小说字数区间分布', color: '#36c361', data: data1 },
    { type: 'barH' as const, title: '字数&作品状态统计', color: '#36c361', data: data2 },
    { type: 'pie' as const, title: '小说字数占比', color: '#2f80ed', data: data1 },
    { type: 'pie' as const, title: '字数&状态占比', color: '#2f80ed', data: data2 },
  ];

  useEffect(() => {
    Promise.all([
      api.get('/echarts/content/word_count'),
      api.get('/echarts/content/word_count/status'),
    ]).then(([res1, res2]) => {
      // 接口1：严格只取 word_range，彻底剥离状态
      const d1 = res1.data!.map((item: any) => ({
        category: item.word_range,
        total_recommend: item.count,
      }));
      setData1(d1);

      // 接口2：保留状态+字数组合
      const d2 = res2.data!.map((item: any) => ({
        category: `${item.book_status} · ${item.word_range}`,
        total_recommend: item.count,
      }));
      setData2(d2);

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

      {/* 恢复为你之前的全屏尺寸：100%宽度、480px高度 */}
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

      {/* 左右切换按钮 */}
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
          fontSize: 20,
          cursor: 'pointer',
        }}
      >
        →
      </button>
    </div>
  );
}