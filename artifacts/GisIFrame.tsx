import React from "react";

type Props = {
  src?: string;           // ex) "http://host.docker.internal:8787/ui.html?src=/geo/sample"
  height?: string | number;
};

export default function GisIFrame({
  src = "http://host.docker.internal:8787/ui.html?src=/geo/sample",
  height = "60vh",
}: Props) {
  // \uB9AC\uB205\uC2A4 \uD638\uC2A4\uD2B8 \uB300\uC548: http://172.17.0.1:8787/ui.html
  return (
    <div style={{ width: "100%", height, borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <iframe
        src={src}
        title="GIS"
        style={{ width: "100%", height: "100%", border: "0" }}
        allow="geolocation *; clipboard-read; clipboard-write"
      />
    </div>
  );
}
