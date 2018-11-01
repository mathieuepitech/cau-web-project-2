let operators = [
    '+',
    '-',
    '/',
    '*',
    '.'
];
let operation = "";
let operations = [];

if ( localStorage.getItem( "operations" ) ) {
    operations = JSON.parse( localStorage.getItem( "operations" ) );
    setTimeout( () => insertHistory(), 10 );
}

function calculate() {
    let $display = $( ".display" );

    try {
        let result = eval( operation );

        operations.unshift( {
            calcul: operation,
            result,
            date: new Date().getTime()
        } );
        $display.text( result );
        operation = result.toString();
        setFontSize( $display );
        localStorage.setItem( "operations", JSON.stringify( operations ) );
        insertHistory();
    } catch (e) {

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
                    daysAgo = diff + "days ago";
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
        // historyContainer.scrollTop( historyContainer[0].scrollHeight );
    } else {
        historyContainer.empty();
    }
}

$( document ).on( "click", "#ac", function () {
    if ( operation.length > 0 ) {
        let $display = $( ".display" );

        operation = "";
        $display.text( operation );
        $display.scrollLeft( 1000 );

        setFontSize( $display );
    }
} );

$( document ).on( "click", "#sup", function () {
    if ( operation.length > 0 ) {
        let $display = $( ".display" );

        operation = operation.slice( 0, -1 );
        $display.text( operation );
        $display.scrollLeft( 1000 );

        setFontSize( $display );
    }
} );

$( document ).on( "keypress", "#main-input", function ( e ) {
    let char = e.charCode;
    let $this = $( this );

    if ( char === 13 ) {
        calculate( $this.val() );
    } else if ( operators.indexOf( String.fromCharCode( char ) ) >= 0 ) {
        // Operators
        if ( operators.indexOf( $this.val().split("").pop() ) >= 0 ) {
            e.preventDefault();
        }
    } else if ( ( char >= 48 && char <= 57 ) || char === 40 || char === 41 ) {
        // Number
    } else {
        e.preventDefault();
    }
} );

$( document ).on( "click", ".button-input", function () {
    let $elem = $( this );
    let input = $elem.find( "span" ).html();
    let $display = $( ".display" );

    if ( input === "=" ) {
        calculate();
    } else {
        operation += $elem.find( "span" ).html();
        $display.text( operation );
        $display.scrollLeft( 1000 );

        setFontSize( $display );
    }
} );

$( document ).on( "click", ".expand-buttons", () => $( ".container" ).toggleClass( "history" ) );

$( document ).on( "click", "#delete-history", function () {
    operations = [];
    localStorage.setItem( "operations", JSON.stringify( operations ) );
    insertHistory();
} );