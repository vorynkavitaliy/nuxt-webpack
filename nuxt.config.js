const imageminMozjpeg = require('imagemin-mozjpeg')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
    ...(!isDev && {
        modern: 'client',
        html: {
            minify: {
                collapseBooleanAttributes: true,
                decodeEntities: true,
                minifyCSS: true,
                minifyJS: true,
                processConditionalComments: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                trimCustomFragments: true,
                useShortDoctype: true,
            },
        },
    }),
    head: {
        htmlAttrs: {
            lang: 'ru',
        },
        title: 'Nuxt Webpack',
        meta: [{ hid: 'description', name: 'description', content: 'content' }],
        link: [{ rel: 'shortcut icon', href: 'favicon.ico' }],
    },
    rootDir: __dirname,
    router: {
        prefetchLinks: false,
    },
    loading: { color: '#ddd' },
    css: ['normalize.css', '@/assets/styles/index.sass'],
    // styleResources: {
    //     sass: ['~~/assets/styles/.sass'],
    // },
    modules: [
        'nuxt-trailingslash-module',
        'nuxt-webfontloader',
        'cookie-universal-nuxt',
        '@nuxtjs/style-resources',
    ],

    webfontloader: {
        events: false,
        google: {
            families: ['Montserrat:400,500,600:cyrillic&display=swap'],
        },
        timeout: 5000,
    },
    optimizeCss: false,
    filenames: {
        app: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash].js'),
        chunk: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash].js'),
        css: ({ isDev }) => (isDev ? '[name].css' : 'css/[contenthash].css'),
        img: ({ isDev }) =>
            isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
        font: ({ isDev }) =>
            isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
    },
    splitChunks: {
        layouts: true,
        pages: true,
        commons: true,
    },
    optimization: {
        minimize: !isDev,
    },
    plugins: [{ src: '~~/plugins/vue-lazy-load.js' }],
    buildModules: ['@nuxtjs/eslint-module', '@nuxt/postcss8'],
    transpile: ['vue-lazy-hydration', 'intersection-observer'],
    build: {
        postcss: {
            extractCSS: { ignoreOrder: true },
            plugins: {
                'postcss-import': true,
                'postcss-url': false,
                ...(!isDev && {
                    'postcss-preset-env': {
                        browsers: 'cover 99.5%',
                        autoprefixer: true,
                        stage: 0,
                    },
                }),
                'postcss-combine-media-query': true,
                'postcss-extract-media-query': {
                    stats: true,
                    extractAll: false,
                },
                'postcss-sort-media-queries': {
                    sort: 'mobile-first',
                },
            },
        },
    },

    extend(config, ctx) {
        const ORIGINAL_TEST = '/\\.(png|jpe?g|gif|svg|webp)$/i'
        const vueSvgLoader = [
            {
                loader: 'vue-svg-loader',
                options: {
                    svgo: false,
                },
            },
        ]
        const imageMinPlugin = new ImageminPlugin({
            pngquant: {
                quality: '5-30',
                speed: 7,
                strip: true,
            },
            jpegtran: {
                progressive: true,
            },
            gifsicle: {
                interlaced: true,
            },
            plugins: [
                imageminMozjpeg({
                    quality: 70,
                    progressive: true,
                }),
            ],
        })

        if (!ctx.isDev) config.plugins.push(imageMinPlugin)
        config.module.rules.forEach((rule) => {
            if (rule.test.toString() === ORIGINAL_TEST) {
                rule.test = /\.(png|jpe?g|gif|webp)$/i
                rule.use = [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name: ctx.isDev
                                ? '[path][name].[ext]'
                                : 'img/[contenthash:7].[ext]',
                        },
                    },
                ]
            }
        })

        const svgRule = {
            test: /\.svg$/,
            oneOf: [
                {
                    resourceQuery: /inline/,
                    use: vueSvgLoader,
                },
                {
                    resourceQuery: /data/,
                    loader: 'url-loader',
                },
                {
                    resourceQuery: /raw/,
                    loader: 'raw-loader',
                },
                {
                    loader: 'file-loader', // By default, always use file-loader
                },
            ],
        }
        config.module.rules.push(svgRule)
    },
}
