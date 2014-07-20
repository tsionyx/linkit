// jQuery extension function
// that scrolls page to specified element
// e.g. $('body').goTo();
(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this;
    }
})(jQuery);