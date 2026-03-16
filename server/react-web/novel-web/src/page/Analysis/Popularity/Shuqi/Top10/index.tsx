import { useEffect, useState } from 'react';
import api from '../../../../../api/index';
import Charts from '../../../../../components/common/Charts';

export default function QimaoTop10Popularity() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ 正确接口路径
    api.get('/echarts/ranking/shuqi/top10/category_popularity')
      .then((res) => {
        // ✅ 正确字段：book_name + popularity
        const list = res.data || [];
        const chartData = list.map((item: any) => ({
          category: item.book_name,
          total_recommend: item.popularity,
        }));
        setData(chartData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>加载中...</div>;

  return (
    <div style={{ padding: 20 }}>
      <Charts
        type="barH"
        data={data}
        title="七猫人气值 Top10"
        width="100%"
        height={500}
        color="#36c361"
      />
    </div>
  );
}