const webpack = require('webpack');
const path = require('path');
const appPath = path.join(__dirname, 'app');
const distPath = path.join(__dirname, 'dist');
const exclude = [/node_modules/];
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: appPath,
    entry: {
        app: './main.js'
    },
    output: {
        path: distPath,
        publicPath: '/',
        filename: 'bundle.[hash].js'
    },
    plugins: [
        // Generate index.html with included script tags
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './template.html',
            scriptAttributes: {
                id: 'scene'
              }
        }),
        //new InsertHtmlWebpackPlugin({
        //    filename: './template.html',
        //    custom: [{
        //       start: '<div>',
        //        end:'</div>',
        //        content: "Hello"
        //    }]
        //}),

        // Remove all files in dist before creating a production package
        new CleanWebpackPlugin()
    ],
    module: {
        noParse: [/app\/bin/],
        rules: [
            { 
                test: require.resolve('three'),
                use: ["expose", "THREE"]
            },
            {
                test: /\.jsx?$/,
                exclude: exclude,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }              
            }
        ]
    },
    devServer: {
        static: './app',
        host: "0.0.0.0",
        hot: true,
        open: true,
        port: "8080"
    },
    resolve: {
        modules: [
            path.resolve(__dirname, './app'),
            path.resolve(__dirname, "node_modules")
        ],
        fallback: {
            fs: false,
            events: false
        }
    },
    devtool: "source-map"
}