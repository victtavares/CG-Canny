THREE.thresholdingShader = {

   uniforms: {
        'tDiffuse': {type: 't',value: null},
        "uPixelSize": { type: "v2", value: new THREE.Vector2(0.1, 0.1) },
        highThreshold: {type: 'f',value: 0.8},
        lowThreshold : {type: 'f',value: 0.2}
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
        "uniform float highThreshold;",
        "uniform float lowThreshold;",
        'varying vec2 vUv;',

        'void main(void) {',
            'vec4 color = texture2D(tDiffuse, vUv);',
            'vec3 colorRGB = color.rgb;',
            'if (colorRGB.r > highThreshold) { gl_FragColor = vec4( 1.0, 1.0, 1.0, color.a ); } ',
            'else if ((colorRGB.r >= lowThreshold) &&  (colorRGB.r <=  highThreshold)) {gl_FragColor = vec4( 0.5, 0.5, 0.5, color.a ); }',
            'else { gl_FragColor = vec4( 0.0, 0.0, 0.0, color.a ); }',

        '}'
    ].join('\n')

};