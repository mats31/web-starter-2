precision highp float;

uniform sampler2D t_diffuse;
uniform vec2 u_resolution;
uniform vec2 u_direction;
uniform float u_radius;

varying vec2 vUv;

/*void main( void ) {

    // float factor = u_factor;
    float factor = 0.89;

    vec2 uv = vUv;
    vec2 direction = vec2(0.0, 0.0);
    
    vec2 off1 = vec2(1.3333333333333333) * direction;
    vec2 off2 = vec2(3.2307692308) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;

    vec3 color = vec3(0.0);
    // vec3 backgroundColor = vec3( 0.03921568627, 0.07843137255, 0.1843137255 );

    vec4 texture = vec4(0.0);
    // vec4 texture = texture2D(t_diffuse, uv);

    texture += texture2D(t_diffuse, uv) * 0.1964825501511404;
    texture += texture2D(t_diffuse, uv + (off1 / u_resolution)) * 0.2969069646728344;
    texture += texture2D(t_diffuse, uv - (off1 / u_resolution)) * 0.2969069646728344;
    texture += texture2D(t_diffuse, uv + (off2 / u_resolution)) * 0.09447039785044732;
    texture += texture2D(t_diffuse, uv - (off2 / u_resolution)) * 0.09447039785044732;
    texture += texture2D(t_diffuse, uv + (off3 / u_resolution)) * 0.010381362401148057;
    texture += texture2D(t_diffuse, uv - (off3 / u_resolution)) * 0.010381362401148057;


    color = texture.rgb;
    // color = mix( lighter, darker, smoothstep( 0., 0.05, texture.r ) );
    // color.rgb *= factor;
    // color.rgb *= smoothstep( 0., factor * 0.005, color.rgb );


    float alpha = texture.a;
    // float alpha = 1.;


    gl_FragColor = vec4( color, alpha );
}*/



// blur 9
void main() {

    vec2 uv = vUv;

    vec2 resolution = u_resolution;

    vec2 direction = u_direction;

    vec4 color = vec4(0.0);
    
    vec2 off1 = vec2(1.3846153846) * direction;
    vec2 off2 = vec2(3.2307692308) * direction;
    
    color += texture2D(t_diffuse, uv) * 0.2270270270;
    color += texture2D(t_diffuse, uv + (off1 / resolution)) * 0.3162162162;
    color += texture2D(t_diffuse, uv - (off1 / resolution)) * 0.3162162162;
    color += texture2D(t_diffuse, uv + (off2 / resolution)) * 0.0702702703;
    color += texture2D(t_diffuse, uv - (off2 / resolution)) * 0.0702702703;
    
    gl_FragColor = color;
}


// blur 13
/*void main() {

    vec2 uv = vUv;

    float resolution = u_resolution;

    vec2 direction = u_direction;

    vec4 color = vec4(0.0);

    vec2 off1 = vec2(1.411764705882353) * direction;
    vec2 off2 = vec2(3.2941176470588234) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;

    color += texture2D(t_diffuse, uv) * 0.1964825501511404;
    color += texture2D(t_diffuse, uv + (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(t_diffuse, uv - (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(t_diffuse, uv + (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(t_diffuse, uv - (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(t_diffuse, uv + (off3 / resolution)) * 0.010381362401148057;
    color += texture2D(t_diffuse, uv - (off3 / resolution)) * 0.010381362401148057;

    gl_FragColor = color;
}*/


/*void main() {

    vec2 uv = vUv;

    vec2 direction = u_direction;

    vec4 color = vec4(0.0);

    float resolution = u_resolution;

    vec2 off1 = vec2(1.411764705882353) * direction;
    vec2 off2 = vec2(3.2941176470588234) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;

    color += texture2D(t_diffuse, uv) * 0.1964825501511404;
    color += texture2D(t_diffuse, uv + (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(t_diffuse, uv - (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(t_diffuse, uv + (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(t_diffuse, uv - (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(t_diffuse, uv + (off3 / resolution)) * 0.010381362401148057;
    color += texture2D(t_diffuse, uv - (off3 / resolution)) * 0.010381362401148057;

    gl_FragColor = color;
}*/

// matt deslauriers one
/*void main() {
    //this will be our RGBA sum
    vec4 sum = vec4(0.0);

    //our original texcoord for this fragment
    vec2 tc = vUv;

    //the amount to blur, i.e. how far off center to sample from 
    //1.0 -> blur by one pixel
    //2.0 -> blur by two pixels, etc.
    float blur = u_radius/u_resolution; 

    //the direction of our blur
    //(1.0, 0.0) -> x-axis blur
    //(0.0, 1.0) -> y-axis blur
    float hstep = u_direction.x;
    float vstep = u_direction.y;

    //apply blurring, using a 9-tap filter with predefined gaussian weights

    sum += texture2D(t_diffuse, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;
    sum += texture2D(t_diffuse, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;
    sum += texture2D(t_diffuse, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;
    sum += texture2D(t_diffuse, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;

    sum += texture2D(t_diffuse, vec2(tc.x, tc.y)) * 0.2270270270;

    sum += texture2D(t_diffuse, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;
    sum += texture2D(t_diffuse, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;
    sum += texture2D(t_diffuse, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;
    sum += texture2D(t_diffuse, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;

    //discard alpha for our simple demo, multiply by vertex color and return
    gl_FragColor = vec4(sum.rgb, 1.0);
}*/
