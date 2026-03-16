import React, { useMemo, useState, useEffect } from "react";
import { Space, Popover, Button, Radio } from "antd";
import type { RadioChangeEvent } from "antd/es";
import useNovelStore from "../../../store/novel";
import {
  fixedFilters,
  zonghengSpecialFilters,
  qimaoSpecialFilters,
  shuqiSpecialFilters,
  type PlatformType,
  type FilterItem,
  type FilterOption,
} from "../../../config/novelFilter";
import styles from "./index.module.css";

type FilterState = Record<string, string | number | null>;

interface DropdownPanelProps {
  options: FilterOption[];
  initialValue?: string | number | null;
  onConfirm: (val: string | number | null) => void;
}

interface FilterWrapperProps {
  onFilterChange: (queryString: string) => void;
}

const FilterWrapper: React.FC<FilterWrapperProps> = ({ onFilterChange }) => {
  const type = useNovelStore((state) => state.type) as PlatformType;
  const [filter, setFilter] = useState<FilterState>({});
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const finalFilters = useMemo<FilterItem[]>(() => {
    const getSpecialFilters = (): FilterItem[] => {
      switch (type) {
        case "zongheng":
          return zonghengSpecialFilters;
        case "qimao":
          return qimaoSpecialFilters;
        case "shuqi":
          return shuqiSpecialFilters;
        default:
          return [];
      }
    };
    return [...fixedFilters, ...getSpecialFilters()];
  }, [type]);

  // ==========================
  // 标签点击（可取消）
  // ==========================
  const handleTagClick = (key: string, value: string | number) => {
    setFilter((prev) => {
      if (prev[key] === value) {
        const n = { ...prev };
        delete n[key];
        return n;
      }
      return { ...prev, [key]: value };
    });
  };

  // ==========================
  // 下拉确认
  // ==========================
  const handleDropdownConfirm = (
    key: string,
    value: string | number | null,
  ) => {
    setFilter((prev) => {
      const n = { ...prev };
      if (value == null) {
        delete n[key];
      } else {
        n[key] = value;
      }
      return n;
    });
    setOpenPopover(null);
  };

  // ==========================
  // 筛选变化 → 抛字符串
  // ==========================
  useEffect(() => {
    const p = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v != null) p.append(k, String(v));
    });
    onFilterChange(p.toString());
  }, [filter, onFilterChange]);

  const isActive = (key: string, v: string | number) => filter[key] === v;
  const hasValue = (key: string) => filter[key] != null;

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterRow}>
        {finalFilters.map((item) => {
          if (item.type === "tag") {
            return (
              <Space key={item.key} size={8} wrap={false}>
                {item.options.map((opt) => (
                  <div
                    key={`${item.key}-${opt.value}`}
                    className={`${styles.filterTag} ${isActive(item.key, opt.value) ? styles.active : ""}`}
                    onClick={() => handleTagClick(item.key, opt.value)}
                  >
                    {opt.label}
                  </div>
                ))}
              </Space>
            );
          }

          if (item.type === "dropdown") {
            return (
              <Popover
                key={item.key}
                open={openPopover === item.key}
                onOpenChange={(op) => setOpenPopover(op ? item.key : null)}
                content={
                  <DropdownPanel
                    options={item.options}
                    initialValue={filter[item.key]}
                    onConfirm={(val) => handleDropdownConfirm(item.key, val)}
                  />
                }
                trigger="click"
              >
                <Button
                  className={`${styles.filterBtn} ${hasValue(item.key) ? styles.active : ""}`}
                >
                  {item.title}
                </Button>
              </Popover>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

// ==========================
// 下拉面板（加清空按钮）
// ==========================
const DropdownPanel: React.FC<DropdownPanelProps> = ({
  options,
  initialValue,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<string | number | null>(
    initialValue ?? null,
  );

  return (
    <div className={styles.dropdownPanel}>
      <Radio.Group
        value={selected}
        onChange={(e: RadioChangeEvent) => {
          const v = e.target.value;
          setSelected(selected === v ? null : v);
        }}
      >
        {options.map((opt) => (
          <Radio
            key={String(opt.value)}
            value={opt.value}
            style={{ display: "flex", margin: "4px 0" }}
          >
            {opt.label}
          </Radio>
        ))}
      </Radio.Group>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {/* 🔥 清空按钮 */}
        <Button
          block
          onClick={() => {
            setSelected(null);
            onConfirm(null);
          }}
        >
          清空
        </Button>

        <Button type="primary" block onClick={() => onConfirm(selected)}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default FilterWrapper;
