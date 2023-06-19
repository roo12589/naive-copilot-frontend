/**
 * 解决JSON.stringify和JSON.parse不能转换RegExp的问题
 * @author gqk
 * @see JSON.parse();JSON.stringify()
 */

/**
 * json字符串转json对象
 * @param { String } jsonStr json字符串
 */
export function parseJson(jsonStr){
    return JSON.parse(jsonStr, (k, v) => {
      try{
        // 将正则字符串转成正则对象
        if (eval(v) instanceof RegExp) {
          return eval(v);
        }
      }catch(e){
        // nothing
      }
  
      return v;
    });
  }
  
  /**
   * json对象转json字符串
   * @param { Object } json json对象
   */
  export function stringifyJson(json){
    return JSON.stringify(json, (k, v) => {
      // 将正则对象转换为正则字符串
      if(v instanceof RegExp){
        return v.toString();
      }
  
      return v;
    });
  }