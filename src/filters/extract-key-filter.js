module.exports = function openBatchFilter(array, key) {
  let new_array = [];
  array.forEach(item => {
    if ( key in item )
    {
      new_array.push( item[key] );
    }
  });
  return new_array;
};
