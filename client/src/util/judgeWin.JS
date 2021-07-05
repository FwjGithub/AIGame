// const s = new Set(['Five','Two','Fist']);

export default function(player, computer){

    if(player === computer){
        return 0
    }else{
        if(player === 'Two'){
            if(computer === 'Fist') return -1;
            else return 1
        }else if(player === 'Fist'){
            if(computer === 'Five') return -1
            else return 1
        }else if(player === 'Five'){
            if(computer === 'Two') return -1;
            else return 1;
        }
    }
}