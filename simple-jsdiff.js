var deepDiff = function(old_obj, new_obj) {
  var diff = [],
      path = [];
  compare(old_obj, new_obj, diff, path);
  return diff;
};

function compare(old_obj, new_obj, diff, path){
  var old_type = getType(old_obj),
      new_type = getType(new_obj),
      i,
      result = true;
  //console.log('type:', old_type);
  if(old_type === new_type){
    switch(old_type){
      case 'object':
        var tmp_new_obj = Object.assign({}, new_obj);

        for(i in old_obj){
          path.push(i);
          //console.log('object path:', path);
          if(new_obj[i]){
            delete tmp_new_obj[i];
            if(!compare(old_obj[i], new_obj[i], diff, path)){
              result = false;
              //diff.push({path: path.slice(), old_type: getType(old_obj[i]), new_type:getType(new_obj[i]), old: old_obj[i], new:new_obj[i]});
            }
          }else{
            diff.push({path: path.slice(), old_type: getType(old_obj[i]), new_type:null, old: old_obj[i], new:null});
            result = false;
          }
          path.pop();
        }
        for(i in tmp_new_obj){
          path.push(i);
          //console.log('array path:', path);
          diff.push({path: path.slice(), old_type: null, new_type:getType(tmp_new_obj[i]), old: null, new:tmp_new_obj[i]});
          path.pop();
          result = false;
        }
        return result;
      case 'array':
        //Both are arrays
        var tmp_new_ary = new_obj.slice();
        for(i in old_obj){
          var idx = -1;
          for(var j in tmp_new_ary){
            if(getType(old_obj[i]) === getType(tmp_new_ary[j])){
              var l_diff = [];
              //Pass in a dummy diff object.
              if(compare(old_obj[i], tmp_new_ary[j], l_diff, path)){
                idx = j;
                break;
              }
            }
          }
          //var idx = tmp_new_ary.indexOf(old_obj[i]);
          if(idx > -1){
            //console.log('removing '+idx+' from '+path.join('.')+' "'+JSON.stringify(tmp_new_ary[idx])+'". Match to '+JSON.stringify(old_obj[i]));
            tmp_new_ary.splice(idx, 1);
          }else{
            //doesn't exist
            
            path.push(i);
            //console.log('array path:', path);
            diff.push({path: path.slice(), old_type: getType(old_obj[i]), new_type:null, old: old_obj[i], new:null});
            path.pop();
            result = false;
          }
        }
        for(i in tmp_new_ary){
          path.push(i);
          //console.log('array path:', path);
          diff.push({path: path.slice(), old_type: null, new_type:getType(tmp_new_ary[i]), old: null, new:tmp_new_ary[i]});
          path.pop();
          result = false;
        }
        return result;
      default:
        if(old_obj !== new_obj){
          //console.log(old_obj+'!='+new_obj)
          diff.push({path: path.slice(), old_type: old_type, new_type:new_type, old: old_obj, new: new_obj});
          result = false;
        }
        return result;
    }
    
  }else{
    //different types
    diff.push({path: path.slice(), old_type: old_type, new_type:new_type});
    return false;
  }
}

function getType(obj) {
  switch({}.toString.apply(obj)){
    case '[object Function]':
      return 'function';
    case '[object Array]':
      return 'array';
    case '[object Object]':
      return 'object';
    default:
      return 'scalar';
    }
}


module.exports = deepDiff;