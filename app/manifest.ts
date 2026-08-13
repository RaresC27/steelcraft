import type {
  MetadataRoute,
} from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:
      "SteelCraft - Confecții metalice",

    short_name: "SteelCraft",

    description:
      "Hrănitoare, adăpători și confecții metalice realizate la comandă.",

    start_url: "/",

    display: "standalone",

    background_color: "#111111",

    theme_color: "#111111",

    lang: "ro",

    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}