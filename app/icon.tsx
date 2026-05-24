import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#000",
          border: "1px solid #555",
          color: "#fff",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 18,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        $
      </div>
    ),
    size,
  );
}
