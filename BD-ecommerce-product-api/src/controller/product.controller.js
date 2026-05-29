const { createProductService } = require("../service/product.service")


const createProductController = async (req , res)=>{
    console.log(req.body  , req.files);
    let {} = createProductService(req.body , req.files);


}

module.exports = {createProductController}