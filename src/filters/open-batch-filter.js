module.exports = function openBatchFilter(array) {
  return array.filter(batch => {
    console.log(batch.name);  
    if ( batch.open )
    {
      return Date.now() < Date.parse( batch.end );
    }
    // not open
    return false;
  });  
};
