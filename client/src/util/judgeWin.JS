// const s = new Set(['Five','two','Fist']);

export default function(player, computer){

    if(player === computer){
        return 0
    }else{
        if(player === 'two'){
            if(computer === 'Fist') return -1;
            else return 1
        }else if(player === 'Fist'){
            if(computer === 'Five') return -1
            else return 1
        }else if(player === 'Five'){
            if(computer === 'two') return -1;
            else return 1;
        }
    }
}