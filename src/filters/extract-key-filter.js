module.exports = function openBatchFilter(array, key) {
  console.log( array );
  let new_array = [];
  array.forEach(item => {
    if ( key in item )
    {
      new_array.push( item[key] );
    }
  });
  console.log( new_array );
  return new_array;
};
