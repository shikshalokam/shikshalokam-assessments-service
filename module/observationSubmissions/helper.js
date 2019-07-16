const PdfPrinter = require('pdfmake');
const fs = require('fs');

module.exports = class observationSubmissionsHelper {

    static observationData(observationSubmissions, generalInformation, options) {
        return new Promise(async (resolve, reject) => {
            try {

                let pdfData = {}

                // Set Header
                pdfData["header"] = function (page) {

                    if (page != 1) {
                        let headerObj = {
                            columns: [
                                {
                                    image: ROOT_PATH + '/roboto/shikshalokam.png',
                                    width: 40,
                                    alignment: 'left'
                                },
                                {
                                    text: "Questions And Submitted Answers",
                                    color: 'black',
                                    marginTop: 10,
                                    fontSize: 18,
                                    alignment: 'center',
                                    width: '*',
                                }
                            ],
                            marginBottom: 10
                        };
                        return headerObj
                    }
                    else {
                        return { text: 'Observation Submission', width: 30, marginLeft: 10, marginTop: 10, alignment: 'center', fontSize: 18 }
                    }
                }

                // Set Footer
                pdfData.footer = function (currentPage, pageCount) {
                    return {
                        margin: 10,
                        columns: [
                            {
                                fontSize: 12,
                                text: [
                                    {
                                        text: 'shikshalokam ',
                                        alignment: 'left',
                                    },
                                    {
                                        text: currentPage.toString() + ' of ' + pageCount,
                                        alignment: 'right'
                                    }
                                ],
                                alignment: 'center'
                            }
                        ]
                    };

                }

                let countQuestion = 0

                function generateTable() {
                    let tableData = {
                        style: ['tableStyle'],
                        table: {
                            // "headerRows": 0,
                            dontBreakRows: true,
                            body: []
                        }
                    }

                    return tableData
                }

                function textData(question, answer) {
                    let textDataTable = generateTable()
                    textDataTable["table"]["widths"] = ['100%']

                    let textObject = {}
                    textObject["ol"] = []

                    textObject.ol.push(
                        { text: `Q.NO${countQuestion + 1}. ${question}`, listType: 'none', bold: true, margin: 8 },
                        {
                            ul: [

                                { text: `${answer}`, margin: [8, 3, 4, 5], listType: 'none', decoration: 'underline', decorationStyle: 'double' }
                            ]
                        }
                    )

                    ++countQuestion;

                    return textDataTable.table.body.push([textObject])

                }

                function radioData(options, qid, value) {
                    let radio = generateTable()
                    radio["table"]["widths"] = ['100%']

                    let radioObject = {}
                    radioObject["ol"] = []
                    radioObject["style"] = "radioBtns"

                    let radioResponseArray = [];

                    if (options[qid]) {

                        options[qid].questionOptions.forEach(option => {

                            let checkBoxIcon = makeCheckBox()
                            let radioText = {
                                text: `${option.label}`, marginTop: -18, marginLeft: 24, listType: 'none',
                            }

                            if (option.value === value) {

                                radioResponseArray.push(
                                    checkBoxIcon, radioText)
                            } else {
                                checkBoxIcon.color = "white"
                                console.log(checkBoxIcon)
                                radioResponseArray.push(checkBoxIcon, radioText)
                            }
                        })

                        radioObject.ol.push(
                            {
                                text: `${countQuestion + 1}. ${options[qid].questionName[0]}`, listType: 'none', bold: true, margin: [5, 5, 5, 3]
                            },
                            {
                                style: "text",
                                ul: radioResponseArray
                            }
                        )

                        radio.table.body.push([radioObject])
                        ++countQuestion
                        return radio
                    }
                }

                function generateSliderData(maxValue, currentValue, question) {
                    let slider = generateTable()
                    slider["table"]["widths"] = ['100%']
                    slider["layout"] = generateTableLayout().layout
                    let sliderObject = {}
                    sliderObject["ol"] = []


                    let getSliderData = generateSlider(parseInt(maxValue), parseInt(currentValue))

                    sliderObject.ol.push({ text: `${countQuestion + 1}. ${question}`, listType: 'none', bold: true, margin: 5 }, {
                        ul: [{
                            style: "text",
                            canvas: getSliderData,

                            // style: "sliderMargin",
                        }, { text: `${currentValue} of ${maxValue}`, listType: 'none' }]
                    })

                    // [{
                    //     canvas: getSliderData,
                    //     // style: "sliderMargin",
                    // }], [{ text: `${parseInt(currentValue)} of ${parseInt(maxValue)}` }
                    slider.table.body.push([sliderObject])

                    ++countQuestion
                    return slider
                }

                function generateTableLayout() {
                    let tableLayout = {}

                    tableLayout["layout"] = {
                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? "black" : "#b0b6bf";
                        },

                        vLineColor: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? "black" : "#b0b6bf";
                        }
                    }

                    return tableLayout

                }

                function textDecoration() {
                    let textStyle = {
                        margin: [8, 3, 4, 5],
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: 'black'
                    }
                    return textStyle
                }

                function styles() {
                    let styles = {
                        tableStyle: {
                            borderRadius: 10,
                            fillColor: '#b0b6bf',
                            width: 300,
                            fontSize: 15,
                            margin: [10, 30, 10, 10],
                            border: 10
                        },
                        materialIcons: {
                            fontSize: 16,
                            font: 'materialIcons',
                            marginTop: 30
                        },
                        radioBtns: {
                            width: 531
                        },
                        text: {
                            marginTop: 10,
                            marginBottom: 15,
                            marginLeft: 8
                        },
                        sliderMargin: {
                            margin: [10, 30, 10, 10]
                        },
                        header: {
                            alignment: 'center'
                        }
                    }

                    return styles
                }

                let sliderData = {
                    type: 'rect',
                    text: 2,
                    x: 0,
                    y: 0,
                    w: 50,
                    h: 40,
                    // opacity: 0.1,
                    color: "white",
                    lineColor: 'black'
                }

                function generateSlider(maximumValue, value) {
                    let canvasArray = new Array()

                    let allSelectedObject = JSON.parse(JSON.stringify(sliderData))
                    let notSelectedObject = JSON.parse(JSON.stringify(sliderData))

                    for (let pointerToMaximumValue = 0; pointerToMaximumValue < maximumValue; pointerToMaximumValue++) {
                        if (pointerToMaximumValue <= value) {
                            allSelectedObject.color = "green"
                            allSelectedObject.w += 100
                        } else {
                            notSelectedObject.w += 10
                        }
                    }
                    canvasArray.push(allSelectedObject, notSelectedObject)
                    return canvasArray
                }

                function makeCheckBox() {
                    let checkBox = {
                        "text": "",
                        "style": "materialIcons",
                        listType: 'none',
                        // "marginLeft": 8
                    }

                    return checkBox
                }

                pdfData["content"] = []

                pdfData["styles"] = styles()

                let generalInformationTable = generateTable()
                generalInformationTable["table"]["widths"] = ['50%', '50%']
                generalInformationTable["pageBreak"] = 'after'

                let generalInformationTitle = {}

                generalInformationTitle["text"] = "General Information";
                generalInformationTitle["alignment"] = "center";
                generalInformationTitle["fontSize"] = 20;
                generalInformationTitle["background"] = "gray";
                generalInformationTitle["width"] = "auto";
                generalInformationTitle["fillColor"] = "#c2c3c4";

                await Object.keys(generalInformation).forEach(eachObservation => {
                    generalInformationTable.table.body.push([
                        {
                            text: eachObservation,
                            margin: 8
                        },

                        _.merge({
                            text: generalInformation[eachObservation],
                        }, textDecoration())
                    ])
                })

                generalInformationTable["layout"] = generateTableLayout().layout

                let answerDocument = Object.values(observationSubmissions.answers)

                let allData = []

                for (let pointerToAnswer = 0; pointerToAnswer < answerDocument.length; pointerToAnswer++) {

                    if (answerDocument[pointerToAnswer].responseType != "matrix" &&
                        answerDocument[pointerToAnswer].value != undefined) {

                        let result

                        if (answerDocument[pointerToAnswer].responseType === "text") {
                            result = textData(answerDocument[pointerToAnswer].payload.question[0], answerDocument[pointerToAnswer].payload.labels[0])
                        }

                        if (answerDocument[pointerToAnswer].responseType === "radio") {
                            result = radioData(options, answerDocument[pointerToAnswer].qid, answerDocument[pointerToAnswer].value)
                        }

                        if (answerDocument[pointerToAnswer].responseType === "slider") {


                            let currentAnswer = answerDocument[pointerToAnswer]

                            if (options[currentAnswer.qid] && options[currentAnswer.qid].maximumValue) {

                                result = generateSliderData(options[currentAnswer.qid].maximumValue, currentAnswer.value, answerDocument[pointerToAnswer].payload.question[0])
                            }
                        }
                        allData.push(result)
                    }

                    // Logic for Matrix question

                    // else {
                    //     if (answerDocument[pointerToAnswer].value || answerDocument[pointerToAnswer].value == 0) {
                    //         for (let instance = 0; instance < answerDocument[pointerToAnswer].value.length; instance++) {
                    //             Object.values(answerDocument[pointerToAnswer].value[instance]).forEach(eachInstanceAnswer => {
                    //                 let textData = {}
                    //                 textData["ol"] = []
                    //                 if (eachInstanceAnswer.responseType === "radio") {
                    //                     let radioResponseArray = [];
                    //                     let radioData = {}
                    //                     radioData["ol"] = []
                    //                     radioData["style"] = "radioBtns"

                    //                     if (options[eachInstanceAnswer.qid]) {

                    //                         options[eachInstanceAnswer.qid].questionOptions.forEach(option => {

                    //                             let checkBoxIcon = makeCheckBox()
                    //                             let radioText = {
                    //                                 text: `${option.label}`, marginTop: -18, marginLeft: 24, listType: 'none',
                    //                             }

                    //                             if (option.value === eachInstanceAnswer.value) {

                    //                                 radioResponseArray.push(
                    //                                     checkBoxIcon, radioText)
                    //                             } else {
                    //                                 checkBoxIcon.color = "#f7fcff"
                    //                                 radioResponseArray.push(checkBoxIcon, radioText)
                    //                             }
                    //                         })

                    //                         radioData.ol.push(
                    //                             {
                    //                                 text: `Q.NO${countQuestion + 1} ${options[eachInstanceAnswer.qid].questionName[0]}`, listType: 'none', bold: true, margin: 6
                    //                             },
                    //                             {
                    //                                 ul: radioResponseArray
                    //                             }
                    //                         )
                    //                         text.table.body.push([radioData])
                    //                     }
                    //                 }
                    //                 if (eachInstanceAnswer.responseType === "text") {
                    //                     textData.ol.push(
                    //                         { text: `Q.NO ${eachInstanceAnswer.payload.question[0]}`, listType: 'none', bold: true, margin: 8 },
                    //                         {
                    //                             ul: [

                    //                                 { text: `${eachInstanceAnswer.payload.labels[0]}`, margin: [8, 3, 4, 5], listType: 'none', decoration: 'underline', decorationStyle: 'double' }
                    //                             ]
                    //                         }
                    //                     )

                    //                     text.table.body.push([textData])

                    //                 }
                    //             })
                    //         }
                    //     }
                    // }
                }

                pdfData["content"].push(
                    {
                        image: ROOT_PATH + '/roboto/shikshalokam.png',
                        width: 200,
                        alignment: 'center'
                    },
                    generalInformationTitle, generalInformationTable, allData)

                let generatePdf = this.generatePdf(pdfData)

                console.log("here")
            }
            catch (error) {
                console.log(error)
            }
        })
    }

    static generatePdf(pdfData) {
        let fonts = {
            Roboto: {
                normal: ROOT_PATH + "/roboto/Roboto-Regular.ttf",
                bold: ROOT_PATH + '/roboto/Roboto-Medium.ttf',
                italics: ROOT_PATH + '/roboto/Roboto-Italic.ttf',
                bolditalics: ROOT_PATH + '/roboto/Roboto-MediumItalic.ttf'
            }, materialIcons: {
                normal: 'roboto/materialdesignicons-webfont.ttf'
            }
        };

        let printer = new PdfPrinter(fonts);
        let pdfDoc = printer.createPdfKitDocument(pdfData);
        pdfDoc.pipe(fs.createWriteStream(ROOT_PATH + '/pdfs/aman.pdf'));
        pdfDoc.end();
    }
}
