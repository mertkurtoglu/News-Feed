const axios = require("axios");
const User = require("../models/User");
const newsApiUrl = process.env.NEWS_API;
const worldNewsApiUrl = process.env.WORLD_NEWS_API;
const defaultCountry = process.env.DEFAULT_COUNTRY;
let response;

module.exports.getHeadlines = async (req, res) => {
  const fullUri = `${newsApiUrl}/top-headlines`;

  if (req.session.userId) {
    const user = await User.findOne({ _id: req.session.userId }); // Use await here
    var country = user.country;
  }
  let newsApiResponse, worldNewsApiResponse;

  try {
    newsApiResponse = await axios.get(fullUri, {
      params: {
        country: country ? country : defaultCountry,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    worldNewsApiResponse = await axios.get(worldNewsApiUrl, {
      params: {
        "api-key": process.env.WORLD_NEWS_API_KEY,
        "source-countries": country ? country : defaultCountry,
      },
    });

    const authors = worldNewsApiResponse.data.news
      .map((article) => {
        if (article.author) {
          return article.author.split(",").map((name) => name.trim());
        }
        return [];
      })
      .flat();

    const uniqueAuthors = Array.from(new Set(authors));

    if (newsApiResponse.data.articles.length > 0 && worldNewsApiResponse.data.news.length > 0) {
      const combinedResponse = {
        message: "Combined Articles",
        articles: [...newsApiResponse.data.articles, ...worldNewsApiResponse.data.news],
        authors: uniqueAuthors,
        user: req.session.userId,
      };

      return res.status(200).json({
        message: "Articles found",
        combinedResponse,
        user: req.session.userId,
      });
    } else {
      return res.status(404).json({ message: "No articles found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getNewsByCategory = async (req, res) => {
  const fullUri = `${newsApiUrl}/top-headlines`;
  const category = req.params.category;

  if (req.session.userId) {
    const user = await User.findOne({ _id: req.session.userId }); // Use await here
    var country = user.country;
  }

  let newsApiResponse;

  try {
    newsApiResponse = await axios.get(fullUri, {
      params: {
        country: country ? country : "us",
        category: category,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    if (newsApiResponse.data.articles.length > 0) {
      const combinedResponse = {
        articles: [...newsApiResponse.data.articles],
      };
      return res.json({
        message: "Articles found",
        combinedResponse,
      });
    } else {
      return res.status(404).json({ message: "No articles found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getNewsBySearch = async (req, res) => {
  const fullUri = `${newsApiUrl}/everything`;
  const keyword = req.query.q;

  let newsApiResponse, worldNewsApiResponse;

  try {
    newsApiResponse = await axios.get(fullUri, {
      params: {
        q: keyword,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    worldNewsApiResponse = await axios.get(worldNewsApiUrl, {
      params: {
        "api-key": process.env.WORLD_NEWS_API_KEY,
        text: keyword,
      },
    });

    if (newsApiResponse.data.articles.length > 0 && worldNewsApiResponse.data.news.length > 0) {
      const combinedResponse = {
        message: "Combined Articles",
        articles: [...newsApiResponse.data.articles, ...worldNewsApiResponse.data.news],
      };

      return res.status(200).json({
        message: "Articles found",
        combinedResponse,
      });
    } else {
      return res.status(404).json({ message: "No articles found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getSources = async (req, res) => {
  const fullUri = `${newsApiUrl}/top-headlines/sources`;

  try {
    const newsApiResponse = await axios.get(fullUri, {
      params: {
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    if (newsApiResponse.data.sources.length > 0) {
      return res.json({ sources: newsApiResponse.data.sources });
    } else {
      return res.status(404).json({ message: "No sources found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.filterResults = async (req, res) => {
  const fullUri = `${newsApiUrl}/top-headlines`;
  const filterData = req.body.filter;
  const country = filterData.countryRef.current;
  const sources = filterData.sourceRef.current;
  const category = filterData.categoryRef.current;
  const author = filterData.authorRef.current;

  //Country Filter
  try {
    if (country && country !== "undefined" && country !== null) {
      let newsApiResponse, worldNewsApiResponse;

      newsApiResponse = await axios.get(fullUri, {
        params: {
          country: country,
          category: category || " ",
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      worldNewsApiResponse = await axios.get(worldNewsApiUrl, {
        params: {
          "api-key": process.env.WORLD_NEWS_API_KEY,
          "source-countries": country,
        },
      });

      if (newsApiResponse.data.articles.length > 0 && worldNewsApiResponse.data.news.length > 0) {
        const combinedResponse = {
          message: "Combined Articles",
          articles: [...newsApiResponse.data.articles, ...worldNewsApiResponse.data.news],
        };

        return res.status(200).json({
          message: "Articles found",
          combinedResponse,
        });
      }
    }

    //Source Filter
    if (sources && sources !== "undefined" && sources !== null) {
      const newsApiResponse = await axios.get(fullUri, {
        params: {
          sources: sources,
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      if (newsApiResponse.data.articles.length > 0) {
        const combinedResponse = {
          articles: [...newsApiResponse.data.articles],
        };

        return res.json({
          message: "Articles found",
          combinedResponse,
        });
      }
    }

    //Author Filter
    if (author && author !== "undefined" && author !== null) {
      const worldNewsApiResponse = await axios.get(worldNewsApiUrl, {
        params: {
          "api-key": process.env.WORLD_NEWS_API_KEY,
          authors: author,
        },
      });

      if (worldNewsApiResponse.data.news.length > 0) {
        const combinedResponse = {
          articles: [...worldNewsApiResponse.data.news],
        };

        return res.status(200).json({
          message: "Articles Found",
          combinedResponse,
        });
      }
    }

    return res.status(404).json({ message: "No articles found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
