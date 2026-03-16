import { useEffect, useState } from 'react';
import api from '../../../../api/index';
import Charts from '../../../../components/common/Charts';

type ChartType = 'scatter' | 'barH' | 'pie';

interface ChartItem {
  type: ChartType;
  title: string;
  color: string;
  data: any[];
  scatterXName?: string;
  scatterYName?: string;
}

export default function ContentChapter() {
  const [scatterData, setScatterData] = useState<any[]>([]);
  const [avgData, setAvgData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const chartList: ChartItem[] = [
    {
      type: 'scatter',
      title: '总字数 × 总章节 散点分布图',
      color: '#36c361',
      data: scatterData,
      scatterXName: '章节数',
      scatterYName: '字数',
    },
    {
      type: 'barH',
      title: '平均单章字数统计',
      color: '#36c361',
      data: avgData,
    },
    {
      type: 'pie',
      title: '平均单章字数占比',
      color: '#2f80ed',
      data: avgData,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          api.get('/echarts/content/chaptor/word_count'),
          api.get('/echarts/content/chaptor/average'),
        ]);

        // 🔥🔥🔥 就改这两行！！！
        const data1 = res1?.data || [];
        const data2 = res2?.data || [];

        const scatterData = data1.map((item: any) => [
          item.chapter_count,
          item.word_count,
        ]);

        const avgData = data2.map((item: any) => ({
          category: item.avg_range,
          total_recommend: item.count,
        }));

        setScatterData(scatterData);
        setAvgData(avgData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const prev = () => setIndex((i) => (i - 1 + chartList.length) % chartList.length);
  const next = () => setIndex((i) => (i + 1) % chartList.length);

  if (loading) return <div style={{ padding: 40 }}>加载中...</div>;

  const current = chartList[index];

  return (
    <div
      style={{
        position: 'relative',
        padding: '20px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
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
          scatterXName={current.scatterXName}
          scatterYName={current.scatterYName}
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