const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const { URL } = require("url");

const app = express();
app.use(cors());

// Scraping limpio para uso general
app.get("/api/clean-page", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Falta el parámetro URL");

  console.log("🌐 clean-page solicitando:", url);

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html",
      },
    });

    const $ = cheerio.load(response.data);
    const baseUrl = new URL(url);

    // URLs que deben forzar iframe
    const urlsConIframe = [
      "https://www.unraf.edu.ar/cursos-diplomaturas-2/3541-noti3423",
    ];
    if (urlsConIframe.includes(url)) {
      console.log("🧩 URL marcada como 'requiere iframe'.");
      return res.status(204).send();
    }

    // Reparar imágenes
    $("img").each((_, img) => {
      const src = $(img).attr("src");
      if (src && !src.startsWith("http")) {
        const resolved = new URL(src, baseUrl).href;
        $(img).attr("src", resolved);
      }
    });

    // Reparar enlaces
    $("a").each((_, link) => {
      const href = $(link).attr("href");
      if (href && href.startsWith("/")) {
        const newUrl = `${baseUrl.origin}${href}`;
        $(link).attr("href", `/ver-limpio?url=${encodeURIComponent(newUrl)}`);
      } else if (href && href.startsWith("index.php")) {
        const newUrl = `${baseUrl.origin}/${href}`;
        $(link).attr("href", `/ver-limpio?url=${encodeURIComponent(newUrl)}`);
      }
    });

    const cleanContent =
      $("#sp-main-body").html() ||
      $("main").html() ||
      $("body").html();

    if (!cleanContent) {
      console.log("❌ No se encontró contenido útil, se usará iframe.");
      return res.status(204).send();
    }

    console.log("✅ Contenido procesado, enviando al frontend.");
    res.send(cleanContent);
  } catch (error) {
    console.error("❌ Error al obtener el contenido:", error.message);
    res.status(500).send("Error al obtener el contenido");
  }
});

// Proxy visual limpio para iframes
app.get("/api/clean-frame", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Falta el parámetro URL");

  console.log("🧼 clean-frame solicitando:", url);

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html",
      },
    });

    const $ = cheerio.load(response.data);

    // Eliminar encabezado, pie y elementos molestos
    $("#sp-header, #sp-footer, header, footer, nav, .footer, .navbar, .sticky-wrapper").remove();

    // Ajustes de estilo para cuerpo
    $("body").attr("style", "margin:0;padding:0;overflow:auto;");
    $("html").attr("style", "margin:0;padding:0;overflow:auto;");

    res.send($.html());
  } catch (error) {
    console.error("❌ Error en clean-frame:", error.message);
    res.status(500).send("Error al procesar clean-frame");
  }
});

// 🔚 Escuchar al final
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy activo en http://localhost:${PORT}`);
});
