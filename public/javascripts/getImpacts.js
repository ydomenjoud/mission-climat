function formatNumber(dat, isPercent) {
  
    //cas ou dat est un nombre
    if (!isNaN(Number(dat.replace(",",".")))) {
      var numberFormated = Number(dat.replace(",", "."))
      isPercent == 1 ? numberFormated *= 100 : "kikou"
      return numberFormated
    }
    else {
      return dat
    }

}

function getImpacts(rows, i,j) {
    
    var data = {
        temperature: formatNumber(rows[i][4],0),
        temperatureRange: rows[i+1][4],
        RCP: rows[i+2][4],
        jours35: rows[i+3][4],
        joursSecheresse: rows[i+4][4],
        reductionEmission2030: rows[i+6][4]
    } 
  
    return data
  
  }

  module.exports = getImpacts

  