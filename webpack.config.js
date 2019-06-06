const path = require('path');

module.exports = {
    entry: [
        './src/ve2.js',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 've2.js',
        libraryTarget: 'umd',
        globalObject: 'this',
        library: 've2',        
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src')],
                exclude: /node_modules/,
                query: {
                    presets: ['@babel/env']
                }
            }
        ]
    }
};
