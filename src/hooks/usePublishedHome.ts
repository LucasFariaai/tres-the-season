import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultHomeCmsContent, defaultSiteTheme } from "@/lib/site-editor/defaults";
import { siteContentRowsToSnapshot, tokenRowsToTheme } from "@/lib/site-editor/mapper";
import type { HomeCmsContent, SiteThemeTokens } from "@/lib/site-editor/types";

interface PublishedHomeState {
  content: HomeCmsContent;
  theme: SiteThemeTokens;
  loading: boolean;
}

export function usePublishedHome(): PublishedHomeState {
  const [state, setState] = useState<PublishedHomeState>({
    content: defaultHomeCmsContent,
    theme: defaultSiteTheme,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [{ data: contentRows }, { data: themeRows }] = await Promise.all([
        supabase.from("site_content").select("section,key,value").eq("key", "payload"),
        supabase.from("site_theme_tokens").select("section,token,value").eq("environment", "published"),
      ]);

      if (!mounted) return;

      setState({
        content: contentRows && contentRows.length ? siteContentRowsToSnapshot(contentRows) : defaultHomeCmsContent,
        theme: themeRows && themeRows.length ? tokenRowsToTheme(themeRows) : defaultSiteTheme,
        loading: false,
      });
    };

    void load();

    const uid = Math.random().toString(36).slice(2);
    const contentChannel = supabase
      .channel(`published-home-content-${uid}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content", filter: "key=eq.payload" }, () => void load())
      .subscribe();

    const themeChannel = supabase
      .channel(`published-home-theme-${uid}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_theme_tokens", filter: "environment=eq.published" },
        () => void load(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(contentChannel);
      supabase.removeChannel(themeChannel);
    };
  }, []);

  return state;
}
