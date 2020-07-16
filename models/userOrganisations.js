module.exports = {
    schema : {
        fields : {
            id : "text",
            addressid : "text",
            approvedby : "text",
            hashtagid : "text",
            isapproved : "boolean",
            updatedby : "text",
            updateddate : "text",
            approveddate : "text",
            channel : "text",
            communityid : "text",
            contactdetail : "text",
            createdby : "text",
            createddate : "text",
            datetime : "timestamp",
            description : "text",
            email : "text",
            externalid : "text",
            homeurl : "text",
            imgurl : "text",
            isdefault : "boolean",
            isrootorg : "boolean", 
            isssoenabled : "boolean",
            locationid : "text",
            locationids : {
                type : "list"
            },
            noofmembers : "text",
            orgcode : "text",
            orgname : "text",
            orgtype : "text",
            orgtypeid : "text",
            parentorgid : "text",
            preferredlanguage : "text",
            provider : "text",
            rootorgid : "text",
            slug : "text",
            status : "int",
            theme : "text",
            thumbnail : "text",
            keys :  {
                type: 'frozen'
            }
            
    },
      key : ["id"],
     indexes : ["orgtype","orgname","channel","provider","orgcode","status","externalid"]
    },
   name : "user_org",
   db_type : "cassandra"
}