let operators = [
    '+',
    '-',
    '/',
    '*',
    '.'
];
let operation = "";
let operations = [];

function calculate() {
    try {
        let result = eval( operation );

        operations.unshift( {
            calcul: operation,
            result,
            date: new Date().getTime()
        } );
        operation = result.toString();
        localStorage.setItem( "operations", JSON.stringify( operations ) );
        display();
        insertHistory();
    } catch (e) {
        $( ".display-container" ).addClass( "error" );
    }
}

function setFontSize( $display ) {
    let length = operation.length;
    let clearsButtons = $( ".clears-buttons-container" );

    if ( length > 0 ) {
        clearsButtons.addClass( "show" );
    } else {
        clearsButtons.removeClass( "show" );
    }
    if ( length <= 10 ) {
        $display.removeClass( "big" );
        $display.removeClass( "medium" );
        $display.removeClass( "small" );
    } else if ( length <= 12 ) {
        $display.addClass( "big" );
        $display.removeClass( "medium" );
        $display.removeClass( "small" );
    } else if ( length <= 14 ) {
        $display.addClass( "medium" );
        $display.removeClass( "big" );
        $display.removeClass( "small" );
    } else if ( length <= 16 ) {
        $display.addClass( "small" );
        $display.removeClass( "big" );
        $display.removeClass( "medium" );
    }
}

function roundDate( date ) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function diff2Dates( date1, date2 ) {
    let one_day = 1000 * 60 * 60 * 24;

    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();

    let difference_ms = date2_ms - date1_ms;

    return Math.round( difference_ms / one_day );
}

function insertHistory() {
    let $html = $( "<div></div>" );
    let now = roundDate( new Date() );
    let historyContainer = $( ".history-container" );

    if ( operations.length > 0 ) {
        for ( let operation of operations ) {
            let date = roundDate( new Date( operation.date ) );

            if ( $html.find( `.day-container[data-day="${ date.toDateString() }"]` ).length > 0 ) {
                $html.find( `.day-container[data-day="${ date.toDateString() }"] .title` ).after(`
                <div class="calcul-container">
                    <div class="operation">${ operation.calcul }</div>
                    <div class="result">${ operation.result }</div>
                </div>` );
            } else {
                let daysAgo = "";
                let diff = diff2Dates( date, now );

                if ( diff === 0 ) {
                    daysAgo = "Today";
                } else if ( diff === 1 ) {
                    daysAgo = "Yesterday";
                } else {
                    daysAgo = diff + " days ago";
                }
                $html.prepend(`
                <div class="day-container" data-day="${ date.toDateString() }">
                    <div class="title">${ daysAgo }</div>
                    <div class="calcul-container">
                        <div class="operation">${ operation.calcul }</div>
                        <div class="result">${ operation.result }</div>
                    </div>
                </div>` );
            }
        }

        historyContainer.html( $html.html() );
        historyContainer.animate( { scrollTop: historyContainer[0].scrollHeight }, 300 );
    } else {
        historyContainer.empty();
    }
}

function supp() {
    if ( operation.length > 0 ) {
        let $display = $( ".display" );

        operation = operation.slice( 0, -1 );
        $display.text( operation );
        $display.scrollLeft( 1000 );

        setFontSize( $display );
        $( ".display-container" ).removeClass( "error" );
    }
}

function ac() {
    if ( operation.length > 0 ) {
        let $display = $( ".display" );

        operation = "";
        $display.text( operation );
        $display.scrollLeft( 1000 );

        setFontSize( $display );
    }
    $( ".display-container" ).removeClass( "error" );
}

function display() {
    let $display = $( ".display" );

    $display.text( operation );
    $display.scrollLeft( 1000 );

    setFontSize( $display );
    $( ".display-container" ).removeClass( "error" );
}

function swipedetect( el, callback ) {

    let touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {
        };

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0];
        swipedir = 'none';
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        // e.preventDefault()
    }, false);

    touchsurface.addEventListener('touchmove', function (e) {
        // e.preventDefault() // prevent scrolling when inside DIV
    }, false);

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime; // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir);
        // e.preventDefault();
    }, false)
}

$( window ).on( "load", function () {

    if ( localStorage.getItem( "operations" ) ) {
        operations = JSON.parse( localStorage.getItem( "operations" ) );
        insertHistory();
    }

    $( document ).on( "click", "#ac", ac );

    $( document ).on( "click", "#sup", supp );

    $( document ).on( "click", ".button-input", function () {
        let $elem = $( this );
        let input = $elem.find( "span" ).html();

        if ( input === "=" ) {
            calculate();
        } else {
            operation += $elem.find( "span" ).html();
            display();
        }
    } );

    $( document ).on( "click", ".expand-buttons", () => $( ".container" ).toggleClass( "history" ) );

    $( document ).on( "click", "#delete-history", function () {
        operations = [];
        localStorage.setItem( "operations", JSON.stringify( operations ) );
        insertHistory();
    } );

    $( document ).on( "keypress", function ( e ) {
        console.log( e );
        e.preventDefault();
        let char = e.charCode;

        console.log( char, String.fromCharCode( char ) );
        if ( char === 13 ) {
            calculate();
        } else if ( operators.indexOf( String.fromCharCode( char ) ) >= 0 ) {
            // Operators authorized
            operation += String.fromCharCode( char );
        } else if ( char >= 48 && char <= 57 ) {
            // Number authorized
            operation += String.fromCharCode( char );
        } else if ( char === 115 || char === 83 ) {
            // Sup
            supp()
        } else if ( char === 97 || char === 65 ) {
            // AC
            ac()
        }
        display();
    } );

    swipedetect( document.getElementsByClassName( "display-container" )[0], function ( dir ) {
        if ( dir === "down" ) {
            $( ".container" ).addClass( "history" );
        }
    } );

    let historyContainer = document.getElementsByClassName( "history-container" );

    swipedetect( historyContainer[0], function ( dir ) {
        if ( dir === "up" && ( ( historyContainer[0].scrollTop + historyContainer[0].offsetHeight ) === historyContainer[0].scrollHeight ) ) {
            $( ".container" ).removeClass( "history" );
        }
    } );

    if ( location.hostname === "sanchezm.fr" ) {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-74712385-7');
    }

} );