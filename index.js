const koa = require("koa");
const path = require("path");
const render = require("koa-ejs");
const koaRouter = require("koa-router");
const axios = require("axios");
const Logger = require("koa-logger");

const app = new koa();
const router = new koaRouter();

app.use(Logger())
    .use(router.routes())
    .use(router.allowedMethods());

render(app, {
    root: path.join(__dirname, "views"),
    layout: "index",
    viewExt: "html",
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error(err);
        ctx.body = "Ops, something wrong happened:<br>" + err.message;
    }
});

router.get("hello", "/", (ctx) => {
    ctx.body = "<h1>Hello World, Koa folks!</h1>";
});

router.get("users", "/users", async (ctx) => {
    const result = await axios.get("https://randomuser.me/api?results=5");

    // invalid URL to cause error
    // const result = await axios.get("https://randomuser.meep/api?results=5");

    return ctx.render("index", {
        users: result.data.results,
    });
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`running on port ${PORT}`));