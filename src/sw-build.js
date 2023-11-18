const workboxBuild = require("workbox-build");
// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  workboxBuild
    .injectManifest({
      swSrc: "src/sw-workbox.js", // this is your sw template file
      swDest: "dist/sw.js", // this will be created in the build step
      globDirectory: "dist/",
      globPatterns: ["**/*.{json,ico,png,jpg,htm,js,txt,css,eot,svg,woff2,ttf,woff}"],
      // maximumFileSizeToCacheInBytes: 6291456, //6mbs
      templatedURLs: {
        "index.html": ["index.html"],
      },
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    })
    .catch(console.error);
};

buildSW();
