import { useEffect, useState } from 'react';
import api from '../../../../../api/index';
import Charts from '../../../../../components/common/Charts';

export default function QimaoReadScoreScatter() {
  const [data, setData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/echarts/popularity/qimao/read_count/score')
      .then((res) => {
        const list = res?.data || [];
        
        // 只保留 9～10 分的数据
        const scatterData = list
          .filter((item: any) => item.score >= 9)
          .map((item: any) => [item.read_count, item.score]);
        
        setData(scatterData);
      })
      .catch((err) => console.error('加载失败:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Charts
        type="scatter"
        data={data}
        title="阅读数 × 评分 散点图（9~10分）"
        width="100%"
        height={500}
        color="#ff7337"
        scatterXName="阅读数"
        scatterYName="评分"
        // 🔥 强制 Y 轴从 9 到 10
        yAxisMin={9}
        yAxisMax={10}
      />
    </div>
  );
}