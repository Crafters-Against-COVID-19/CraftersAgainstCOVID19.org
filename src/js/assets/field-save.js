(function(window, document){
  var $fields = document.querySelectorAll('[data-save-for-later]'),
      count = $fields.length,
      key = window.location.href + '-saved-fields',
      saved_data = window.localStorage.getItem(key);
  
  function load(){
    saved_data = JSON.parse( saved_data );
    var i = count;
    while ( i-- )
    {
      $fields[i].value = saved_data[$fields[i].id];
    }
  }
  function save(){
    if ( ! saved_data ){
      saved_data = {};
    }
    var i = count;
    while ( i-- )
    {
      saved_data[$fields[i].id] = $fields[i].value;
    }
    window.localStorage.setItem( key, JSON.stringify( saved_data ) );
  }
  function setupListeners(){
    var i = count;
    while ( i-- )
    {
      $fields[i].addEventListener( 'change', save, false );
    }
  }
  
  // boot up
  setupListeners();
  if ( saved_data )
  {
    load();
  }

}(window, window.document));