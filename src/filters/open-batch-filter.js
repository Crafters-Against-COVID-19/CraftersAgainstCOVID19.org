module.exports = function openBatchFilter(array) {
  return array.filter(batch => {
    return Date.now() < Date.parse( batch.cutoff + "T12:00:00" );
  });  
};
