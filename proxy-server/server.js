// server.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const { URL } = require("url");

const app = express();
app.use(cors());

app.get("/api/clean-page", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).send("Falta el parámetro URL");

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const baseUrl = new URL(url);

    // Arreglar imágenes rotas (rutas absolutas y relativas)
    $("img").each((_, img) => {
      const src = $(img).attr("src");
      if (src && !src.startsWith("http")) {
        const resolved = new URL(src, baseUrl).href;
        $(img).attr("src", resolved);
      }
    });


    // 2. Modificar los enlaces de paginación
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

    const cleanContent = $("#sp-main-body").html();
    if (!cleanContent) return res.status(404).send("No se encontró el contenido principal");

    res.send(cleanContent);
  } catch (error) {
    console.error("Error al obtener el contenido:", error);
    res.status(500).send("Error al obtener el contenido");
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor proxy activo en http://localhost:${PORT}`);
});
