// Relais des pages de partage des sorties RandoSpot (Cloudflare Pages).
// randospot.mdconseil59.fr/e/<id>      -> page de la sortie
// randospot.mdconseil59.fr/e/<id>.png  -> image de la sortie
// Tout le contenu est fabriqué par la fonction "share" de Supabase ; ce fichier ne
// fait que le transmettre avec le bon type, pour que Facebook sache le lire.
const UPSTREAM = "https://pynsbltnxiivwetngkvt.supabase.co/functions/v1/share/e/";

export async function onRequestGet({ params }) {
  const path = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (!/^[0-9a-zA-Z-]{1,60}(\.png)?$/.test(path)) {
    return new Response("Page introuvable", { status: 404 });
  }
  const isImage = path.endsWith(".png");
  let upstream;
  try {
    upstream = await fetch(UPSTREAM + path);
  } catch {
    return new Response("Service momentanément indisponible", { status: 502 });
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": isImage ? "image/png" : "text/html; charset=utf-8",
      "Cache-Control": upstream.headers.get("Cache-Control") || "public, max-age=300",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
