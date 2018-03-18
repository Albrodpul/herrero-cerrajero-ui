(function ($) {
    $(function () {

        $('select').material_select();

        $('.button-collapse').sideNav();

        $(document).ready(function () {
            $('.collapsible').collapsible();
        });


        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            hover: false, // Activate on hover
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'right' // Displays dropdown with edge aligned to the left of button
        });

        $(document).ready(function () {
            $('ul.tabs').tabs();
        });

        $('#modal1').modal().modal('open');

    }); // end of document ready
})(jQuery); // end of jQuery name space