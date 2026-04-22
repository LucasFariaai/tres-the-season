import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type ContentMap = Record<string, string | null>

export function useSiteContent(section: string): ContentMap {
  const [content, setContent] = useState<ContentMap>({})

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .eq('section', section)
      .then(({ data }) => {
        if (!data) return
        const map: ContentMap = {}
        data.forEach((row) => {
          map[row.key] = row.value
        })
        setContent(map)
      })
  }, [section])

  return content
}
