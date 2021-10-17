const { CaseSources } = require("../utils/Enums");

async function imgFilter(unfilter_img_array, origin){
    
    let filtered_img_array = [];

    switch(origin){
        case CaseSources.NuevoDiario:
            filtered_img_array = await unfilter_img_array.filter(e => e.includes('/cache'));
            break;

        case CaseSources.LaPrensa:
            break;

        default:
            break;
    }

  //  console.log('filtered images');
//    console.log(filtered_img_array);
    
    return filtered_img_array

}

module.exports = { imgFilter }
