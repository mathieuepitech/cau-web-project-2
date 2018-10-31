let operators = [
    '+',
    '-',
    '/',
    '*',
    '.'
];
let operation = "";

function calculate() {
    let $display = $( ".display" );

    try {
        let result = eval( operation );

        $display.text( result );
        operation = result.toString();
    } catch (e) {

    }
}

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
    console.log( char );
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
    }
} );