(function(doc){

  function setupDependentFields() {
    var $dependent_fields = doc.querySelectorAll("[data-dependent-field]"),
        count = $dependent_fields.length;
    while ( count-- )
    {
      new DependentField( $dependent_fields[count], count );
    }
  }

  function DependentField( $group, i ){

    var id = $group.id,
        $form = $group.closest("form"),
        form_name = $form.getAttribute("name"),
        controller_name = $group.dataset.dependentFieldControlledBy,
        trigger_value = $group.dataset.dependentFieldRequiredValue,
        $controlled_by = doc.querySelectorAll( '[name="' + controller_name + '"]' ),
        count = $controlled_by.length,
        $required = $group.querySelectorAll('[required]'),
        required_count = $required.length;

    if ( id == "" )
    {
      id = "dependent-field-group-" + i;
      $group.id = id;
    }   

    while ( count-- ) {
      $controlled_by[count].setAttribute('aria-controls', id);
      $controlled_by[count].addEventListener("change", toggle, false);
    }
    function toggle()
    {
      if ( document.forms[form_name].elements[controller_name].value == trigger_value )
      {
        show();
      }
      else
      {
        hide();
      }
    }
    function show() {
      $group.setAttribute("aria-hidden", false);
      var count = required_count;
      while ( count-- )
      {
        $required[count].required = true;
        $required[count].setAttribute("aria-required", true);
      }
    }
    function hide() {
      $group.setAttribute("aria-hidden", true);
      var count = required_count;
      while ( count-- )
      {
        $required[count].required = false;
        $required[count].removeAttribute("aria-required");
      }
    }

    hide();
  }

  setupDependentFields();

}(window.document));
