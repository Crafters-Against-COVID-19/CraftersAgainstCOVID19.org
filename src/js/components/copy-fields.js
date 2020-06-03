(function(doc){

  var $input = doc.createElement('input'),
      $label = doc.createElement('label');
  
  $input.type = 'checkbox';
  $label.classList.add('question--confirm');
  
  function setupCopyFields() {
    var $copy_fields = doc.querySelectorAll("[data-copy-fields]"),
        count = $copy_fields.length;
    while ( count-- )
    {
      new CopyField( $copy_fields[count], count );
    }
  }

  function CopyField( $group, i ){

    var $copy = $label.cloneNode(true),
        $copy_field = $input.cloneNode(true),
        instructions = $group.dataset.copyFields.split('|'),
        label = $group.dataset.copyFieldsLabel,
        $container = $group.firstChild.cloneNode( true ),
        targets = [];
    
    instructions.forEach(pair => {
      pair = pair.split('::');
      var $source = doc.querySelector('[name=' + pair[0] + ']'),
          $target = doc.querySelector('[name=' + pair[1] + ']');
      $target.$source = $source;
      targets.push($target);
    });

    function toggle( e )
    {
      if ( !! e.target.checked )
      {
        targets.forEach($field => {
          if ( $field.matches('[type=checkbox]') )
          {
            $field.checked = $field.$source.checked;
          }
          else
          {
            $field.value = $field.$source.value;
          }
        });
      }
      else
      {
        targets.forEach($field => $field.value = '');
      }
    }

    // set up the field
    $copy_field.addEventListener('change', toggle, false);
    $copy.appendChild( $copy_field );
    console.log(label);
    $copy.appendChild( doc.createTextNode(label) );
    $container.innerHTML = '';
    $container.appendChild( $copy );
    $group.insertBefore( $container, $group.firstChild );

  }

  setupCopyFields();

}(window.document));
