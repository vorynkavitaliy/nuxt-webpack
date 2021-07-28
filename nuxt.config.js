const isDev = process.env.NODE_ENV !== 'production'

export default {
    env: {
        baseURL: process.env.BASE_URL,
    },
    // privateRuntimeConfig: {
    //     apiSecret: process.env.API_SECRET,
    // },
    head: {
        title: 'V.Vitaliy',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            { hid: 'description', name: 'description', content: '' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    router: {
        prefetchLinks: false,
    },
    render: {
        resourceHints: false,
    },
    cache: {
        max: 1000,
        maxAge: 900000,
    },
    css: ['normalize.css', '@/assets/styles/index.sass'],
    styleResources: {
        sass: ['@/assets/styles/ext.sass'],
    },
    webfontloader: {
        events: false,
        google: {
            families: ['Ubuntu:wght@400;500&display=swap'],
        },
        timeout: 5000,
    },
    components: true,
    modules: [
        '@nuxtjs/pwa',
        'nuxt-webfontloader',
        '@nuxtjs/style-resources',
        'cookie-universal-nuxt',
        '@/modules/svg-sprite-inject.module.js',
        [
            'nuxt-i18n',
            {
                locales: [
                    {
                        code: 'ru',
                        name: 'ru',
                        file: 'ru.json',
                        iso: 'ru-RU',
                    },
                ],
                defaultLocale: 'ru',
                detectBrowserLanguage: false,
                lazy: true,
                langDir: 'assets/locales/',
                vueI18n: {
                    fallbackLocale: 'ru',
                },
            },
        ],
        [
            'nuxt-compress',
            {
                gzip: {
                    threshold: 8192,
                },
                brotli: {
                    threshold: 8192,
                },
            },
        ],
    ],
    plugins: [
        '@/plugins/scss',
        '@/plugins/svg-sprite-extract',
        '@/plugins/ui-components',
    ],
    buildModules: ['@nuxtjs/eslint-module', '@nuxt/postcss8'],
    pwa: {
        manifest: {
            lang: 'en',
        },
    },
    build: {
        transpile: ['vue-lazy-hydration'],
        terser: {
            extractComments: {
                filename: 'LICENSES',
            },
            terserOptions: {
                warnings: false,
                compress: {
                    drop_console: true,
                    pure_funcs: ['console.log'],
                },
                output: {
                    comments: /^\**!|@preserve|@license|@cc_on/,
                },
                parallel: true,
                cache: false,
                sourceMap: isDev,
            },
        },
        splitChunks: {
            layouts: false,
            pages: true,
            commons: true,
        },
        optimizeCss: false,
        filenames: {
            app: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash].js'),
            chunk: ({ isDev }) => (isDev ? '[name].js' : 'js/[contenthash].js'),
            css: ({ isDev }) =>
                isDev ? '[name].css' : 'css/[contenthash].css',
            img: ({ isDev }) =>
                isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
            font: ({ isDev }) =>
                isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
            video: ({ isDev }) =>
                isDev ? '[path][name].[ext]' : 'videos/[contenthash:7].[ext]',
        },
        ...(!isDev && {
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
        optimization: {
            minimize: !isDev,
            moduleIds: 'hashed',
            chunkIds: 'named',
            splitChunks: {
                chunks: 'all',
                automaticNameDelimiter: '.',
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.(css|vue)$/,
                        chunks: 'all',
                        enforce: true,
                    },
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial',
                    },
                },
            },
        },
        ...(!isDev && {
            extractCSS: {
                ignoreOrder: true,
            },
        }),
        postcss: {
            plugins: {
                ...(!isDev && {
                    'postcss-url': false,
                    'postcss-preset-env': {
                        browsers: ['ie >= 8', 'last 4 version'],
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
            preset: {
                autoprefixer: {
                    grid: true,
                },
            },
        },
        extend(config, ctx) {
            if (ctx.isClient) {
                config.devtool = 'source-map'
            }
            if (ctx.isClient) {
                config.optimization.splitChunks.maxSize = 210000
            }
            const svgRule = config.module.rules.find((rule) =>
                rule.test.test('.svg'),
            )
            svgRule.test = /\.(png|jpe?g|gif|webp)$/
            config.module.rules.push({
                test: /\.svg$/,
                loader: 'raw-loader',
                options: {
                    esModule: false,
                },
            })
            config.module.rules.push({
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /(node_modules)/,
                options: {
                    fix: true,
                },
            })
        },
    },
}
