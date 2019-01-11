'use strict'
require('../config/loadModelsAndControllers')
const version = parseFloat(process.argv[2]);
if(!version) throw "Please provide version";
module.exports.up = async function (next) {

    console.log("version : ", version);

    let migrationStatusData = {
        version: version,
        startTime: new Date
    }

    let queryFieldAndUpdateFieldArray = [
        {
            queryField:{externalId:"LW/SS/49"},
            updateField:{$set:{tip:"Consider teaching and non-teaching staff"}}
        },
        {
            queryField:{externalId:"LW/SS/00"},
            updateField:{$set:{"question.0":"Observe toilets 3 times in a day and answer the following questions"}}
        },
        {
            queryField:{externalId:"LW/SS/31"},
            updateField:{$set:{tip:"Mark Yes : If minimum of 1 poster per floor is displayed"}}
        },
        {
            queryField:{externalId:"LW/TL/07"},
            updateField:{$set:{"tip":"Sports facilities include playground, badminton court, table-tennis etc"}}
        },
        {
            queryField:{externalId:"LW/TL/12"},
            updateField:{$set:{tip:"Switch on computers and check"}}
        },
        {
            queryField:{externalId:"LW/TL/17"},
            updateField:{$set:{tip:"A CWSN friendly toilet has a railing and is made such that a wheel chair can be rolled in. You might find other provisions like a low-sink etc"}}
        },
        {
            queryField:{externalId:"IS/TL/01"},
            updateField:{$set:{tip:"To be asked to students of Class 9 and 11"}}
        },
        {
            queryField:{externalId:"IT/TL/01"},
            updateField:{$set:{tip:"Ask only special educator"}}
        },
        {
            queryField:{externalId:"IT/TL/02"},
            updateField:{$set:{tip:"Ask only special educator"}}
        },
        {
            queryField:{externalId:{$in:["BL/TL/04","BL/TL/21"]}},
            updateField:{$set:{tip:"If the actual number of students present in school is different than the number shown in records, fill the higher number"}}
        },
        {
            queryField:{externalId:{$in:["BL/TL/03"," BL/TL/22"]}},
            updateField:{$set:{tip:"Total sections means all sections of all grades combined"}}
        },
        {
            queryField:{externalId:"BL/TL/14"},
            updateField:{$set:{tip:""}}
        },
        {
            queryField:{externalId:"BL/TL/53"},
            updateField:{$set:{"question.0":"Average marks percentage of all students in class 9"}}
        },
        {
            queryField:{externalId:"BL/TL/56"},
            updateField:{$set:{"question.0":"Average marks percentage of all students in class 10"}}
        },
        {
            queryField:{externalId:"BL/TL/59"},
            updateField:{$set:{"question.0":"Average marks percentage of all students in class 11"}}
        },
        {
            queryField:{externalId:"BL/TL/62"},
            updateField:{$set:{"question.0":"Average marks percentage of all students in class 12"}}
        },
        {
            queryField:{externalId:"BL/TL/53"},
            updateField:{$set:{tip:"Average marks percentage: 1. Add percentage obtained by each student in final exam. 2 Divide the total by total number of students"}}
        },
        {
            queryField:{externalId:"BL/TL/56"},
            updateField:{$set:{tip:"Average marks percentage: 1. Add percentage obtained by each student in final exam. 2 Divide the total by total number of students"}}
        },
        {
            queryField:{externalId:"BL/TL/59"},
            updateField:{$set:{tip:"Average marks percentage: 1. Add percentage obtained by each student in final exam. 2 Divide the total by total number of students"}}
        },
        {
            queryField:{externalId:"BL/TL/62"},
            updateField:{$set:{tip:"Average marks percentage: 1. Add percentage obtained by each student in final exam. 2 Divide the total by total number of students"}}
        },
        {
            queryField:{externalId:"BL/SS/05"},
            updateField:{$set:{tip:"Number of times school has been assessed on minmum standards of school safety in the current academic year"}}
        },
        {
            queryField:{externalId:"BL/TL/27"},
            updateField:{$set:{tip:"Attendance record of previous two PTMs of 6 classes"}}
        },
        {
            queryField:{externalId:"BL/TL/51"},
            updateField:{$set:{tip:"Number of students who have obtained more than 33% (overall) in final exams"}}
        },
        {
            queryField:{externalId:"BL/TL/54"},
            updateField:{$set:{tip:"Number of students who have obtained more than 33% (overall) in final exams"}}
        },
        {
            queryField:{externalId:"BL/TL/57"},
            updateField:{$set:{tip:"Number of students who have obtained more than 33% (overall) in final exams"}}
        },
        {
            queryField:{externalId:"BL/TL/60"},
            updateField:{$set:{tip:"Number of students who have obtained more than 33% (overall) in final exams"}}
        },
        {
            queryField:{externalId:"BL/TL/48"},
            updateField:{$set:{tip:"Average attendance means: 1. Sum of daily attendance of whole school. 2. Divided by number of days in the month"}}
        },
        {
            queryField:{externalId:"BL/TL/02"},
            updateField:{$set:{tip:"Number of teachers provided by department - Regular or contractual or guest"}}
        },
        {
            queryField:{externalId:"BL/TL/01"},
            updateField:{$set:{tip:"Number of teaching posts sanctioned by department. Ask this question from the principal"}}
        },
        {
            queryField:{externalId:"BL/TL/05"},
            updateField:{$set:{tip:"Total teachers who teach students present in the school. Principal/ Vice Principal/ Lab attendants, Counselors, Coaches etc will not be considered as teachers but includes guest/contractual/STC Incharges/NGO teachers."}}
        },
        {
            queryField:{externalId:"BL/SS/26"},
            updateField:{$set:{"question.0":"Date of last medical check up camp done in current academic year"}}
        },
        {
            queryField:{externalId:"IS/00"},
            updateField:{$set:{tip:"At least 3 groups, each containing minimum 7 students should be interviewed"}}
        },
        {
            queryField:{externalId:"IS/03"},
            updateField:{$set:{tip:"Students to be interviewed - 11 from Class 3, 11 from class 5 and 11 from class 8. If there is CWSN in any class interview them also"}}
        },
        {
            queryField:{externalId:"IT/SS/00"},
            updateField:{$set:{tip:"Conduct 7 teacher interviews including 1 full time special educator."}}
        },
        {
            queryField:{externalId:"BL/TL/49"},
            updateField:{$set:{tip:"Observe atleast 30 notebooks (10 from each 3rd, 5th and 8th) as collected by all assessors during student assessment"}}
        },
        {
            queryField:{externalId:"BL/TL/38"},
            updateField:{$set:{tip:""}}
        },
        {
            queryField:{externalId:"BL/TL/39"},
            updateField:{$set:{tip:""}}
        },
        {
            queryField:{externalId:"BL/TL/41"},
            updateField:{$set:{tip:""}}
        },
        {
            queryField:{externalId:"BL/TL/42"},
            updateField:{$set:{tip:""}}
        },

    ];
    let promises = queryFieldAndUpdateFieldArray.map(queryFieldAndUpdateField => {
        queryFieldAndUpdateField.updateField.$set["dataVersion"] = version;
        return database.models.questions.updateOne(queryFieldAndUpdateField.queryField,queryFieldAndUpdateField.updateField,{upsert:true}).exec();
    });
    return Promise.all(promises).then(()=>{
        migrationStatusData.endTime = new Date;
        migrationStatusData.migrationName = 'update-tip-and-questions-in-question';
        migrationStatusData.timeTaken = Math.abs(migrationStatusData.endTime - migrationStatusData.startTime);
        gen.utils.createMigrationStatus(migrationStatusData);
    });
}

module.exports.down = function (next) {
    next();
}
