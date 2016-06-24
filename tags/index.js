module.exports = function(engine){
    require("./assign.js")(engine);
    require("./capture.js")(engine);
    require("./case.js")(engine);
    require("./comment.js")(engine);
    require("./cycle.js")(engine);
    require("./decrement.js")(engine);
    require("./for.js")(engine);
    require("./if.js")(engine);
    require("./include.js")(engine);
    require("./increment.js")(engine);
    require("./layout.js")(engine);
    require("./raw.js")(engine);
    require("./tablerow.js")(engine);
    require("./unless.js")(engine);
};
