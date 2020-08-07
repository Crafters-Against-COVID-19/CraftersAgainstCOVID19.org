module.exports = function(){
  var now = Date.now(),
      start = new Date( Date.UTC( 2020, 7, 6, 06, 59, 59 ) ),
      end =  new Date( Date.UTC( 2020, 7, 15, 06, 59, 59 ) );
  return ( now > start ) && ( now < end );
};