const sqlConnection = require("../services/sqlConnection");

const listUrls = (cb) => {
  let sql = `SELECT orglink, hashlink,userId from urls`;
  let values = [];
  sqlConnection.executeQuery(sql, values, (err, result) => {
    cb(err, result);
  });
};

const urlDetail = (data, cb) => {
  let values = [];
  let sql = `SELECT COUNT(*) as count FROM urls where orglink = ?`;
  values.push(data.url);
  sqlConnection.executeQuery(sql, values, (err, result) => {
    cb(err, result);
  });
};

const urlAdd = (data, cb) => {
  let values = [];
  let sql = `
  INSERT into urls(orglink,hashlink,userId)
			values(?,?,1);
  `;
  values.push(data.url);
  values.push(data.hash);

  sqlConnection.executeQuery(sql, values, (err, result) => {
    cb(err, result);
  });
};

const getHashForUrl = (data, cb) => {
  let values = [];
  let sql = `SELECT hashlink as hash FROM urls where orglink = ?`;
  values.push(data.url);
  sqlConnection.executeQuery(sql, values, (err, result) => {
    cb(err, result);
  });
};

const getUserUrls = (data, cb) => {
  console.log("User data");
  console.log(data);
  let values = [];
  let sql = `select * from urls where userId = ?`;
  values.push(data[0].UserId);
  sqlConnection.executeQuery(sql, values, (err, result) => {
    cb(err, result);
  });
  //   cb(null, { user: "test" });
};

// const getMatchingHashes = (data, cb) => {
//   let values = [];
//   let sql = `SELECT COUNT(*) as count FROM urls where hashlink = ?`;
//   values.push(data.hash);
//   sqlConnection.executeQuery(sql, values, (err, result) => {
//     cb(err, result[0]);
//   });
// };

const getMatchingHashes = (data) => {
  return new Promise((resolve, reject) => {
    let values = [];
    let sql = `SELECT COUNT(*) as count FROM urls where hashlink = ?`;
    values.push(data.hash);
    sqlConnection.executeQuery(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
};

module.exports = {
  listUrls,
  urlDetail,
  urlAdd,
  getHashForUrl,
  getUserUrls,
  getMatchingHashes,
};
