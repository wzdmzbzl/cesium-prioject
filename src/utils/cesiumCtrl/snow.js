import * as Cesium from "cesium";

// 封装下雪类
class SnowEffect {
  // 接收两个参数 1.cesium实例; 2.选项参数对象:包含雪花的大小和速度
  constructor(viewer, options) {
    // 如果没有实例,抛出错误
    if (!viewer) throw new Error("no viewer object!");
    // 判断有无选项
    options = options || {};
    // 如果没有未定义，则返回第一个参数，否则返回第二个参数
    this.snowSize = Cesium.defaultValue(options.snowSize, 0.02); // ❄️大小，最好小于0.02;
    this.snowSpeed = Cesium.defaultValue(options.snowSpeed, 60.0); // 速度
    // 将实例添加至类
    this.viewer = viewer;
    // 调用初始函数
    this.init();
  }

  init() {
    // PostProcessStage: cesium比较高级的api, 很多绚烂多彩的场景可以通过它完成
    this.snowStage = new Cesium.PostProcessStage({
      name: "czm_snow",
      fragmentShader: this.snow(), // 片源着色器代码字符串,他是GLSL代码语言

      // 他是片源着色器字符串在前端传入的对象,供其使用
      uniforms: {
        snowSize: () => {
          return this.snowSize;
        },
        snowSpeed: () => {
          return this.snowSpeed;
        },
      },
    });
    this.viewer.scene.postProcessStages.add(this.snowStage);
  }

  destroy() {
    if (!this.viewer || !this.snowStage) return;
    // 删除下雪效果, 一般在卸载组件时调用
    this.viewer.scene.postProcessStages.remove(this.snowStage);

    // 如果此对象已销毁，则返回true；否则返回false。否则为假
    const isDestroyed = this.snowStage.isDestroyed();
    // 先检查是否被销毁过, 如果已经销毁在调用destroy会报错
    if (!isDestroyed) {
      this.snowStage.destroy;
    }
    delete this.snowSize;
    delete this.snowSpeed;
  }

  show(visible) {
    // enabled: 准备就绪后是否执行此后处理阶段
    this.snowStage.enabled = visible;
  }

  // 着色器字符串
  snow() {
    return "uniform sampler2D colorTexture;\n\
          in vec2 v_textureCoordinates;\n\
          uniform float snowSpeed;\n\
                  uniform float snowSize;\n\
          float snow(vec2 uv,float scale)\n\
          {\n\
              float time=czm_frameNumber/snowSpeed;\n\
              float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
              uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
              uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
              p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
              k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);\n\
              return k*w;\n\
          }\n\
          out vec4 fragColor;\n\
          void main(void){\n\
              vec2 resolution=czm_viewport.zw;\n\
              vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
              vec3 finalColor=vec3(0);\n\
              //float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));\n\
              float c=0.;\n\
              c+=snow(uv,30.)*.0;\n\
              c+=snow(uv,20.)*.0;\n\
              c+=snow(uv,15.)*.0;\n\
              c+=snow(uv,10.);\n\
              c+=snow(uv,8.);\n\
              c+=snow(uv,6.);\n\
              c+=snow(uv,5.);\n\
              finalColor=(vec3(c));\n\
              fragColor=mix(texture(colorTexture,v_textureCoordinates),vec4(finalColor,1),.5);\n\
              }\n\
              ";
  }
}

export default SnowEffect
