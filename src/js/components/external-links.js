(function(doc){
  function setupExternalLinks() {
    var $external_links = doc.querySelectorAll('a[href^="https://"]:not([rel="external"])'),
        count = $external_links.length,
        $note = doc.createDocumentFragment(),
        $em = doc.createElement("em");
    $em.classList.add("sr-only");
    $em.appendChild( doc.createTextNode("(opens in a new window)") )
    $note.appendChild( doc.createTextNode(" ") );
    $note.appendChild( $em );
    while ( count-- )
    {
      $external_links[count].setAttribute('rel', 'external');
      $external_links[count].setAttribute('target', '_blank');
      $external_links[count].appendChild( $note.cloneNode(true) );
    }
  }
  function handleExternalLinks(e) {
    var $external_link = e.target.closest('a[rel="external"]');
    if ( $external_link )
    {
      e.preventDefault();
      window.open( $external_link.href );
    }
  }
  setupExternalLinks();
  doc.body.addEventListener( 'click', handleExternalLinks, false );
}(window.document));