const child_process = require("child_process");
const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require('webpack-dev-server');
const electron = require("electron");
const getPort = require('get-port');
const chalk = require('chalk');
const config = require("./webpack.dev.js");

(async () => {
    // If port 9000 is available, set port to that. If not, use a random available port
    let port = await getPort({
        host: "localhost",
        port: 9000
    });

    const options = {
        host: 'localhost',
        port: port,
        hot: true,
        compress: true,
        contentBase: path.resolve(__dirname, "../dist"),
        watchContentBase: true,
        watchOptions: {
            ignored: /node_modules/
        },
        writeToDisk: true,
        quiet: true,
    }

    WebpackDevServer.addDevServerEntrypoints(config, options);
    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, options);
    let electronStarted = false;

    compiler.hooks.done.tap('done', stats => {
        if (!stats.hasErrors() && !electronStarted) {
            electronStarted = true;

            let electronProcess = child_process.execFile(electron, ["."], {
                env: { 
                    "WDS_PORT": port,
                    "NODE_ENV": "development"
                } 
            });
            electronProcess.stdout.on("data", function(data) {
                // console.log(data);
                console.log(`${chalk.blue("Electron")}: ${data}`)
              });
            electronProcess.stderr.on("data", function(data) {
                console.log(`${chalk.red("Electron")}: ${data}`)
            });      
        }
    })

    server.listen(port, 'localhost');
})()