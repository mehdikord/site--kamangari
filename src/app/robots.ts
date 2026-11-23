import type { MetadataRoute } from "next";
import { demo } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: demo.noIndex ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" } };
}
