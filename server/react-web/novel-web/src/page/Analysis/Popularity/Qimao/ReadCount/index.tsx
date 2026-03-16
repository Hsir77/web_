import { useEffect, useState } from "react";
import api from "../../../../../api/index";
import Charts from "../../../../../components/common/Charts";

type ChartType = "bar" | "pie";

interface ChartItem {
  type: ChartType;
  title: string;
  color: string;
  data: any[];
}

export default function QimaoCategoryReadCount() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const chartList: ChartItem[] = [
    {
      type: "bar",
      title: "七猫各分类阅读数",
      color: "#2f80ed",
      data: data,
    },
    {
      type: "pie",
      title: "七猫分类阅读数占比",
      color: "#2f80ed",
      data: data,
    },
  ];

  useEffect(() => {
    api
      .get("/echarts/popularity/qimao/category/read_count")
      .then((res) => {
        const list = res.data || [];
        const chartData = list.map((item: any) => ({
          category: item.category,
          total_recommend: item.read_count,
        }));
        setData(chartData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const prev = () =>
    setIndex((i) => (i - 1 + chartList.length) % chartList.length);
  const next = () => setIndex((i) => (i + 1) % chartList.length);

  if (loading) return <div style={{ padding: 40 }}>加载中...</div>;
  const current = chartList[index];

  return (
    <div
      style={{
        position: "relative",
        padding: "20px 30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: "0 0 20px 0", fontSize: 18 }}>{current.title}</h2>
      <div style={{ width: "100%" }}>
        <Charts
        key={index}
          type={current.type}
          data={current.data}
          width="100%"
          height={480}
          color={current.color}
        />
      </div>

      <button
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          width: 40,
          height: 100,
          border: "none",
          borderRadius: "0 6px 6px 0",
          background: "rgba(150,150,150,0.2)",
          fontSize: 20,
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
          right: 0,
          transform: "translateY(-50%)",
          width: 40,
          height: 100,
          border: "none",
          borderRadius: "6px 0 0 6px",
          background: "rgba(150,150,150,0.2)",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        →
      </button>
    </div>
  );
}
