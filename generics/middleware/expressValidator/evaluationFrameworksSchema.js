module.exports = (req)=>{

    let evaluationFrameworks = {
        
        details:function(){
            req.checkParams('_id').exists().withMessage('required evaluation framework id')
        }

    }
    if (evaluationFrameworks[req.params.method]) evaluationFrameworks[req.params.method]();
}