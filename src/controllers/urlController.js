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
      if (result[0].count) {
        UrlModel.getHashForUrl(data, (err1, urlHashDetail) => {
          if (err1) {
            return res.status(500).send("Internal server error");
          } else {
            const [{ hash }] = urlHashDetail;
            let link = `https://lit.com/${hash}`;
            return res.status(200).json({ success: true, shortLink: link });
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
        UrlModel.urlAdd(data, (err2, urlAddDetail) => {
          if (err2) {
            return res.status(500).send("Internal server error");
          } else {
            let link = `https://lit.com/${data.hash}`;
            return res.status(200).json({ success: true, shortLink: link });
          }
        });
      }
    }
  });
};

const getUserUrls = (req, res) => {
  if (req.user) {
    UrlModel.getUserUrls(req.user, (err, result) => {
      if (err) {
        return res.status(500).send("Internal server error");
      } else {
        return res.status(200).send({ success: true, result });
      }
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

module.exports = { listUrls, getHash, getUserUrls, checkHashDetailsWorking };
