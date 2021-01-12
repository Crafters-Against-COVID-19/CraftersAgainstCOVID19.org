(function(window, document){
  var $display_batches = document.getElementById("display-batches"),
      $pattern_picker = document.getElementById("field-pattern-picker"),
      $pattern = document.getElementById("field-pattern"),
      $batch_name = document.getElementById("field-batch_name"),
      $batch_date = document.getElementById("field-batch_date"),
      $batch_pickup = document.getElementById("field-batch_pickup"),
      $beneficiary = document.getElementById("field-beneficiary"),
      $submit = document.querySelector("button"),
      days = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
      minute_timer = new Worker('/js/components/minute-timer.js');

  function updateOpenBatches() {
    var updated_batches = [],
        count = open_batches.length,
        now = Date.now(),
        batch, cutoff;
    while ( count-- )
    {
      batch = open_batches[count];
      // cutoff = new Date( batch.cutoff + " 23:59:59 GMT-07:00" );
      cutoff = batch.cutoff.split('-');
      cutoff.forEach( (value, key) => {
        cutoff[key] = parseInt( value, 10 );
      });
      // UTC = +7 hours from Seattle
      cutoff = new Date( Date.UTC( cutoff[0], cutoff[1] - 1, cutoff[2] + 1, 06, 59, 59 ) );
      if ( cutoff > now )
      {
        updated_batches.unshift( batch );
      }
    }
    open_batches = updated_batches;
  }
  function updateDisplayBatches() {
    var html = "",
        $html = document.getElementById("batches").content,
        batches = open_batches,
        batch,
        i = 0,
        limit = 1;
    for ( ; i < limit; i++ )
    {
      batch = batches[i];
      if ( batch )
      {
        html += $html.querySelector('[data-batch-name="' + batch.name + '"]').outerHTML;
      }
    }
    $display_batches.innerHTML = html;
    
  }
  function updateHiddenFields() {
    var batch = open_batches[0],
        the_date,
        day, date;
    
    $batch_name.value = batch.name;
    
    // end date
    the_date = batch.end.split('-')
    // end_date = new Date( batch.end + " 23:59:59 GMT-0700" );
    the_date.forEach( (value, key) => {
      the_date[key] = parseInt( value, 10 );
    });
    // UTC = +7 hours from Seattle
    the_date = new Date( Date.UTC( the_date[0], the_date[1] - 1, the_date[2] + 1, 06, 59, 59 ) );
    day = days[the_date.getDay()];
    date = ( the_date.getMonth() + 1 ) + "/" + the_date.getDate();
    $batch_date.value = day + ", " + date;

    // pickup date
    the_date = batch.pickup.split('-')
    the_date.forEach( (value, key) => {
      the_date[key] = parseInt( value, 10 );
    });
    // UTC = +7 hours from Seattle
    the_date = new Date( Date.UTC( the_date[0], the_date[1] - 1, the_date[2] + 1, 06, 59, 59 ) );
    day = days[the_date.getDay()];
    date = ( the_date.getMonth() + 1 ) + "/" + the_date.getDate();
    $batch_pickup.value = day + ", " + date;
  }
  function updatePatterns() {
    var html = "",
        $masks = $display_batches.querySelector( ".batch" ).querySelectorAll( ".batch__mask" ),
        i = $masks.length;
    while ( i-- )
    {
      html = "<option>" + $masks[i].dataset.pattern + " (" + $masks[i].dataset.beneficiary + ")</option>" + html;
    }
    $pattern_picker.innerHTML = html;
  }
  function setPatternAndBeneficiary()
  {
    var pattern = $pattern_picker.value || $pattern_picker.options[0].value,
        re = /(.+?)\s\((.+)\)/,
        parsed = pattern.match( re );
    $pattern.value = parsed[1];
    $beneficiary.value = parsed[2];
  }
  function update()
  {
    updateOpenBatches();
    updateDisplayBatches();
    updateHiddenFields();
    updatePatterns();
    setPatternAndBeneficiary();
  }

  window.addEventListener( "DOMContentLoaded", function(){
    // update everything
    update();
    // track changes
    $pattern_picker.addEventListener("change", setPatternAndBeneficiary, false);
    // start the timer
    minute_timer.postMessage("start");
    minute_timer.addEventListener("message", update, false);
    // set the timer stopper
    document.querySelector("form[name=sewing]").addEventListener("submit",function(){
      minute_timer.postMessage("stop");
      $submit.disabled = true;
      return true;
    });
  }, false);

  document.getElementById("field-js-on").value = "on";

}(window, window.document));
