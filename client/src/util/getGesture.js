const resultArr = ['Five','two','Fist'];
export default function(gestureArr){
    for(let i = 0; i < gestureArr.length; i++){
        if(resultArr.includes(gestureArr[i].classname)){
            return gestureArr[i];
        }
    }
    return '';
}