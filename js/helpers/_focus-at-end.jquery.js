var $ = require('jquery');

/**
 * JQuery function to put the focus on a input element and put the
 * cursor at the end of it.
 */
$.fn.focusAtEnd = function() {

    return this.each(function() {

        $(this).focus();

        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about
            // whether a carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;
            this.setSelectionRange(len, len);
        } else {
            // ... otherwise replace the contents with itself.
            // (Doesn't work in Google Chrome)
            $(this).val($(this).val());
        }

        // Scroll to the bottom, in case we're in a tall textarea
        // (Necessary for Firefox and Google Chrome)
        this.scrollTop = 999999;

    });

};
