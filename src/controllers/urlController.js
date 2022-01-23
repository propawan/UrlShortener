const UrlModel = require("../models/urlModel");
const { getShortHash } = require("../utils/hashUtil");

const listUrls = (req, res) => {
  UrlModel.listUrls((err, urls) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    } else {
      return res.status(200).json({ success: true, urls });
    }
  });
};

const getHash = async (req, res) => {
  let url = req.query.url;
  let data = { url };
  UrlModel.urlDetail(data, async (err, result) => {
    if (err) {
      return res.status(500).send("Internal server error");
    } else {
      console.log(result);
      if (result[0].count) {
        console.log(result[0].count);
        UrlModel.getHashForUrl(data, (err4, urlHashDetail) => {
          if (err4) {
            return res.status(500).send("Internal server error");
          } else {
            return res.status(200).json({ success: true, urlHashDetail });
          }
        });
      } else {
        let hashlink = getShortHash();
        data.hash = hashlink;
        let unique = false;
        while (!unique) {
          let result = await UrlModel.getMatchingHashes(data);
          if (result.count == 0) {
            unique = true;
          }
        }
        UrlModel.urlAdd(data, (err1, urlAddDetail) => {
          if (err1) {
            return res.status(500).send("Internal server error");
          } else {
            UrlModel.getHashForUrl(data, (err5, urlHashDetail1) => {
              if (err5) {
                return res.status(500).send("Internal server error");
              } else {
                return res.status(200).json({ success: true, urlHashDetail1 });
              }
            });
          }
        });
        // url hash
        // function getUniqueHash(newHash, callback) {
        //   UrlModel.getMatchingHashes(newHash, (err7, hashes) => {
        //     if (err7) {
        //       return res.status(400).send("Hash Details Fetch error");
        //     } else {
        //       if (hashes.count == 0) {
        //         callback(newHash);
        //       } else {
        //         console.log("hashDetails");
        //         console.log(hashes);
        //         hashlink = getShortHash();
        //         newHash.hash = hashlink;
        //         getUniqueHash(newHash);
        //       }
        //     }
        //   });
        // }
        // getUniqueHash(data, (uniqueHash) => {
        //   console.log(`hashlink ${hashlink}`);
        //   console.log(data);
        //   UrlModel.urlAdd(data, (err1, urlAddDetail) => {
        //     if (err1) {
        //       return res.status(500).send("Internal server error");
        //     } else {
        //       UrlModel.getHashForUrl(data, (err5, urlHashDetail1) => {
        //         if (err5) {
        //           return res.status(500).send("Internal server error");
        //         } else {
        //           return res
        //             .status(200)
        //             .json({ success: true, urlHashDetail1 });
        //         }
        //       });
        //     }
        //   });
        // });
      }
    }
  });
};

const getUserUrls = (req, res) => {
  if (req.user) {
    UrlModel.getUserUrls(req.user, (err, result) => {
      return res.status(200).send({ success: true, result });
    });
  } else {
    return res.status(400).send("User not present");
  }
};

const checkHashDetailsWorking = async (req, res) => {
  let hash = req.query.hash;
  let data = { hash };
  let result = await UrlModel.getMatchingHashes(data);
  console.log(result);
  return res.json(result);
};

// Hash Details Inside Normal
//   UrlModel.getHashDetails(data, (err, hashDetails) => {
//     if (err) {
//       return res.status(400).send("Hash Details Fetch error");
//     } else {
//       return res.status(200).json({ success: true, hashDetails });
//     }
//   });

module.exports = { listUrls, getHash, getUserUrls, checkHashDetailsWorking };
