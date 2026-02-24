"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";

interface AdBannerProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle";
  style?: React.CSSProperties;
}

export default function AdBanner({
  adSlot,
  adFormat = "auto",
  style,
}: AdBannerProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: object[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // 광고 로드 실패 시 무시
    }
  }, []);

  return (
    <Box sx={{ width: "100%", minHeight: 60, my: 2, textAlign: "center" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-9691519911667390"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </Box>
  );
}