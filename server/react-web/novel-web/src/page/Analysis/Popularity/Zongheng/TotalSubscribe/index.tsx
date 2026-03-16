import { useEffect, useState } from "react";
import api from "../../../../../api/index";
import Chart, { ChartItem } from "../../../../../components/common/Charts";

export default function ZonghengCategoryTotalSubscribe() {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const chartList = [
    { type: "bar" as const, title: "纵横分类总订阅" },
    { type: "pie" as const, title: "纵横分类总订阅占比" },
  ];

  useEffect(() => {
    api.get("/echarts/popularity/zongheng/category/total/subscribe")
      .then((res) => {
        const list = res.data.map((item: any) => ({
          category: item.category,
          total_recommend: item.total_recommend,
        }));
        setData(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const prev = () => setIndex((i) => (i - 1 + chartList.length) % chartList.length);
  const next = () => setIndex((i) => (i + 1) % chartList.length);

  if (loading) return <div style={{ padding: 40 }}>加载中...</div>;

  const current = chartList[index];

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>{current.title}</h2>
      <Chart key={index} type={current.type} data={data} width="100%" height={500} />

      <button
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          width: "44px",
          height: "80px",
          border: "none",
          borderRadius: "4px",
          background: "#eee",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ←
      </button>
      <button
        onClick={next}
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          width: "44px",
          height: "80px",
          border: "none",
          borderRadius: "4px",
          background: "#eee",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        →
      </button>
    </div>
  );
}