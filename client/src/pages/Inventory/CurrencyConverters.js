

const  toFloat = (coins) =>{
        // convert "0.21.0" from db or [0,21,0] from user balance cost into float
        const arr = typeof(coins)==="string" ? coins.split(".") : coins
        let arrToStr = `${arr[0]}.${arr[1].length===1 ? `0${arr[1]}` : arr[1]}${arr[2].length===1 ?  `0${arr[2]}` : arr[2]}`
        return parseFloat(arrToStr)
}

const floatToArray = (coins) =>{
    ///converts 1.4501 into array [1,45,1] - 1 gold, 45 silver 1 copper
    const str = coins.toFixed(4) /// '1.4501'
    const splitGold = str.split(".") /// ['1','4501']
    const gold = parseInt(splitGold) // 1
    const silver = parseInt(splitGold[1].slice(0,2)) // extract first 2 elements - 45
    const copper = parseInt(splitGold[1].slice(2,4)) 
    return [gold, silver, copper]
  }

export {toFloat, floatToArray}