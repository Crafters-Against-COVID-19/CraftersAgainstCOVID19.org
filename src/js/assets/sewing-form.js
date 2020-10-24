(function(window, document){
  var $display_batches = document.getElementById("display-batches"),
      $pattern = document.getElementById("field-pattern"),
      $batch_name = document.getElementById("field-batch_name"),
      $batch_date = document.getElementById("field-batch_date"),
      $beneficiaries = document.getElementById("field-beneficiaries"),
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
        limit = 2;
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
  function setBatchDetails()
  {
    var batches = open_batches,
        pattern = $pattern.value,
        count = batches.length,
        batch,
        end_date, day, date;
    while ( count-- )
    {
      batch = batches[count];
      if ( batch.pattern_name == pattern )
      {
        // end_date = new Date( batch.end + " 23:59:59 GMT-0700" );
        end_date = batch.end.split('-');
        end_date.forEach( (value, key) => {
          end_date[key] = parseInt( value, 10 );
        });
        // UTC = +7 hours from Seattle
        end_date = new Date( Date.UTC( end_date[0], end_date[1] - 1, end_date[2] + 1, 06, 59, 59 ) );
        day = days[end_date.getDay()];
        date = ( end_date.getMonth() + 1 ) + "/" + end_date.getDate();
        $batch_name.value = batch.name;
        $batch_date.value = day + ", " + date;
        $beneficiaries.value = batch.beneficiaries;
      }
    }
  }
  function disableUnusedPatterns()
  {
    var patterns = [];
    open_batches.forEach(function( batch ){
      var pattern = batch.pattern_name;
      if ( patterns.indexOf( pattern ) < 0 )
      {
        patterns.push( pattern );
      }
    });
    $pattern.querySelectorAll('option').forEach(function( $option ){
      if ( patterns.indexOf( $option.value ) < 0 )
      {
        $option.disabled = true;
      }
      else
      {
        $option.disabled = false;
      }
    });
  }
  function update()
  {
    updateOpenBatches();
    updateDisplayBatches();
    disableUnusedPatterns();
    setBatchDetails();
  }

  window.addEventListener( "DOMContentLoaded", function(){
    // update everything
    update();
    // track changes
    $pattern.addEventListener("change", setBatchDetails, false);
    // start the timer
    minute_timer.postMessage("start");
    minute_timer.addEventListener("message", update, false);
    // set the timer stopper
    document.querySelector("form[name=sewing]").addEventListener("submit",function(){
      minute_timer.postMessage("stop");
      return true;
    });
  }, false);

  document.getElementById("field-js-on").value = "on";

}(window, window.document));
