import { merge } from 'webpack-merge'
import { common } from './webpack.common'
import { Configuration } from 'webpack'

const dev: Configuration = {
  mode: 'development',
  //   devtool: 'inline-source-map',
  devtool: 'source-map'
}

const config: Configuration = merge(common, dev)

export default config
