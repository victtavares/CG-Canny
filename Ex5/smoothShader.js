/**
Aplica um filtro de suavização 3x3 em uma imagem. 
A "dimensão" do pixel é dada por uPixelSize
 */

THREE.smoothShader = {

  uniforms: {

    "tDiffuse": { type: "t", value: null },
    "uPixelSize": { type: "v2", value: new THREE.Vector2(0.1, 0.1) }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D tDiffuse;",
    "uniform vec2 uPixelSize;",

    "varying vec2 vUv;",

    "void main() {",
      'vec4 n[25];',
      'n[0] = texture2D(tDiffuse, vUv + vec2( -2.0*uPixelSize.x, -2.0*uPixelSize.y));',
      'n[1] = texture2D(tDiffuse, vUv + vec2(-uPixelSize.x, -2.0*uPixelSize.y));',
      'n[2] = texture2D(tDiffuse, vUv + vec2(  0.0, -2.0*uPixelSize.y));',
      'n[3] = texture2D(tDiffuse, vUv + vec2( uPixelSize.x, -2.0*uPixelSize.y));',
      'n[4] = texture2D(tDiffuse, vUv + vec2( 2.0*uPixelSize.x, -2.0*uPixelSize.y));', //Aqui acaba a primeira linha

      'n[5] = texture2D(tDiffuse, vUv + vec2( -2.0*uPixelSize.x, -uPixelSize.y));',
      'n[6] = texture2D(tDiffuse, vUv + vec2(-uPixelSize.x, -uPixelSize.y));',
      'n[7] = texture2D(tDiffuse, vUv + vec2( 0.0, -uPixelSize.y));',
      'n[8] = texture2D(tDiffuse, vUv + vec2( uPixelSize.x, -uPixelSize.y));',
      'n[9] = texture2D(tDiffuse, vUv + vec2( 2.0*uPixelSize.x, -uPixelSize.y));', //Aqui acaba a segunda linha

      'n[10] = texture2D(tDiffuse, vUv + vec2( -2.0*uPixelSize.x, 0.0));',
      'n[11] = texture2D(tDiffuse, vUv + vec2(-uPixelSize.x, 0.0));',
      'n[12] = texture2D(tDiffuse, vUv);',
      'n[13] = texture2D(tDiffuse, vUv + vec2( uPixelSize.x, 0.0));',
      'n[14] = texture2D(tDiffuse, vUv + vec2( 2.0*uPixelSize.x, 0.0));', //Aqui acaba a terceira linha

      'n[15] = texture2D(tDiffuse, vUv + vec2( -2.0*uPixelSize.x, uPixelSize.y));',
      'n[16] = texture2D(tDiffuse, vUv + vec2(-uPixelSize.x, uPixelSize.y));',
      'n[17] = texture2D(tDiffuse, vUv + vec2(0.0, uPixelSize.y));',
      'n[18] = texture2D(tDiffuse, vUv + vec2( uPixelSize.x, uPixelSize.y));',
      'n[19] = texture2D(tDiffuse, vUv + vec2( 2.0*uPixelSize.x, uPixelSize.y));', //Aqui acaba a 4 linha

      'n[20] = texture2D(tDiffuse, vUv + vec2( -2.0*uPixelSize.x, 2.0*uPixelSize.y));',
      'n[21] = texture2D(tDiffuse, vUv + vec2(-uPixelSize.x, 2.0*uPixelSize.y));',
      'n[22] = texture2D(tDiffuse, vUv + vec2(0.0, 2.0*uPixelSize.y));',
      'n[23] = texture2D(tDiffuse, vUv + vec2( uPixelSize.x, 2.0*uPixelSize.y));',
      'n[24] = texture2D(tDiffuse, vUv + vec2( 2.0*uPixelSize.x, 2.0*uPixelSize.y));', //Aqui acaba a 5 linha


      //linha1 + linha2 + linha3 + linha4 + linha5 
      "vec4 c = vec4((",
      "( (2.0*n[0]) + (4.0*n[1]) + (5.0*n[2]) + (4.0*n[3]) + (2.0*n[4]) )", //2 4 5 4 2
      " + ( (4.0*n[5]) + (9.0*n[6]) + (12.0*n[7]) + (9.0*n[8]) + (4.0*n[9]) )", //4 9 12 9 4
      " + ( (5.0*n[10]) + (12.0*n[11]) + (15.0*n[12]) + (12.0*n[13]) + (5.0*n[14]) )", //5 12 15 12 5
      " + ( (4.0*n[15]) + (9.0*n[16]) + (12.0*n[17]) + (9.0*n[18]) + (4.0*n[19]) )", //4 9 12 9 4
      " + ( (2.0*n[20]) + (4.0*n[21]) + (5.0*n[22]) + (4.0*n[23]) + (2.0*n[24]) )", //2 4 5 4 2
      ")/159.0);", // close vector and equation

      "gl_FragColor = c;",

    "}"
  ].join("\n")
};