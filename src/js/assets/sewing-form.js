(function(document){
  var $pattern = document.getElementById("field-pattern"),
      $batch_name = document.getElementById("field-batch_name"),
      $batch_date = document.getElementById("field-batch_date"),
      batches = open_batches.reverse(),
      days = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
  
  function setBatchDetails()
  {
    var pattern = $pattern.value,
        count = batches.length;
    while ( count-- )
    {
      let batch = batches[count];
      if ( batch.pattern_name == pattern )
      {
        let end_date = new Date( batch.end + "T12:00:00" ),
            day = days[end_date.getDay()],
            date = ( end_date.getMonth() + 1 ) + "/" + end_date.getDate();
        $batch_name.value = batch.name;
        $batch_date.value = day + ", " + date;
      }
    }
  }

  setBatchDetails();
  $pattern.addEventListener("change", setBatchDetails, false);
}(window.document));