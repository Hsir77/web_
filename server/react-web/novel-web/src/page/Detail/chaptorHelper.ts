export type VolumeItem = {
  type: 'volume'
  volumeId: number | string
  volumeName: string
  totalChapterNum: number
  totalWords: number
}

export type ChapterItem = {
  type: 'chapter'
  chapterId: number | string
  title: string
  wordCount: number
  price?: number
  isFree: boolean
  url: string
}

export type CatalogItem = VolumeItem | ChapterItem

export function normalizeChapterList(
  rawCatalog: any[],
  source: string,
  bookId: string | number
): CatalogItem[] {
  if (!rawCatalog || !Array.isArray(rawCatalog)) {
    return []
  }

  const list: CatalogItem[] = []

  if (source === 'zongheng') {
    rawCatalog.forEach(item => {
      const tome = item.tome || {}
      list.push({
        type: 'volume',
        volumeId: tome.tomeId,
        volumeName: tome.tomeName,
        totalChapterNum: item.tomeTotalChapterNum || 0,
        totalWords: item.tomeTotalWords || 0
      })

      const chapters = item.chapterViewList || []
      chapters.forEach((chap: { chapterId: any; chapterName: any; wordNums: any; price: number }) => {
        list.push({
          type: 'chapter',
          chapterId: chap.chapterId,
          title: chap.chapterName,
          wordCount: chap.wordNums || 0,
          price: chap.price || 0,
          isFree: chap.price === 0,
          url: `https://www.zongheng.com/chapter/${bookId}/${chap.chapterId}.html`
        })
      })
    })
  }

  if (source === 'qimao') {
    list.push({
      type: 'volume',
      volumeId: 'qimao_default',
      volumeName: '正文',
      totalChapterNum: rawCatalog.length,
      totalWords: rawCatalog.reduce((sum, c) => sum + (Number(c.words) || 0), 0)
    })

    rawCatalog.forEach(chap => {
      list.push({
        type: 'chapter',
        chapterId: chap.id,
        title: chap.title,
        wordCount: Number(chap.words) || 0,
        isFree: chap.is_vip === '0',
        url: `https://www.qimao.com/shuku/${bookId}-${chap.id}/`
      })
    })
  }

  if (source === 'shuqi') {
    rawCatalog.forEach((volume, volIdx) => {
      const chapters = volume.chapter_catalog || []
      if (chapters.length === 0) return

      list.push({
        type: 'volume',
        volumeId: `shuqi_vol_${volIdx}`,
        volumeName: volume.volumeName || `第${volIdx + 1}卷`,
        totalChapterNum: chapters.length,
        totalWords: 0
      })

      chapters.forEach((chap: { index: any; name: any; url: any }) => {
        list.push({
          type: 'chapter',
          chapterId: chap.index || chap.name,
          title: chap.name || `第${chap.index}章`,
          wordCount: 0,
          isFree: true,
          url: chap.url || ''
        })
      })
    })
  }

  return list
}