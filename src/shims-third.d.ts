declare module 'spark-md5' {
  class SparkMd5 {
    appendBinary(contents:string):void;
    end():string;
    destroy():void;
  }

  export default SparkMd5;
}

declare module 'vue-particles' {
  let VueParticles: any;
  export default VueParticles;
}
