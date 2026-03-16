import { useEffect, useState } from "react";
import api from "../../../../../api/index";
import Chart, { ChartItem } from "../../../../../components/common/Charts";

export default function ZonghengTop10ClickSubscribe() {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/echarts/ranking/zongheng/top10/click_subscribe")
      .then((res) => {
        // ✅ 完全匹配你给的数据
        const list = res.data.map((item: any) => ({
          category: item.book_name,    // 书名
          total_recommend: item.total_recommend,  // 数值
        }));
        setData(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>加载中...</div>;

  return (
    <div style={{ position: "relative", padding: 20 }}>
      <Chart
        type="barH"
        data={data}
        title="纵横总订阅 TOP10"
        width="100%"
        height={500}
      />
    </div>
  );
}