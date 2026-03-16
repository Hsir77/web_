import { useEffect, useState } from 'react';
import api from '../../../../../api/index';
import Charts from '../../../../../components/common/Charts';

export default function ShuqiCategoryPopularity() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/echarts/popularity/shuqi/category/popularity_value')
      .then((res) => {
        const list = res.data || [];
        
        // ✅ 只保留 人气 >= 500万 的数据
        const chartData = list
          .filter((item: any) => item.popularity >= 5000000)
          .map((item: any) => ({
            category: item.category,
            total_recommend: item.popularity,
          }));
          
        setData(chartData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>加载中...</div>;

  return (
    <div style={{ padding: '20px 30px' }}>
      <Charts
        type="bar"
        data={data}
        title="书旗各分类人气值（≥500万）"
        width="100%"
        height={480}
        color="#2f80ed"
      />
    </div>
  );
}