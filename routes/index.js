function route(app) {
  app.use("/news", newsRouter);

  app.use("/", siteRouter);
}

module.exports = route;
