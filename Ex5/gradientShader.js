

THREE.gradientShader = {

   uniforms: {
        'tDiffuse': {type: 't',value: null},
        "uPixelSize": { type: "v2", value: new THREE.Vector2(0.1, 0.1) }
    },

    vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
           'vUv = uv;',
           'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join('\n'),

    fragmentShader: [
        'uniform sampler2D tDiffuse;',
        "uniform vec2 uPixelSize;",
        'varying vec2 vUv;',
        'void main(void) {',
            'vec4 n[9];',
            'n[0] = texture2D(tDiffuse, vUv + vec2( -uPixelSize.x, -uPixelSize.y));',
            'n[1] = texture2D(tDiffuse, vUv + vec2(0.0, -uPixelSize.y));',
            'n[2] = texture2D(tDiffuse, vUv + vec2(  uPixelSize.x, -uPixelSize.y));',
            'n[3] = texture2D(tDiffuse, vUv + vec2( -uPixelSize.x, 0.0));',
            'n[4] = texture2D(tDiffuse, vUv);',
            'n[5] = texture2D(tDiffuse, vUv + vec2(  uPixelSize.x, 0.0));',
            'n[6] = texture2D(tDiffuse, vUv + vec2( -uPixelSize.x, uPixelSize.y));',
            'n[7] = texture2D(tDiffuse, vUv + vec2(0.0, uPixelSize.y));',
            'n[8] = texture2D(tDiffuse, vUv + vec2(  uPixelSize.x, uPixelSize.y));',

            'vec4 sobel_x = n[2] + (2.0*n[5]) + n[8] - (n[0] + (2.0*n[3]) + n[6]);',
            'vec4 sobel_y = n[0] + (2.0*n[1]) + n[2] - (n[6] + (2.0*n[7]) + n[8]);',

            'vec3 sobel = sqrt((sobel_x.rgb * sobel_x.rgb) + (sobel_y.rgb * sobel_y.rgb));',
            'gl_FragColor = vec4( sobel, 1.0 );',
        '}'
    ].join('\n')

};