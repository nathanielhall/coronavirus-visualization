import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

const APP_PATH = path.resolve(__dirname, 'src')

const config: Configuration = {
  entry: APP_PATH,

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },

  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      components: path.resolve(__dirname, './src/components/'),
      src: path.resolve(__dirname, './src/')
    }
  },

  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        exclude: [
          /dist/,
          /node_modules/,
          /\\.test\\.tsx?$/,
          /__tests__/,
          /typings/
        ],
        use: [{ loader: 'ts-loader' }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      favicon: './src/assets/favicon.ico',
      template: path.join(__dirname, './src/index.html')
    })
  ]
}

// eslint-disable-next-line import/no-default-export
export default config
