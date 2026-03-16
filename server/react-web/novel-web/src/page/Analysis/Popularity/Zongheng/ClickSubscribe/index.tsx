import { useEffect, useState } from "react";
import api from "../../../../../api/index";
import Chart from "../../../../../components/common/Charts";

export default function ZonghengClickSubscribeScatter() {
  const [data, setData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/echarts/popularity/zongheng/click/subscribe")
      .then((res) => {
        // ✅ 完全按你真实数据来：[点击, 订阅]
        const scatterData = res.data.map((item: any) => [
          item.total_click,      // X轴
          item.total_recommend   // Y轴
        ]);
        setData(scatterData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>加载中...</div>;

  return (
    <div style={{ position: "relative", padding: 20 }}>
      <Chart
        type="scatter"
        data={data}
        title="纵横点击量 × 订阅量 散点图"
        width="100%"
        height={500}
      />
    </div>
  );
}