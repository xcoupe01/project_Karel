export {math}

/**
 * This class will be use in the future to manipulate with numbers and variables in Karel's language
 */
class math{

    constructor(){

    }

    isNumber(word){
        if(isNaN(parseInt(word))){
            return true;
        }
        return false;
    }

    getNumber(word){
       return parseInt(word);
    }

}