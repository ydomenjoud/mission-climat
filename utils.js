
// utilities
const watch = function (/* Promise */ promise, /* Response */ res) {
  promise
    .then(result => {
      res.status(200).json(result);
    })
    .catch(({errors}) => {
      console.log(errors);
      res.status(500).json({error: 'Error occured'});
    });
};

const formatNumber = function (number, /* boolean */ isPercent) {
  let numberFormated = Number(number.replace(",", "."));
  if (isPercent) {
    numberFormated *= 100;
  }
  return numberFormated;
};

module.exports = {formatNumber, watch};
