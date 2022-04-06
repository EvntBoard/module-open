const fs = require("fs");
const pkg = require("pkg");
const rcedit = require("rcedit");
const pkgFetch = require("pkg-fetch");

const { version } = require("../package.json");

const specificNodeVersion = "16.13.2";

const build = async () => {
  await pkgFetch.need({
    nodeRange: `node${specificNodeVersion}`,
    platform: "win",
    arch: "x64",
  });

  try {
    fs.renameSync(
      `./pkg-cache/v3.2/fetched-v${specificNodeVersion}-win-x64`,
      `./pkg-cache/v3.2/built-v${specificNodeVersion}-win-x64`
    );
  } catch (e) {}

  await rcedit(`./pkg-cache/v3.2/built-v${specificNodeVersion}-win-x64`, {
    "file-version": version,
    "product-version": version,
    "requested-execution-level": "asInvoker",
    "version-string": {
      CompanyName: "EvntBoard.io", //  "Node.js"
      ProductName: "Module Twitch", // "Node.js"
      FileDescription: "Twitch for EvntBoard", //  "Node.js: Server-side JavaScript"
      FileVersion: version, // NODE_EXE_VERSION
      ProductVersion: version, // NODE_EXE_VERSION
      OriginalFilename: "module-twitch.exe", // "node.exe"
      InternalName: "module-twitch", // "node"
      LegalCopyright: "Copyright EvntBoard.io", //  "Copyright Node.js contributors. MIT license."
    },
    icon: "./assets/favicon.ico",
  });

  let appName = `./build/win-x64/`;
  // --no-bytecode
  pkg.exec([
    ".",
    "--out-path",
    appName,
    "--compress",
    "GZip",
    "--targets",
    "node16-win-x64",
  ]);
  // }
};

build();
