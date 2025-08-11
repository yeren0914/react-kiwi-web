const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        assetModuleFilename: 'media/[name][ext]',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@kasplex': path.resolve(__dirname, 'node_modules/@kasplex')
        },
        fallback: {
            "path": require.resolve("path-browserify"),
            "url": false
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.wasm$/,
                type: 'asset/inline',
                use: [{
                    loader: 'wasm-loader',
                    options: {}
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(@kasplex)\/).*/
            }
        ],
    },
    experiments: {
        asyncWebAssembly: true, // 支持 wasm
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: 'body',
            chunks: ['main']
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/@kasplex/kiwi-web/dist/kaspa_bg.wasm',
                    to: 'kaspa_bg.wasm'
                },
            ],
        }),
    ],
    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'build'),
                publicPath: '/'
            },
            {
                directory: path.join(__dirname, 'public'),
                publicPath: '/'
            },
            {
                directory: path.join(__dirname, 'node_modules/@kasplex/kiwi-web/dist'),
                publicPath: '/node_modules/@kasplex/kiwi-web/dist'
            }
        ],
    },
    ignoreWarnings: [
        {
            module: /@kasplex\/kiwi-web/,
            message: /Critical dependency: the request of a dependency is an expression/
        }
    ],
};
