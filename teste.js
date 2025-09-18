const { array } = require("astro:schema");


array = [1, 2, 3, 4, 5];
const calculate = (array) => {
    for (let i = 0; i < array.length; i++) {
        for(let j= i; j < array.length;j++) {
            console.log(array[i] * array[j])
        }
    }
};
