(function(window, document){
  var $display_batches = document.getElementById("display-batches"),
      $pattern = document.getElementById("field-pattern"),
      $batch_name = document.getElementById("field-batch_name"),
      $batch_date = document.getElementById("field-batch_date"),
      days = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");

  function updateOpenBatches() {
    var updated_batches = [],
        count = open_batches.length,
        now = Date.now(),
        batch, cutoff;
    while ( count-- )
    {
      batch = open_batches[count];
      cutoff = new Date( batch.cutoff + "T12:00:00" );
      if ( cutoff > now )
      {
        updated_batches.push( batch );
      }
    }
    open_batches = updated_batches.reverse();
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
    var batches = open_batches.reverse(),
        pattern = $pattern.value,
        count = batches.length,
        batch,
        end_date, day, date;
    while ( count-- )
    {
      batch = batches[count];
      if ( batch.pattern_name == pattern )
      {
        end_date = new Date( batch.end + "T12:00:00" );
        day = days[end_date.getDay()];
        date = ( end_date.getMonth() + 1 ) + "/" + end_date.getDate();
        $batch_name.value = batch.name;
        $batch_date.value = day + ", " + date;
      }
    }
  }

  window.addEventListener( "DOMContentLoaded", function(){
    // update open batches
    updateOpenBatches();
    updateDisplayBatches();
    // Setup the batch info
    setBatchDetails();
    $pattern.addEventListener("change", setBatchDetails, false);
  }, false);

}(window, window.document));