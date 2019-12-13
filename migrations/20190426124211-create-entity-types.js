module.exports = {
  async up(db) {
    global.migrationMsg = "Migrated up create-entity-types file"

    let schoolEntity = {
      name: "school",
      regsitryDetails: {
        name: "schoolRegsitry"
      },
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false,
      types: [
        {
          type: "A1",
          label: "All"
        },
        {
          type: "A2",
          label: "All (if applicable)"
        },
        {
          type: "A3",
          label: "All Govt."
        },
        {
          type: "A4",
          label: "All Private"
        },
        {
          type: "A5",
          label: "All (6th-12th)"
        },
        {
          type: "A6",
          label: "All (Nursery-5th)"
        },
        {
          type: "A7",
          label: "Govt. DOE (6th-12th)"
        },
        {
          type: "A8",
          label: "Private (Nursery-5th)"
        },
        {
          type: "A9",
          label: "Private (Nursery-8th/10th)"
        },
        {
          type: "A10",
          label: "All Aided"
        }
      ],
      profileForm: [
        {
          "field": "presenceOfSignMarkingSchoolEntrance",
          "label": "Presence Of Sign Marking School Entrance",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "schoolTiming",
          "label": "School Timing",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "isPrePrimaryPresentOrNot",
          "label": "Is Pre Primary Present Or Not?",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalSections",
          "label": "Total Sections",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsInPrePrimary",
          "label": "Total Students In Pre Primary",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsInPrimary",
          "label": "Total Student In Primary",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsInMiddleAndSecondarySchool",
          "label": "Total Students In Middle & Secondary School",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "averageStudentsPerSection",
          "label": "Average Students Per Section",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade1",
          "label": "Total Students In Grade 1",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade2",
          "label": "Total Students In Grade 2",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade3",
          "label": "Total Students In Grade 3",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade4",
          "label": "Total Students In Grade 4",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade5",
          "label": "Total Students In Grade 5",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade6",
          "label": "Total Students In Grade 6",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade7",
          "label": "Total Students In Grade 7",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade8",
          "label": "Total Students In Grade 8",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade9",
          "label": "Total Students In Grade 9",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade10",
          "label": "Total Students In Grade 10",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade11",
          "label": "Total Students In Grade 11",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudentsGrade12",
          "label": "Total Students In Grade 12",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalNoOfTeachers",
          "label": "Total No Of Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalNoOfPrincipal",
          "label": "Total No Of Principal",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalNoOfHMsOrCoordinators",
          "label": "Total No Of HMs or Coordinators",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "presenceOfSchoolBoardOrManagement",
          "label": "Presence Of School Board Or Management",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "briefHistoryOfTheSchool",
          "label": "Brief History Of The School",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "descriptionOfCommunityAroundSchool",
          "label": "Description Of Community Around School",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "studentBackground",
          "label": "Student Background",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "stateOfStudentDropout",
          "label": "State of Student Dropout",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "issuesWithTeachersLeavingSchool",
          "label": "Issues with Teachers Leaving School",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "teacherAttendanceInTheSchool",
          "label": "Teacher Attendance In The School",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "adminOrHelpingStaff",
          "label": "Admin Or Helping Staff",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "externalId",
          "label": "External Id",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "types",
          "label": "Types",
          "value": "",
          "visible": "",
          "editable": "",
          "options": [
            {
              "value": "A1",
              "label": "All"
            },
            {
              "value": "A2",
              "label": "All (if applicable)"
            },
            {
              "value": "A3",
              "label": "All Govt."
            },
            {
              "value": "A4",
              "label": "All Private"
            },
            {
              "value": "A5",
              "label": "All (6th-12th)"
            },
            {
              "value": "A6",
              "label": "All (Nursery-5th)"
            },
            {
              "value": "A7",
              "label": "Govt. DOE (6th-12th)"
            },
            {
              "value": "A8",
              "label": "Private (Nursery-5th)"
            },
            {
              "value": "A9",
              "label": "Private (Nursery-8th/10th)"
            },
            {
              "value": "A10",
              "label": "All Aided"
            }
          ],
          "input": "multiselect"
        },
        {
          "field": "addressLine1",
          "label": "Address Line 1",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "addressLine2",
          "label": "Address Line 2",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "city",
          "label": "City",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "gpsLocation",
          "label": "Gps Location",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "name",
          "label": "Name",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "phone",
          "label": "Phone",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "principalName",
          "label": "Principal Name",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "pincode",
          "label": "Pincode",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "administration",
          "label": "Administration",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "gender",
          "label": "Gender",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "shift",
          "label": "Shift",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalStudents",
          "label": "Total Students",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalGirls",
          "label": "Total Girls",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalBoys",
          "label": "Total Boys",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "lowestGrade",
          "label": "Lowest Grade",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "highestGrade",
          "label": "Highest Grade",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalEnglishTeachers",
          "label": "Total English Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalHindiTeachers",
          "label": "Total Hindi Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalMathsTeachers",
          "label": "Total Maths Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalScienceTeachers",
          "label": "Total Science Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalSocialTeachers",
          "label": "Total Social Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalSocialScienceTeachers",
          "label": "Total Social Science Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalComputerTeachers",
          "label": "Total Computer Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "mediumOfInstruction",
          "label": "Medium Of Instruction",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalPhysicsTeachers",
          "label": "Total Physics Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalChemistryTeachers",
          "label": "Total Chemistry Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalBiologyTeachers",
          "label": "Total Biology Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalEconomicsTeachers",
          "label": "Total Economics Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalPoliticalScienceTeachers",
          "label": "Total Political Science Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalAccountsTeachers",
          "label": "Total Accounts Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalBusinessStudiesTeachers",
          "label": "Total Business Studies Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalHistoryTeachers",
          "label": "Total History Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "totalGeographyTeachers",
          "label": "Total Geography Teachers",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "streamOffered",
          "label": "Stream Offered",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        },
        {
          "field": "emailId",
          "label": "Email Id",
          "value": "",
          "visible": "",
          "editable": "",
          "input": "text"
        }
      ],
      profileFields: [
        "externalId",
        "addressLine1",
        "addressLine2",
        "city",
        "country",
        "createdBy",
        "createdDate",
        "gpsLocation",
        "isDeleted",
        "name",
        "phone",
        "principalName",
        "state",
        "status",
        "updatedBy",
        "updatedDate",
        "pincode",
        "districtId",
        "districtName",
        "zoneId",
        "blockId",
        "administration",
        "gender",
        "shift",
        "schoolTypes",
        "totalStudents",
        "totalGirls",
        "totalBoys",
        "lowestGrade",
        "highestGrade",
        "totalEnglishTeachers",
        "totalHindiTeachers",
        "totalMathsTeachers",
        "totalScienceTeachers",
        "totalSocialTeachers",
        "totalSocialScienceTeachers",
        "totalComputerTeachers",
        "mediumOfInstruction",
        "totalPhysicsTeachers",
        "totalChemistryTeachers",
        "totalBiologyTeachers",
        "totalEconomicsTeachers",
        "totalPoliticalScienceTeachers",
        "totalAccountsTeachers",
        "totalBusinessStudiesTeachers",
        "totalHistoryTeachers",
        "totalGeographyTeachers",
        "streamOffered",
        "emailId",
        "presenceOfSignMarkingSchoolEntrance",
        "schoolTiming",
        "isPrePrimaryPresentOrNot",
        "totalSections",
        "totalStudentsInPrePrimary",
        "totalStudentsInPrimary",
        "totalStudentsInMiddleAndSecondarySchool",
        "averageStudentsPerSection",
        "totalStudentsGrade1",
        "totalStudentsGrade2",
        "totalStudentsGrade3",
        "totalStudentsGrade4",
        "totalStudentsGrade5",
        "totalStudentsGrade6",
        "totalStudentsGrade7",
        "totalStudentsGrade8",
        "totalStudentsGrade9",
        "totalStudentsGrade10",
        "totalStudentsGrade11",
        "totalStudentsGrade12",
        "totalNoOfTeachers",
        "totalNoOfPrincipal",
        "totalNoOfHMsOrCoordinators",
        "presenceOfSchoolBoardOrManagement",
        "briefHistoryOfTheSchool",
        "descriptionOfCommunityAroundSchool",
        "studentBackground",
        "stateOfStudentDropout",
        "issuesWithTeachersLeavingSchool",
        "teacherAttendanceInTheSchool",
        "adminOrHelpingStaff"
      ]
    }

    let parentEntity = {
      name: "parent",
      regsitryDetails: {
        name: "parentsRegsitry"
      },
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false,
      profileFields: [
        "studentName",
        "grade",
        "name",
        "gender",
        "type",
        "phone1",
        "phone2",
        "address",
        "schoolId",
        "schoolName",
        "programId",
        "callResponse",
        "callResponseUpdatedTime"
      ],
      profileForm: [
        {
          field: "studentName",
          label: "Student Name",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "grade",
          label: "Grade",
          value: "",
          visible: true,
          editable: true,
          input: "radio",
          options: [
            {
              value: "nursery",
              label: "Nursery"
            },
            {
              value: "lowerKG",
              label: "Lower KG"
            },
            {
              value: "upperKG",
              label: "Upper KG"
            },
            {
              value: "kindergarten",
              label: "Kindergarten"
            },
            {
              value: "1",
              label: 1
            },
            {
              value: "2",
              label: 2
            },
            {
              value: "3",
              label: 3
            },
            {
              value: "4",
              label: 4
            },
            {
              value: "5",
              label: 5
            },
            {
              value: "6",
              label: 6
            },
            {
              value: "7",
              label: 7
            },
            {
              value: "8",
              label: 8
            },
            {
              value: "9",
              label: 9
            },
            {
              value: "10",
              label: 10
            },
            {
              value: "11",
              label: 11
            },
            {
              value: "12",
              label: 12
            }
          ],
          validation: {
            required: true
          }
        },
        {
          field: "section",
          label: "Section",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: false,
            regex: "^[a-zA-Z]+$"
          }
        },
        {
          field: "name",
          label: "Parent Name",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: false
          }
        },
        {
          field: "gender",
          label: "Parent Gender",
          value: "",
          visible: true,
          editable: true,
          input: "radio",
          options: [
            {
              value: "M",
              label: "Male"
            },
            {
              value: "F",
              label: "Female"
            }
          ],
          validation: {
            required: false
          }
        },
        {
          field: "type",
          label: "Parent Type",
          value: "",
          visible: true,
          editable: true,
          input: "multiselect",
          options: [
            {
              value: "P1",
              label: "Parent only"
            },
            {
              value: "P2",
              label: "SMC Parent Member"
            },
            {
              value: "P3",
              label: "Safety Committee Member"
            },
            {
              value: "P4",
              label: "EWS-DG Parent"
            },
            {
              value: "P5",
              label: "Social Worker"
            },
            {
              value: "P6",
              label: "Elected Representative Nominee"
            }
          ],
          validation: {
            required: false
          }
        },
        {
          field: "phone1",
          label: "Phone Number",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: true,
            regex: "^[0-9]{10}+$"
          }
        },
        {
          field: "phone2",
          label: "Additional Phone Number",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: false,
            regex: "^[0-9]{10}+$"
          }
        },
        {
          field: "address",
          label: "Residential Address",
          value: "",
          visible: true,
          editable: true,
          input: "textarea",
          validation: {
            required: true
          }
        },
        {
          field: "schoolId",
          label: "School ID",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "schoolName",
          label: "School Name",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "programId",
          label: "Program ID",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        }
      ]
    }

    let teacherEntity = {
      name: "teacher",
      regsitryDetails: {
        name: "teacherRegsitry"
      },
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false,
      profileFields: [
        "name",
        "qualifications",
        "yearsOfExperience",
        "yearsInCurrentSchool",
        "schoolId",
        "schoolName",
        "programId"
      ],
      profileForm: [
        {
          field: "name",
          label: "Name",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "qualifications",
          label: "Qualifications",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "yearsOfExperience",
          label: "Years Of Experience",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: true
          }
        },
        {
          field: "yearsInCurrentSchool",
          label: "Number of years in this school",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: true
          }
        },
        {
          field: "schoolId",
          label: "School ID",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "schoolName",
          label: "School Name",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "programId",
          label: "Program ID",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        }
      ]
    }


    let schoolLeaderEntity = {
      name: "schoolLeader",
      regsitryDetails: {
        name: "schoolLeaderRegsitry"
      },
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false,
      profileFields: [
        "name",
        "age",
        "gender",
        "bio",
        "experienceInEducationSector",
        "experienceInCurrentSchool",
        "experienceAsSchoolLeader",
        "dutiesOrResponsibility",
        "timeOfAvailability",
        "nonTeachingHours",
        "bestPart",
        "challenges",
        "schoolId",
        "schoolName",
        "programId",
      ],
      profileForm: [
        {
          field: "name",
          label: "Name",
          tip: "",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "age",
          label: "Age",
          tip: "Need not ask. Write an approximation",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: true
          }
        },
        {
          field: "gender",
          label: "Gender",
          tip: "",
          value: "",
          visible: true,
          editable: true,
          input: "radio",
          options: [
            {
              value: "R1",
              label: "Male"
            },
            {
              value: "R2",
              label: "Female"
            },
            {
              value: "R3",
              label: "Other"
            }
          ],
          validation: {
            required: true
          }
        },
        {
          field: "bio",
          label: "Can you tell me a little about yourself?",
          tip: "",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "experienceInEducationSector",
          label: "No. of years in education sector",
          tip: "Enter number in terms of years",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: true
          }
        },
        {
          field: "experienceInCurrentSchool",
          label: "No. of years in this school",
          tip: "Enter number in terms of years",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: true
          }
        },
        {
          field: "experienceAsSchoolLeader",
          label: "No. of years as school leader here",
          tip: "Enter number in terms of years",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: true
          }
        },
        {
          field: "dutiesOrResponsibility",
          label: "Roles and responsibilities",
          tip: "Also find out how often they come to school",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "timeOfAvailability",
          label: "Time for planning during school hours",
          tip: "",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "nonTeachingHours",
          label: "Number of non-teaching hours in a day:",
          tip: "",
          value: "",
          visible: true,
          editable: true,
          input: "number",
          validation: {
            required: true
          }
        },
        {
          field: "bestPart",
          label: "Best thing about the profession",
          tip: "",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "challenges",
          label: "Challenges in the profession",
          tip: "",
          value: "",
          visible: true,
          editable: true,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "schoolId",
          label: "School ID",
          tip: "",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "schoolName",
          label: "School Name",
          tip: "",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        },
        {
          field: "programId",
          label: "Program ID",
          tip: "",
          value: "",
          visible: false,
          editable: false,
          input: "text",
          validation: {
            required: true
          }
        }
      ]
    }

    let blockEntity = {
      name: "block",
      regsitryDetails: {
        name: "blockRegsitry"
      },
      profileFields: [
        "name",
        "blockId",
        "districtName",
        "state",
        "region"
      ],
      profileForm: [

      ],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let districtEntity = {
      name: "district",
      regsitryDetails: {
        name: "districtRegsitry"
      },
      profileFields: [],
      profileForm: [
        "name",
        "state",
        "districtId",
        "region"
      ],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let clusterEntity = {
      name: "cluster",
      regsitryDetails: {
        name: "clusterRegsitry"
      },
      profileFields : [
        "externalId",
        "name",
        "block",
        "crpName",
        "beoName",
        "address",
        "city",
        "pincode",
        "state",
        "country",
        "numSchools",
        "numHigherPrimarySchools",
        "numLowerPrimarySchools",
        "numTeachers",
        "numHeadMasters",
        "numStudentsInTheCluster",
        "mediumOfInstruction",
        "hasClusterResourceCenter",
        "hasAnganwadis",
        "descCommunity",
        "genStudentBackground",
        "stateOfStudentDropout",
        "teacherAttendanceInSchool",
        "otherWorkingOrganisation"
      ],
      profileForm : [
        {
            "field" : "name",
            "label" : "Cluster Name",
            "value" : "",
            "visible" : true,
            "editable" : true,
            "input" : "text",
            "validation" : {
                "required" : true
            }
        },
        {
            "field" : "externalId",
            "label" : "Cluster ID",
            "value" : "",
            "visible" : true,
            "editable" : false,
            "input" : "text",
            "validation" : {
                "required" : true
            }
        },
        {
            "field" : "types",
            "label" : "Cluster Type",
            "value" : "",
            "visible" : true,
            "editable" : true,
            "input" : "radio",
            "options" : [ 
                {
                    "value" : "Cluster1",
                    "label" : "Type of Cluster 1"
                }, 
                {
                    "value" : "Cluster2",
                    "label" : "Type of Cluster 2"
                }
            ],
            "validation" : {
                "required" : false
            }
        },
        {
            "field" : "address",
            "label" : "Cluster Address",
            "value" : "",
            "visible" : true,
            "editable" : true,
            "input" : "textarea",
            "validation" : {
                "required" : true
            }
        },
        {
            "field" : "programId",
            "label" : "Program ID",
            "value" : "",
            "visible" : false,
            "editable" : false,
            "input" : "text",
            "validation" : {
                "required" : true
            }
        },
        {
            "field" : "solutionId",
            "label" : "Solution ID",
            "value" : "",
            "visible" : false,
            "editable" : false,
            "input" : "text",
            "validation" : {
                "required" : true
            }
        },
        {
            "field" : "city",
            "label" : "Cluster City",
            "value" : "",
            "visible" : true,
            "editable" : true,
            "input" : "text",
            "validation" : {
                "required" : true
            }
        },
        {
            "field" : "state",
            "label" : "Cluster State",
            "value" : "",
            "visible" : true,
            "editable" : true,
            "input" : "text",
            "validation" : {
                "required" : true
            }
        }
      ],
      types : [
        {
            "label" : "Type of SMC 1",
            "value" : "SMC1"
        },
        {
            "label" : "Type of SMC 2",
            "value" : "SMC2"
        }
      ],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let stateEntity = {
      name: "state",
      regsitryDetails: {
        name: "stateRegsitry"
      },
      profileFields : [
        "externalId",
        "name",
        "region",
        "capital"
      ],
      profileForm : [],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let hubEntity = {
      name: "hub",
      regsitryDetails: {
        name: "hubRegsitry"
      },
      profileFields : [
        "externalId",
        "name"
      ],
      profileForm : [],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let zoneEntity = {
      name: "zone",
      regsitryDetails: {
        name: "zoneRegsitry"
      },
      profileFields : [
        "externalId",
        "name"
      ],
      profileForm : [],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let talukEntity = {
      name: "taluk",
      regsitryDetails: {
        name: "talukRegsitry"
      },
      profileFields : [
        "externalId",
        "name",
        "district",
        "state"
      ],
      profileForm : [],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let regionEntity = {
      name: "region",
      regsitryDetails: {
        name: "regionRegsitry"
      },
      profileFields : [
        "externalId",
        "name",
        "state"
      ],
      profileForm : [],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let mandalEntity = {
      name: "mandal",
      regsitryDetails: {
        name: "mandalRegsitry"
      },
      profileFields : [
        "externalId",
        "name",
        "district",
        "state"
      ],
      profileForm : [],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    let complexEntity = {
      name: "complex",
      regsitryDetails: {
        name: "complexRegsitry"
      },
      profileFields : [
        "externalId",
        "name",
        "mandal",
        "district",
        "state"
      ],
      profileForm : [],
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      isDeleted: false
    }

    return await db.collection('entityTypes').insertMany([
      schoolEntity,
      parentEntity,
      teacherEntity,
      schoolLeaderEntity,
      blockEntity,
      districtEntity,
      clusterEntity,
      stateEntity,
      hubEntity,
      zoneEntity,
      talukEntity,
      regionEntity,
      mandalEntity,
      complexEntity
    ]);

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
