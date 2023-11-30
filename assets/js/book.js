function loadApp() {

    const flipBook = $('.sj-book');

    // Check if the CSS was already loaded

    if (flipBook.width() === 0 || flipBook.height() === 0) {
        setTimeout(loadApp, 10);
        return;
    }

    // Mousewheel

    $('#book-zoom').mousewheel(function (event, delta, deltaX, deltaY) {

        const data = $(this).data(),
            step = 30,
            flipBook = $('.sj-book'),
            actualPos = $('#book-slider').slider('value') * step;

        if (typeof (data.scrollX) === 'undefined') {
            data.scrollX = actualPos;
            data.scrollPage = flipBook.turn('page');
        }

        data.scrollX = Math.min($("#book-slider").slider('option', 'max') * step,
            Math.max(0, data.scrollX + deltaX));

        const actualView = Math.round(data.scrollX / step),
            page = Math.min(flipBook.turn('pages'), Math.max(1, actualView * 2 - 2));

        if ($.inArray(data.scrollPage, flipBook.turn('view', page)) === -1) {
            data.scrollPage = page;
            flipBook.turn('page', page);
        }

        if (data.scrollTimer)
            clearInterval(data.scrollTimer);

        data.scrollTimer = setTimeout(function () {
            data.scrollX = undefined;
            data.scrollPage = undefined;
            data.scrollTimer = undefined;
        }, 1000);

    });

    // Slider

    $("#book-slider").slider({
        min: 1,
        max: 100,

        start: function (event, ui) {

            if (!window._thumbPreview) {
                _thumbPreview = $('<div />', {'class': 'thumbnail'}).html('<div></div>');
                setPreview(ui.value);
                _thumbPreview.appendTo($(ui.handle));
            } else
                setPreview(ui.value);

            moveBar(false);

        },

        slide: function (event, ui) {

            setPreview(ui.value);

        },

        stop: function () {

            if (window._thumbPreview)
                _thumbPreview.removeClass('show');

            $('.sj-book').turn('page', Math.max(1, $(this).slider('value') * 2 - 2));

        }
    });


    // URIs

    Hash.on('^page\/([0-9]*)$', {
        yep: function (path, parts) {

            const page = parts[1];

            if (page !== undefined) {
                if ($('.sj-book').turn('is'))
                    $('.sj-book').turn('page', page);
            }

        },
        nop: function (path) {

            if ($('.sj-book').turn('is'))
                $('.sj-book').turn('page', 1);
        }
    });

    // Arrows

    $(document).keydown(function (e) {

        const previous = 37, next = 39;

        switch (e.keyCode) {
            case previous:

                $('.sj-book').turn('previous');

                break;
            case next:

                $('.sj-book').turn('next');

                break;
        }

    });


    // Flip Book

    flipBook.bind(($.isTouch) ? 'touchend' : 'click', zoomHandle);

    flipBook.turn({
        elevation: 50,
        acceleration: !isChrome(),
        autoCenter: true,
        gradients: true,
        duration: 1000,
        pages: 112,
        when: {
            turning: function (e, page, view) {

                const book = $(this),
                    currentPage = book.turn('page'),
                    pages = book.turn('pages');

                if (currentPage > 3 && currentPage < pages - 3) {

                    if (page === 1) {
                        book.turn('page', 2).turn('stop').turn('page', page);
                        e.preventDefault();
                        return;
                    } else if (page === pages) {
                        book.turn('page', pages - 1).turn('stop').turn('page', page);
                        e.preventDefault();
                        return;
                    }
                } else if (page > 3 && page < pages - 3) {
                    if (currentPage === 1) {
                        book.turn('page', 2).turn('stop').turn('page', page);
                        e.preventDefault();
                        return;
                    } else if (currentPage === pages) {
                        book.turn('page', pages - 1).turn('stop').turn('page', page);
                        e.preventDefault();
                        return;
                    }
                }

                updateDepth(book, page);

                if (page >= 2)
                    $('.sj-book .p2').addClass('fixed');
                else
                    $('.sj-book .p2').removeClass('fixed');

                if (page < book.turn('pages'))
                    $('.sj-book .p111').addClass('fixed');
                else
                    $('.sj-book .p111').removeClass('fixed');

                Hash.go('page/' + page).update();

            },

            turned: function (e, page, view) {

                const book = $(this);

                if (page === 2 || page === 3) {
                    book.turn('peel', 'br');
                }

                updateDepth(book);

                $('#book-slider').slider('value', getViewNumber(book, page));

                book.turn('center');

            },

            start: function (e, pageObj) {

                moveBar(true);

            },

            end: function (e, pageObj) {

                const book = $(this);

                updateDepth(book);

                setTimeout(function () {

                    $('#book-slider').slider('value', getViewNumber(book));

                }, 1);

                moveBar(false);

            },

            missing: function (e, pages) {

                for (let i = 0; i < pages.length; i++) {
                    addPage(pages[i], $(this));
                }

            }
        }
    });


    $('#book-slider').slider('option', 'max', numberOfViews(flipBook));

    flipBook.addClass('animated');

    // Show canvas

    $('#book-canvas').css({visibility: ''});
}

// Hide canvas

$('#book-canvas').css({visibility: 'hidden'});

// Load turn.js

yepnope({
    test: Modernizr.csstransforms,
    yep: ['./assets/js/libs/turnjs4/lib/turn.min.js'],
    nope: ['./assets/js/libs/turnjs4/lib/turn.html4.min.js', './assets/js/libs/turnjs4/css/jquery.ui.html4.css', './assets/js/libs/turnjs4/css/book-html4.css'],
    both: ['./assets/js/libs/turnjs4/js/book.js', './assets/js/libs/turnjs4/css/jquery.ui.css', './assets/js/libs/turnjs4/css/book.css'],
    complete: loadApp
});