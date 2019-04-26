module.exports = (req)=>{

    let assessors = {

        uploadForPortal:function(){
            req.checkQuery('programId').exists().withMessage("required program id")
            req.checkQuery('componentId').exists().withMessage("required component id")
        }
    }

    if (assessors[req.params.method]) assessors[req.params.method]();
}