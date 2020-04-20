(function(window, document){
  var $skill = document.getElementById("field-skill"),
      $batch_name = document.getElementById("field-batch_name"),
      $batch_date = document.getElementById("field-batch_date"),
      batches = mask_batches.reverse(),
      days = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
  
  function setBatchDetails()
  {
    var skill_level = $skill.value,
        count = batches.length;
    while ( count-- )
    {
      let batch = batches[count];
      if ( batch.skill_level == skill_level )
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
  $skill.addEventListener("change", setBatchDetails, false);
}(window, window.document));