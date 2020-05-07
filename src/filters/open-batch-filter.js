module.exports = function openBatchFilter(array) {
  return array.filter(batch => {
    return Date.now() < Date.parse( batch.end + "T12:00:00" );
  });  
};
