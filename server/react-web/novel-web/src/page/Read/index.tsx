import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useNovelStore from "../../store/novel";
import { addToBookshelf, removeFromBookshelf } from "../../api/novel";
import { normalizeChapterList } from "../Detail/chaptorHelper";
import styles from "./index.module.css";

const Read = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { source, book_id, user_id, is_collect } = location.state || {};
  const [isCollect, setIsCollect] = useState(is_collect);

  const chapterList = useNovelStore((state) => state.chapterList) as any;

  const url = chapterList?.url;
  const rawCatalog = chapterList?.chapter_catalog;

  const catalogList = normalizeChapterList(rawCatalog, source, book_id) || [];

  const c1 = chapterList?.chapter1_content || "";
  const c2 = chapterList?.chapter2_content || "";
  const c3 = chapterList?.chapter3_content || "";
  const noContent = !c1 && !c2 && !c3;
  console.log('read-noContent',noContent)
  const [showCatalog, setShowCatalog] = useState(false);

  const [openVolumes, setOpenVolumes] = useState<Record<string, boolean>>({});

  /** 把 catalogList 转换为卷结构 */
  const volumes: any[] = [];
  let currentVolume: any = null;

  catalogList.forEach((item: any) => {
    if (item.type === "volume") {
      currentVolume = {
        title: item.volumeName,
        volumeId: item.volumeId,
        chapters: [],
      };
      volumes.push(currentVolume);
    } else if (item.type === "chapter" && currentVolume) {
      currentVolume.chapters.push(item);
    }
  });

  return (
    <div className={styles.readPage}>
      {/* 顶部按钮 */}
      <div className={styles.readHeader}>
        <button
          className={styles.headerBtn}
          onClick={async () => {
            if (!user_id || !book_id || !source) {
              alert("信息异常");
              return;
            }

            try {
              if (isCollect) {
                await removeFromBookshelf(Number(user_id), book_id, source);
                setIsCollect(0);
                alert("已移出书架");
              } else {
                await addToBookshelf(Number(user_id), book_id, source);
                setIsCollect(1);
                alert("已加入书架");
              }
            } catch (err) {
              alert("操作失败");
              console.log(err);
            }
          }}
        >
          {isCollect ? "移出书架" : "加入书架"}
        </button>

        <button
          className={styles.headerBtn}
          onClick={() => window.open(url, "_blank")}
        >
          正版跳转
        </button>

        <button
          className={styles.headerBtn}
          onClick={() => setShowCatalog(true)}
        >
          目录
        </button>

        <button className={styles.headerBtn} onClick={() => navigate(-1)}>
          返回
        </button>
      </div>

      {/* 目录弹窗 */}
      {showCatalog && (
        <div className={styles.catalogOverlay}>
          <div className={styles.catalogCard}>
            <div className={styles.catalogHeader}>
              <h3>章节目录</h3>
              <button onClick={() => setShowCatalog(false)}>关闭</button>
            </div>

            <div className={styles.catalogList}>
              {volumes.map((volume) => {
                const open = openVolumes[volume.volumeId];

                return (
                  <div key={volume.volumeId} className={styles.volumeBlock}>
                    <div
                      className={styles.volumeTitle}
                      onClick={() =>
                        setOpenVolumes((prev) => ({
                          ...prev,
                          [volume.volumeId]: !prev[volume.volumeId],
                        }))
                      }
                    >
                      {volume.title}

                      <span className={styles.volumeArrow}>
                        {open ? "▼" : "▶"}
                      </span>
                    </div>

                    {open && (
                      <div className={styles.chapterList}>
                        {volume.chapters.map((ch: any) => (
                          <div
                            key={ch.chapterId}
                            className={styles.catalogItem}
                            onClick={() => {
                              window.open(ch.url, "_blank");
                            }}
                          >
                            {ch.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 阅读内容 */}
      {!noContent ? (
        <div className={styles.bookContainer}>
          <div className={styles.contentBody}>
            <div className={styles.tipsParagraph}>
              本项目仅用于毕业设计学习演示，仅限前三章试读，不存储版权内容，
              正版全文请在目录页跳转官方平台，如有侵权请联系删除。
            </div>

            <div className={styles.chapterBlock}>
              <h2 className={styles.sectionTitle}>第一章</h2>
              <div className={styles.divider}></div>

              {c1.split("\n").map((line: string, idx: number) => (
                <p key={idx} className={styles.p}>
                  {line}
                </p>
              ))}
            </div>

            <div className={styles.chapterBlock}>
              <h2 className={styles.sectionTitle}>第二章</h2>
              <div className={styles.divider}></div>

              {c2.split("\n").map((line: string, idx: number) => (
                <p key={idx} className={styles.p}>
                  {line}
                </p>
              ))}
            </div>

            <div className={styles.chapterBlock}>
              <h2 className={styles.sectionTitle}>第三章</h2>
              <div className={styles.divider}></div>

              {c3.split("\n").map((line: string, idx: number) => (
                <p key={idx} className={styles.p}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
         <div className={styles.emptyBox}>
        当前小说暂无试读内容
        <br />
        请点击右侧 <b>“正版跳转”</b> 按钮
        <br />
        前往正版官网阅读
      </div></>
      )}
    </div>
  );
};

export default Read;
