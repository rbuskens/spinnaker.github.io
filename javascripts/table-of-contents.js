// Adapted from https://github.com/ghiculescu/jekyll-table-of-contents
(function($){
    $.fn.mytoc = function(options) {
	var defaults = {
	    minimumHeaders: 1,
	    headers: 'h1, h2',
	    listType: 'ul' // values: [ol|ul]
	},
	settings = $.extend(defaults, options);

	function fixedEncodeURIComponent (str) {
	    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
    }

    var headers = $(settings.headers).filter(function() {
      // get all headers with an ID
      var previousSiblingName = $(this).prev().attr( "name" );
      if (!this.id && previousSiblingName) {
        this.id = $(this).attr( "id", previousSiblingName.replace(/\./g, "-") );
      }
      return this.id;
    }), output = $(this);
    if (!headers.length || headers.length < settings.minimumHeaders || !output.length) {
      $(this).hide();
      return;
    }

    render = function() { output.html(html); }

    var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10); }

    var level = get_level(headers[0]),
      this_level,
      html = "";
    headers.on('click', function() {
      window.location.hash = this.id;
    })
    .addClass('clickable-header')
    .each(function(_, header) {
      this_level = get_level(header);
      if (this_level === level) // same level as before; same indenting
        html += "<li><a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      else if (this_level <= level){ // higher level than before; end parent ol
        for(i = this_level; i < level; i++) {
          html += "</li></ul>"
        }
        html += "<li><a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      }
      else if (this_level > level) { // lower level than before; expand the previous to contain a ol
        for(i = this_level; i > level; i--) {
          html += "<ul><li>"
        }
        html += "<a href='#" + fixedEncodeURIComponent(header.id) + "'>" + header.innerHTML + "</a>";
      }
      level = this_level; // update for the next one
    });
    html += "</ul>";

    render();
  };
})(jQuery);

$(document).ready(function() {
  $('#mytoc').mytoc();
});
