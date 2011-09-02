var ShaderZ = {

	/* -------------------------------------------------------------------------
	//	Depth-of-field shader with bokeh
	//	ported from GLSL shader by Martins Upitis 
	//	http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
	 ------------------------------------------------------------------------- */
	'zbasic': {
		
			uniforms: {},

			vertexShader: [

				"void main() {",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [
				"void main() {",

					"gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.3 );",

				"}"

			].join("\n")

	},
	'brilho'	: {

		uniforms: { tColor:   { type: "t", value: 0, texture: null },
					tDepth:   { type: "t", value: 1, texture: null },
					tBeer:    { type: "t", value: 1, texture: null },
				  },

		vertexShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),

		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform sampler2D tColor;",
		"uniform sampler2D tDepth;",
		"uniform sampler2D tBeer;",
		
		"void main() {",
		
		"vec4 vt = texture2D( tBeer, vUv.xy );",
		"vec4 v = texture2D( tColor, vUv.xy );",
		"float vet = texture2D( tDepth, vUv.xy )[0];",
					
		"if(vet>0.75){",
			"gl_FragColor = vec4(v[0],v[1],v[2],0.5)*(1.18+(vet/2.5));",
		"}else if(vet>0.3){",
			"gl_FragColor = vec4(v[0],v[1],v[2],0.5)*(1.30);",
		"}else{",
			"gl_FragColor = vec4(v[0],v[1],v[2],0.5)*(1.15);",
		"}",
		//"gl_FragColor = vec4(v[0],v[1],v[2],0.5)*1.0;",
		"gl_FragColor.a =1.0;",		
			
		"}"
		
		].join("\n")
	},
	'glass'	  : {

		uniforms: { tColor:   { type: "t", value: 0, texture: null },
					tDepth:   { type: "t", value: 1, texture: null },
					tBeer:    { type: "t", value: 1, texture: null },
				  },

		vertexShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),

		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform sampler2D tColor;",
		"uniform sampler2D tDepth;",
		"uniform sampler2D tBeer;",
		
		"void main() {",
		
		"vec4 vt = texture2D( tBeer, vUv.xy );",
		"vec4 v = texture2D( tColor, vUv.xy );",		
		
		"vec4 ca = texture2D( tBeer, (vUv.xy+vec2(0.0,0.003)));",
		"float vd = ((vt[2])-ca[2])*1.0;",	
		"vec4 cax = texture2D( tBeer, (vUv.xy-vec2(0.0,0.003)));",
		"float vdx = ((vt[2])-cax[2])*1.0;",
		"vec4 mcax = texture2D( tBeer, (vUv.xy-vec2(0.0,0.02)));",
		"float mvdx = ((vt[2])-mcax[2])*1.0;",		
		"vec4 ca2 = texture2D( tBeer, (vUv.xy+vec2(0.002,0.0)));",
		"float vd2 = ((vt[2])-ca2[2])*1.0;",	
		
		"if((vt[2]!=0.0)&&(vt[0]==0.0)){",
			"gl_FragColor = vec4(v[0],v[1],v[2],0.5);",
			"gl_FragColor.a =1.0;",	
		"}else{",	
			"if(vdx>0.015){vdx=0.015;}",
			"if(vd>0.015){vd=0.015;}",
			"if(vd2>0.030){vd2=0.030;}",
			"if(vd2<-0.030){vd2=-0.030;}",
			
			"float t1=(vdx-0.0045)*30.0;",		
			"float t2=(vd-0.005)*30.0;",
			"float t3=(vd2-0.017)*14.0;",		
			"float t4=(vd2+0.017)*14.0;",
			
			"vec4 val=vec4(1.0-t1,1.0-t2,1.0-t3,1.0+t4);",
			"float min=1.0;",
			"for(int i=0;i<4;i++){",
				"if(val[i]<min){",		
					"min=val[i];",
				"}",
			"}",
			"if(min>1.0){min=1.0;}",			
			
			"gl_FragColor = vec4(v[0],v[1],v[2],0.5)*(min*min);",
			//"gl_FragColor = vec4(min*min);",
			"if(vt[2]!=0.0){",		
				"if(mvdx>0.2){",	
					"gl_FragColor*=0.75;",
				"}",
				"gl_FragColor.a =1.0;",
				"if(v[2]>0.5){",
					//"gl_FragColor.a =1.0;",
				"}else{",					
					//"gl_FragColor.a =1.9-(min);",	
				"}",
			"}else{",	
				"gl_FragColor.a =0.0;",
			"}",
		"}",
		//"gl_FragColor = vec4((vt-0.8)*5.0);",				
		"}"
		
		].join("\n")		
	
	},
	'fire'	  : {

		uniforms: { tLava:   { type: "t", value: 0, texture: null },
					tRock:    { type: "t", value: 1, texture: null },
					t:    { type: "f", value: 1.0 },
				  },

		vertexShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),

		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform sampler2D tLava;",
		"uniform sampler2D tRock;",
		"uniform float t;",
		
		"void main() {",
		
			"vec4 v = texture2D( tLava, vUv.xy );",		
			//"vec4 r=vec4(0.0);",
			"float d=1.0+(t*0.0026);",
			"float rr=1.0;",			
			"float max=0.012-(t*0.000000);",
			"if(max<0.0){max=0.0;}", 
			"vec4 ttt;",
			//"if(t<900.0){",
				"ttt=(texture2D(tLava,vUv.xy));",
				"if(ttt[0]*2.0+ttt[1]<t*0.004){",
					"v= texture2D( tRock, vUv.xy )*(((t*0.004)-(ttt[0]*2.0+ttt[1])*1.0)*(1.0/(t*0.008)));",
				"}",
				"if(ttt[0]*2.0+ttt[1]>t*0.0038){",				
					"v= texture2D( tLava, vUv.xy )*((ttt[0]*(2.0+t*0.0002)+ttt[1])-(t*0.0038));",
					"v[1]*= ((ttt[0]*(2.0+t*0.0002)+ttt[1])-(t*0.0038));",
					"v[2]*= ((ttt[0]*(2.0+t*0.0002)+ttt[1])-(t*0.0038));",
				"}",
				"for(float p=0.0;p<1.0;p+=0.2){",
					"float ang=(0.012-(t*0.000000))*(p);",	
					//"if(ang>0.0){",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*1.0,ang*0.0)));",				
						"if(ttt[0]*2.0+ttt[1]>d){",
							"v+= (ttt)*((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*0.8,ang*0.8)));",
						"if(ttt[0]*2.0+ttt[1]>d){",
							"v+= (ttt)*((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*0.0,ang*1.0)));",
						"if(ttt[0]*2.0+ttt[1]>d){",
							"v+= (ttt)*((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*-0.8,ang*0.8)));",
						"if(ttt[0]*2.0+ttt[1]>d){",
							"v+= (ttt)*((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*-1.0,ang*0.0)));",
						"if(ttt[0]*2.0+ttt[1]>d){",
							"v+= (ttt)*((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*-0.8,ang*-0.8)));",
						"if(ttt[0]*2.0+ttt[1]>d){",
							"v+= (ttt)*((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*0.0,ang*-1.0)));",
						"if(ttt[0]*2.0+ttt[1]>d){",
							"v+= (ttt)*((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*0.8,ang*-0.8)));",
						"if(ttt[0]*2.0+ttt[1]>d){",
							"v+= (ttt)*((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[0]*2.0+ttt[1]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
					//"}",
				"}",
			
				"v/=(rr*0.8);",	
				"if((rr-12.5)>0.0){",
					"v[2]+=((rr-12.5)*0.2);",
				"}",
			
			"if((t>800.0)&&(t<1100.0)){",
				"float tpx=t-(700.0);",
				"float dif=v[0]-(0.5-(tpx*0.0015));",
				"if(dif>0.0){",					
					//"v = vec4( dif*6.0,dif*6.0,dif*10.0,0.5);",
					"v = vec4(v[0]*0.6,v[1]*0.8,(v[2])*1.2,0.5)*((dif*4.0)+6.0);",
				"}",
			"}",
			"if(t>1000.0){",
				"if(v[0]==0.0){ v=vec4((t-1000.0)/(30.0)); }",
			"}",
			
			"gl_FragColor = vec4(v[0],v[1],v[2],0.5)*1.3;",
			"gl_FragColor.a =1.0;",	
			"if(t>1030.0){",
				"if(texture2D(tLava,vUv.xy)[0]==0.0){",
					"gl_FragColor.a =(1.0-((t-1030.0)*0.01));",	
				"}",
			"}",
		"}"
		
		].join("\n")		
	
	},
	'green'	  : {

		uniforms: { tLava:   { type: "t", value: 0, texture: null },
					tRock:    { type: "t", value: 1, texture: null },
					t:    { type: "f", value: 1.0 },
				  },

		vertexShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"void main() {",
			"vNormal =  vec3( normal);",
			"vUv = vec2( uv.x, 1.0 - uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			
		"}"

		].join("\n"),

		fragmentShader: [

		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		"uniform sampler2D tLava;",
		"uniform sampler2D tRock;",
		"uniform float t;",
		
		"void main() {",
		
			"vec4 v = texture2D( tLava, vUv.xy );",		
			//"vec4 r=vec4(0.0);",
			"float d=1.0+(t*0.0026);",
			"float rr=1.0;",			
			"float max=0.012-(t*0.000000);",
			"if(max<0.0){max=0.0;}", 
			"vec4 ttt;",
			//"if(t<900.0){",
				"ttt=(texture2D(tLava,vUv.xy));",
				"if((ttt[1]*2.0+ttt[0]-1.5)<t*0.0015){",
					//"v= texture2D( tRock, vUv.xy )*(((t*0.0015)-(ttt[1]*2.0+ttt[0])*1.0)*(1.0/(t*0.0015)));",
					"v= texture2D( tRock, vUv.xy )*(1.0);",
				"}",
				"if((ttt[1]*2.0+ttt[0]-1.5)>t*0.0015){",				
					"v= texture2D( tLava, vUv.xy )*((ttt[0]*(2.0+t*0.0015)+ttt[1])-(t*0.0015));",
					//"v[1]*= ((ttt[0]*(2.0+t*0.0002)+ttt[1])-(t*0.0038));",
					//"v[2]*= ((ttt[0]*(2.0+t*0.0002)+ttt[1])-(t*0.0038));",					
				"}",
				"for(float p=0.0;p<1.0;p+=0.2){",
					"float ang=(0.012-(t*0.000000))*(p);",	
					//"if(ang>0.0){",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*1.0,ang*0.0)));",				
						"if(ttt[1]*2.0+ttt[0]>d){",
							"v+= (ttt)*((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*0.8,ang*0.8)));",
						"if(ttt[1]*2.0+ttt[0]>d){",
							"v+= (ttt)*((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*0.0,ang*1.0)));",
						"if(ttt[1]*2.0+ttt[0]>d){",
							"v+= (ttt)*((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*-0.8,ang*0.8)));",
						"if(ttt[1]*2.0+ttt[0]>d){",
							"v+= (ttt)*((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*-1.0,ang*0.0)));",
						"if(ttt[1]*2.0+ttt[0]>d){",
							"v+= (ttt)*((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*-0.8,ang*-0.8)));",
						"if(ttt[1]*2.0+ttt[0]>d){",
							"v+= (ttt)*((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*0.0,ang*-1.0)));",
						"if(ttt[1]*2.0+ttt[0]>d){",
							"v+= (ttt)*((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
						"ttt=(texture2D(tLava,vUv.xy+vec2(ang*0.8,ang*-0.8)));",
						"if(ttt[1]*2.0+ttt[0]>d){",
							"v+= (ttt)*((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
							"rr+=((ttt[1]*2.0+ttt[0]-d)*((max-ang)*(1.0/max))/3.0);",
						"}",
					//"}",
				"}",
			
				"v/=(rr*0.8);",	
				"if((rr-12.5)>0.0){",
					"v[2]+=((rr-12.5)*0.2);",
				"}",
			
			"if((t>600.0)&&(t<1100.0)){",
				"float tpx=t-(600.0);",
				"float dif=v[0]-(0.5-(tpx*0.0015));",
				"if(dif>0.0){",					
					//"v = vec4( dif*6.0,dif*6.0,dif*10.0,0.5);",
					"v = vec4(v[0]*0.6,v[1]*0.8,(v[2])*1.2,0.5)*((dif*4.0)+6.0);",
				"}",
			"}",
			"if(t>1000.0){",
				"if(v[0]==0.0){ v=vec4((t-1000.0)/(30.0)); }",
			"}",
			
			"gl_FragColor = vec4(v[0],v[1],v[2],0.5)*1.3;",
			"gl_FragColor.a =1.0;",	
			"if(t>1030.0){",
				"if(texture2D(tLava,vUv.xy)[0]==0.0){",
					"gl_FragColor.a =(1.0-((t-1030.0)*0.01));",	
				"}",
			"}",
		"}"
		
		].join("\n")		
	
	}

};
