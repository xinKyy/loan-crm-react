/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const path = require('path');
const withLess = require('next-with-less');
const withTM = require('next-transpile-modules')([
  '@arco-design/web-react',
  '@arco-themes/react-arco-pro',
]);

const setting = require('./src/settings.json');

module.exports = withLess(
  withTM({
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: {
          'arcoblue-6': setting.themeColor,
        },
      },
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      config.resolve.alias['@/assets'] = path.resolve(
        __dirname,
        './src/public/assets'
      );
      config.resolve.alias['@'] = path.resolve(__dirname, './src');

      return config;
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/dashboard/workplace',
          permanent: true,
        },
      ];
    },
    basePath: '',
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          // destination: 'http://45.159.209.53:8090/:path*', // 实际API的基本URL
          // destination: 'http://8.136.233.221:8090/:path*', // 实际API的基本URL
          destination: 'http://192.168.1.16:8081/:path*', // 实际API的基本URL
          // destination: 'http://192.168.2.236:9292/:path*', // 实际API的基本URL
        },
      ];
    },
    pageExtensions: ['tsx'],
  })
);
