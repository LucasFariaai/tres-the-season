import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ContentMap = Record<string, string | null>;

const cmsSupabase = supabase as any;

export function useSiteContent(section: string): ContentMap {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await cmsSupabase.from("site_content").select("key, value").eq("section", section);
      if (!mounted || !data) return;

      const map: ContentMap = {};
      data.forEach((row: { key: string; value: string | null }) => {
        map[row.key] = row.value;
      });
      setContent(map);
    };

    load();

    const channel = cmsSupabase
      .channel(`site-content-${section}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: `section=eq.${section}` },
        load,
      )
      .subscribe();

    return () => {
      mounted = false;
      cmsSupabase.removeChannel(channel);
    };
  }, [section]);

  return content;
}
