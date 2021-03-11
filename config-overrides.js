var path = require('path');
var SpritesmithPlugin = require('webpack-spritesmith');

const spritesmithWebpack = {
    module: {
        rules: [
            /*{
                test: /\.(png|json)$/,
                use: [
                    'file-loader?name=i/[hash].[ext]',
                ],
            },*/
        ]
    },
    resolve: {
        modules: ["node_modules", "spritesmith-generated"]
    },
    plugins: [
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'resources'),
                glob: 'spritesheet/*.png'
            },
            target: {
                image: path.resolve(__dirname, 'public/dist/spritesheet.png'),
                css: [
                    [
                        path.resolve(__dirname, 'public/dist/spritesheet.json'), {
                            format: 'json_texture'
                        },
                    ],
                ],
            },
            apiOptions: {
                cssImageRef: "~sprite.png"
            },
        })
    ]
    // ...
};

module.exports = function override(config, env) {
    const overrides = [
        spritesmithWebpack,
    ];

    overrides.forEach(overrider => {
        if (overrider.module && overrider.module.rules)
            config.module.rules.push(...overrider.module.rules);

        if (overrider.resolve && overrider.resolve.modules)
            config.resolve.modules.push(...overrider.resolve.modules);

        if (overrider.plugins)
            config.plugins.push(...overrider.plugins);
    });

    return config;
}
