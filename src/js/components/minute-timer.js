var interval = false,
    timing = false;

self.addEventListener('message', function(e){
  switch (e.data) {
    case 'start':
      if ( !timing )
      {
        timing = true;
        interval = setInterval(function(){
          self.postMessage('tick');
        }, 60000);
      }
      break;
    case 'stop':
      clearInterval( interval );
      timing = false;
      break;
  }
}, false);