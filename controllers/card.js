const Card = require("../models/card");
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
let csvFileNames = ['Sample Card Status Info - Delivery exceptions.csv', 'Sample Card Status Info - Delivered.csv',  'Sample Card Status Info - Pickup.csv', 'Sample Card Status Info - Returned.csv'];

const processCSVFiles = async (req, res, next) => {
    const promises = csvFileNames.map(async (csvFileName) => {
      const csvFilePath = path.join(__dirname, '/..', 'csvFiles', csvFileName);
      const readStream = fs.createReadStream(csvFilePath);
  
      return new Promise((resolve, reject) => {
        readStream.pipe(csv())
          .on('data', async (row) => {
            const status = await getLastWordBeforeExtension(csvFileName);
          
            let mobile_no;
            if(!row.hasOwnProperty('User contact')){
               mobile_no = String(parseInt(row['User Mobile'].replace(/"/g, ''), 10))
            }else{
               mobile_no =String(parseInt(row['User contact'].replace(/"/g, ''), 10))
            }
            let cardObj = {
                card_id: row['Card ID'],
                user_phone: mobile_no,
                date_time: row.Timestamp,
                comment: row.Comment,
                status: status 
            }
            let createdCard = await Card.create(cardObj)
            
            console.log("cardOBJECT:", createdCard)
          })
          .on('end', () => {
           // console.log(`CSV file ${csvFileName} successfully processed`);
            resolve();
          })
          .on('error', (error) => {
            console.error(`Error during CSV parsing for file ${csvFileName}: ${error.message}`);
            reject(error);
          });
      });
    });
    try {
      await Promise.all(promises);
      console.log('All CSV files successfully processed');
      res.status(200).json({
        success : true,
        message : "All CSV files successfully processed"
      })

    } catch (error) {
        res.status(500).json({
            success : false,
            message : 'Some internal server error',
            error : error.message,
          })
    }
  };
  
function getLastWordBeforeExtension(filename) {
    const filenameWithoutExtension = filename.replace(/\.[^.]+$/, '');
    const words = filenameWithoutExtension.split(' ');
    return words[words.length - 1];
  }

const getCardStatus = async(req, res, next)=>{
    try {
        let phone = req.query.userPhone
        let cardId = req.query.cardId
        console.log("phoneddd ", phone)
        if(!phone && phone == undefined && !cardId && cardId ==undefined){
            return res.status(400).json({
                success : false,
                message : "Please provide user contact or Card Id"
            })
        }
        let cardData = await Card.find({
            $or: [
              { user_phone: phone },
              { card_id: cardId }
            ]
          })
          if(cardData.length == 0){
            return res.status(400).json({
                success : false,
                message : "card status details not found"
            })
          }
        return res.status(200).json({
            success : true,
            message : "Card status details",
            data : cardData
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Some internal server error",
            error : error.message,
          })
    }
}

  module.exports ={ processCSVFiles, getCardStatus}